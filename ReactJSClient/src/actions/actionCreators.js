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

export function updateLsts(userId, cb, errcb) {
   return (dispatch, prevState) => {
      api.getLsts(userId)
      .then((lsts) => dispatch({ type: 'UPDATE_LSTS', data: lsts }))
      .then(() => {if (cb) cb();})
      .catch(error => { dispatch({type: 'UPDATE_LSTS_ERR', details: error});
                        if (errcb) errcb(); } );
   };
}

export function getLst(lstId, cb, errcb) {
   return (dispatch, prevState) => {
      api.getOneLst(lstId)
      .then((lst) => dispatch({ type: 'GET_LST', data: lst }))
      .then(() => {if (cb) cb();})
      .catch(error => {dispatch({type: 'GET_LST_ERR', details: error});
                              if (errcb) errcb(); } );
   };
}

export function addLst(newLst, cb, errcb) {
   return (dispatch, prevState) => {
      console.log("adding lst");
      api.postLst(newLst)
      .then(lstRsp => dispatch({type: 'ADD_LST', lst: lstRsp}))
      .then(() => {if (cb) cb();})
      .catch(error => {dispatch({type: 'ADD_LST_ERR', details: error}); 
                        if (errcb) errcb(); } );
   };
}

export function modLst(lstId, body, cb, errcb) {
   return (dispatch, prevState) => {
      api.putLst(lstId, body)
      .then((lsts) => dispatch({type: 'UPDATE_LST', data: lsts}  ))
      .then(() => {if (cb) cb();})
      .catch(error => {dispatch({type: 'UPDATE_LST_ERR', details: error});
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