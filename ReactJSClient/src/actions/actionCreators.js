import * as api from '../api';

export function signIn(credentials, cb, errcb) {
   return (dispatch, prevState) => {
      api.signIn(credentials)
      .then((userInfo) => dispatch({type: "SIGN_IN", user: userInfo}))
      .then(() => {if (cb) cb();})
      .catch(error => {
               dispatch({type: 'LOGIN_ERR', details: error});
                               if (errcb) errcb(); } );
   };
}

export function signOut(cb, errcb) {
   return (dispatch, prevState) => {
      api.signOut()
      .then(() => dispatch({ type: 'SIGN_OUT' }))
      .then(() => {if (cb) cb();})
      .catch(error => {
            dispatch({type: 'SIGN_OUT_ERR', details: error});
                      if (errcb) errcb(); } );;
   };
}

export function register(data, cb, errcb) {
   return (dispatch, prevState) => {
      api.postPrs(data)
      // .then((userInfo) => dispatch({type: "REGISTER", user: []}))
      .then(() => {if (cb) cb() } )
      .catch(error => {
                        dispatch({type: 'REGISTER_ERR', details: error});
                        if (errcb) errcb(); } );
   };
}

export function updateCnvs(userId, cb, errcb) {
   return (dispatch, prevState) => {
      api.getCnvs(userId)
      .then((cnvs) => dispatch({ type: 'UPDATE_CNVS', data: cnvs }))
      .then(() => {if (cb) cb();})
      .catch(error => { dispatch({type: 'UPDATE_CNVS_ERR', details: error});
                        if (errcb) errcb(); } );
   };
}

export function getCnv(cnvId, cb, errcb) {
   return (dispatch, prevState) => {
      api.getOneCnv(cnvId)
      .then((cnv) => dispatch({ type: 'GET_CNV', data: cnv }))
      .then(() => {if (cb) cb();})
      .catch(error => {dispatch({type: 'GET_CNV_ERR', details: error});
                              if (errcb) errcb(); } );
   };
}

export function addCnv(newCnv, cb, errcb) {
   return (dispatch, prevState) => {
      console.log("adding cnvs");
      api.postCnv(newCnv)
      .then(cnvRsp => dispatch({type: 'ADD_CNV', cnv: newCnv}))
      .then(() => {if (cb) cb();})
      .catch(error => {dispatch({type: 'ADD_CNV_ERR', details: error}); 
                        if (errcb) errcb(); } );
   };
}

export function modCnv(cnvId, title, cb, errcb) {
   return (dispatch, prevState) => {
      api.putCnv(cnvId, {title})
      .then((cnvs) => dispatch({type: 'UPDATE_CNV', data: cnvs}  ))
      .then(() => {if (cb) cb();})
      .catch(error => {dispatch({type: 'UPDATE_CNV_ERR', details: error});
                           if (errcb) errcb(); } );
   };
}

export function delCnv(cnvId, cb, errcb) {
   return (dispatch, prevState) => {
      console.log("in delCnv", cnvId)
      api.deleteCnv(cnvId)
      .then(() => dispatch({ type: 'DEL_CNV'}))
      .then(() => {if (cb) cb();})
      .catch(error => {dispatch({type: 'DEL_CNV_ERR', details: error}); 
                     if (errcb) errcb(); } );
   };
}

export function updateMsgs(cnvId, cb, errcb) {
   return (dispatch, prevState) => {
      api.getMsgs(cnvId)
      .then((msgs) => dispatch({ type: 'UPDATE_MSGS', data: msgs }))
      .then(() => {if (cb) cb();})
      .catch(error => {dispatch({type: 'UPDATE_MSGS_ERR', details: error});
                        if (errcb) errcb(); } );
   };
}

export function addMsg(cnvid, content, cb, errcb) {
   return (dispatch, prevState) => {
      api.postMsg(cnvid, content)
      .then(msg => { console.log("msg -----", msg);
      dispatch({type: 'ADD_MSG', msg: msg}); } )
      .then(() => {if (cb) cb();})
      .catch(error => {dispatch({type: 'ADD_MSG_ERR', details: error});
                        if (errcb) errcb(); } );
   };
}

export function clearError(cb) {
   return (dispatch, prevState) => {
      dispatch({type: 'CLEAR_ERROR', details: []});
   };
}