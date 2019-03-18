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

headers.set('Content-Type', 'application/JSON');

const reqConf = {
    headers: headers,
    credentials: 'include',
};

let newFetch = function (request, options) {
    return fetch(request, options)
        .catch(err => Promise.reject(["Server Connect Error"]))
        .then(res => {
            return res.ok ? res : createError(res);});
}

export function post(endpoint, body) {
    return newFetch(baseURL + endpoint, {
        method: 'POST',
        body: JSON.stringify(body),
        ...reqConf
    });
}

export function put(endpoint, body) {
    return newFetch(baseURL + endpoint, {
        method: 'PUT',
        body: JSON.stringify(body),
        ...reqConf
    });
}

export function get(endpoint) {
    return newFetch(baseURL + endpoint, {
        method: 'GET',
        ...reqConf
    });
}

export function del(endpoint) {
    return newFetch(baseURL + endpoint, {
        method: 'DELETE',
        ...reqConf
    });
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
}

/**
 * @returns {Promise} json parsed data
 */
export function getLsts(userId, price, numbeds) {
    console.log(userId, price, numbeds);
    return get("Listing" + (userId ? "?owner="+userId : "")+
        (price ? "?price="+price : "")+
        (numbeds ? "?numbed="+numbeds : ""))
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

export function postImg(lstId, body) {
    return post("Listing/"+lstId+"/Images", 
    {filePath: body});
}

export function safeFetch(url, action, body) {
    if (body) {
        return fetch(url, {
            method: action,
            body: JSON.stringify(body),
            ...reqConf
            })
            .catch(err => {return Promise.reject("Error connection")})
            .then(res => {
                    return createError(res)});
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
                    return createError(res, err);});
    }
}

function createError(response) {
    console.log("GOT HERE");
    if (response.status >= 400)
        return Promise.resolve(response)
            .then(response => response.json())
            .then(errorlist =>
                Promise
                    .reject(errorlist.map(err => errorTranslate(err.tag)))
            );
    else
        return Promise.reject(["Server Connect Error"]);
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
