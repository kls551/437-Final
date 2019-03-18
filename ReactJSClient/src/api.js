// Orderly interface to the REST server, providing:
// 1. Standard URL base
// 2. Standard headers to manage CORS and content type
// 3. Guarantee that 4xx and 5xx results are returned as
//    rejected promises, with a payload comprising an
//    array of user-readable strings describing the error.
// 4. All successful post operations return promises that
//    resolve to a JS object representing the newly added
//    entity (all fields, not just those in the post body)
// 5. Signin and signout operations that retain relevant
//    cookie data.  Successful signin returns promise 
//    resolving to newly signed in user.

const baseURL = "http://localhost:3001/";
const headers = new Headers();
var cookie;

headers.set('Content-Type', 'application/JSON', 'multipart/form-data');

const reqConf = {
    headers: {'Content-Type': 'application/JSON'},
    credentials: 'include',
    mode: 'cors'
};

// Helper functions for the comon request types, automatically
// adding verb, headers, and error management.
export function post(endpoint, body) {
    return safeFetch(baseURL + endpoint,'POST', body);
}

export function put(endpoint, body) {
    return safeFetch(baseURL + endpoint,'PUT', body);
}

export function get(endpoint) {
    return safeFetch(baseURL + endpoint, 'GET');
}

export function del(endpoint) {
    return safeFetch(baseURL + endpoint, 'DELETE');
}

// Functions for performing the api requests

/**
 * Sign a user into the service, returning a promise of the 
 * user data
 * @param {{email: string, password: string}} cred
 */
export function signIn(cred) {
   return post("Ssns", cred)
      .then((response) => {
         let location = response.headers.get("Location").split('/');
         cookie = location[location.length - 1];
         return get("Ssns/" + cookie)
      })
      .then(response => response.json())   // ..json() returns a Promise!
      .then(rsp => get('Prss/' + rsp.prsId))
      .then(userResponse => userResponse.json())
      .then(rsp => rsp[0]);
}

/**
 * @returns {Promise} result of the sign out request
 */
export function signOut() {
    return del("Ssns/" + cookie);
}

/**
 * Register a user
 * @param {Object} user
 * @returns {Promise resolving to new user}
 */
export function postPrs(user) {
   return post("Prss", user)
//    .then(rsp => {
//         let location = rsp.headers.get("Location").split('/');
//         return rsp;
//         // return get("Prss/" + location[location.length - 1]); 
//     })  
//    .then(rsp => rsp[0].json());
}

/**
 * @returns {Promise} json parsed data
 */
export function getLsts(userId) {
    console.log(userId);
    return get("Listing" + (userId ? "?owner="+userId : ""))
    .then((res) => res.json());
}

export function getOneLst(lstId) {
    return get("Listing/" + lstId)
    .then((res) => res.json());
}

export function putLst(id, body) {
    return put(`Listing/${id}`, body);
}

export function postLst(body) {
    return post('Listing', body).then((rsp)=> {
        console.log("new listing body ", body);
        let location = rsp.headers.get("Location").split('/');
        return get(`Listing/${location[location.length-1]}`);
    })
   .then(rsp => rsp.json());
}

export function deletedLst(lstId) {
    return del("Listing/" +  lstId);
}

// getting message for converstaion 
export function getImgs(lstId) {
    return get("Listing/" + lstId +"/Images")
    .then((res) => res.json());
}

export function postImg(lstId, img) {
    // return post('Listing/' + lstId + '/Images', img).then((rsp)=> {
    //     let location = rsp.headers.get("Location").split('/');
    //     return get(`Listing/${lstId}/Images`);
    //  })
    return fetch(baseURL + 'Listing/' + lstId + '/Images', {
        method: 'POST',
        body: img,
        headers: {'Content-Type': 'multipart/form-data'},
        credentials: 'include',
        mode: 'cors'
    })
    .then(rsp => {console.log("return form image post ----------"); return rsp;})
    // .catch(err => {console.log(err)});
//     .then((rsp)=> {
//     //   let location = rsp.headers.get("Location").split('/');
//     //   return get(`Listing/${lstId}/Images`);
//    })
   
};

export function safeFetch(url, action, body) {
    if (body) {
        return fetch(url, {
            method: action,
            body: JSON.stringify(body),
            ...reqConf
            })
            .catch(err => {return Promise.reject("Error connection")})
            .then(res => {
                    return checkErrs(res)});
    }
    else {
        return fetch(url, {
            method: action,
            ...reqConf
            })
            .catch(err => 
                {return Promise.reject("Error connection")})
            .then((res, err) => {
                if (err) 
                    return Promise.reject("Error connection");
                else 
                    return checkErrs(res, err);});
    }
}

export function checkErrs(response, err) {
    return new Promise((resolve, reject) => {
        if (response.status >= 400) {
            return response.clone().json().then( (res) =>  {
                var params = "";
                var errtag = errorTranslate(String(res[0].tag), 'en'); 

                if (res[0].params)
                    res[0].params.forEach(
                        field => { params = params + field + ' '})
                errtag += params;
                reject(errtag);
            });
        }
        else {
            resolve(response);
        }
    })
}

const errMap = {
    en: {
        missingField: 'Field missing from request: ',
        badValue: 'Field has bad value: ',
        notFound: 'Entity not present in DB',
        badLogin: 'Email/password combination invalid',
        dupEmail: 'Email duplicates an existing email',
        noTerms: 'Acceptance of terms is required',
        forbiddenRole: 'Role specified is not permitted.',
        noOldPwd: 'Change of password requires an old password',
        oldPwdMismatch: 'Old password that was provided is incorrect.',
        dupTitle: 'Conversation title duplicates an existing one',
        dupEnrollment: 'Duplicate enrollment',
        forbiddenField: 'Field in body not allowed.',
        queryFailed: 'Query failed (server problem).'
    },
    es: {
        missingField: '[ES] Field missing from request: ',
        badValue: '[ES] Field has bad value: ',
        notFound: '[ES] Entity not present in DB',
        badLogin: '[ES] Email/password combination invalid',
        dupEmail: '[ES] Email duplicates an existing email',
        noTerms: '[ES] Acceptance of terms is required',
        forbiddenRole: '[ES] Role specified is not permitted.',
        noOldPwd: '[ES] Change of password requires an old password',
        oldPwdMismatch: '[ES] Old password that was provided is incorrect.',
        dupTitle: '[ES] Conversation title duplicates an existing one',
        dupEnrollment: '[ES] Duplicate enrollment',
        forbiddenField: '[ES] Field in body not allowed.',
        queryFailed: '[ES] Query failed (server problem).'
    },
    swe: {
        missingField: 'Ett fält saknas: ',
        badValue: 'Fält har dåligt värde: ',
        notFound: 'Entitet saknas i DB',
        badLogin: 'Email/lösenord kombination ogilltig',
        dupEmail: 'Email duplicerar en existerande email',
        noTerms: 'Villkoren måste accepteras',
        forbiddenRole: 'Angiven roll förjuden',
        noOldPwd: 'Tidiagre lösenord krav för att updatera lösenordet',
        oldPwdMismatch: 'Tidigare lösenord felaktigt',
        dupTitle: 'Konversationstitel duplicerar tidigare existerande titel',
        dupEnrollment: 'Duplicerad inskrivning',
        forbiddenField: 'Förbjudet fält i meddelandekroppen',
        queryFailed: 'Förfrågan misslyckades (server problem).'
    }
}

/**
 * @param {string} errTag
 * @param {string} lang
 */
export function errorTranslate(errTag, lang = 'en') {
    return errMap[lang][errTag] || 'Unknown Error!';
}
