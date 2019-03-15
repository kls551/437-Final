import * as api from '../api';

export function signIn(credentials, cb) {
   return (dispatch, prevState) => {
      api.signIn(credentials)
      .then((userInfo) => dispatch({type: "SIGN_IN", user: userInfo}))
      .then(() => {if (cb) cb();})
      .catch(error => dispatch({type: 'LOGIN_ERR', details: error}));
   };
}

export function signOut(cb) {
   return (dispatch, prevState) => {
      api.signOut()
      .then(() => dispatch({ type: 'SIGN_OUT' }))
      .then(() => {if (cb) cb();});
   };
}

export function register(data, cb) {
   return (dispatch, prevState) => {
      api.postPrs(data)
      .then(() => {if (cb) cb();})
      .catch(error => {
         dispatch({type: 'REGISTER_ERR', details: error})
      });
   };
}

export function updateCnvs(userId, cb) {
   return (dispatch, prevState) => {
      api.getCnvs(userId)
      .then((cnvs) => dispatch({ type: 'UPDATE_CNVS', cnvs : cnvs }))
      .then(() => {if (cb) cb();});
   };
}

export function addCnv(newCnv, cb) {
   return (dispatch, prevState) => {
      api.postCnv(newCnv)
      //.then(cnvRsp => dispatch({type: 'ADD_CNV', cnv: newCnv}))
      .then(() => {if (cb) cb();})
      .catch(error => {
         dispatch({type: 'FIELD_MIS_ERR', details: error})
      });
   };
}

export function addMsg(cnvId, body, cb) {
   return (dispatch, prevState) => {
      api.postMsg(cnvId, body)
      .then(() => {if (cb) cb();})
      .catch(error => {
         dispatch({type: 'FIELD_MIS_ERR', details: error})
      });
   };
}

export function modCnv(cnvId, title, cb) {
   return (dispatch, prevState) => {
      api.putCnv(cnvId, {title : title})
      .then((cnvs) => dispatch({type: 'UPDATE_CNV', data: title, id: cnvId}))
      .then(() => {if (cb) cb();})
      .catch((error) => {
         dispatch({type: "DUP_TITLE", details: error});
      });
   };
}

export function delCnv(cnvId, cb) {
   return (dispatch, prevState) => {
      api.delCnv(cnvId)
      .then((res) => {console.log(res);
         dispatch({type: 'DEL_CNV', cnv: cnvId});})
      .then(() => {if (cb) cb();});
   }
}

export function getCnv(cnvId, cb) {
   return (dispatch, prevState) => {
      api.getCnv(cnvId)
      .then((res) => {console.log(res);
         dispatch({type: 'GET_CNV', oneCnv: res});})
      .then(() => {if (cb) cb();});
   }
}

export function getMsgs(cnvId, cb) {
   return (dispatch, prevState) => {
      api.getMsgs(cnvId)
      .then((res) => {console.log("gotten msgs", res);
         dispatch({type: 'GET_MSGS', msgs: res});})
      .then(() => {if (cb) cb();})
      .catch((error) => {
         dispatch({type: "ERROR", details: error});
      });
   }
}

export function postError(type, details, cb) {
   return (dispatch, prevState) => {
      dispatch({type, details});
      if (cb) cb();
   };
}

export function clearErrors(cb) {
   return (dispatch, prevState) => {
      dispatch({type: "ERRS"});
      if (cb) cb();
   };
}