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

export function updateLsts(userId, price, numbeds, cb, errcb) {
   console.log("get here");
   return (dispatch, prevState) => {
      api.getLsts(userId, price, numbeds)
      .then((lsts) => dispatch({ type: 'UPDATE_LSTS', data: lsts}))
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

export function delLst(lstId, cb, errcb) {
   return (dispatch, prevState) => {
      console.log("in delLst", lstId)
      api.deletedLst(lstId)
      .then(() => dispatch({ type: 'DEL_LST'}))
      .then(() => {if (cb) cb();})
      .catch(error => {dispatch({type: 'DEL_LST_ERR', details: error}); 
                     if (errcb) errcb(); } );
   };
}

export function getLstImgs(lstId, cb, errcb) {
   return (dispatch, prevState) => {
      api.getImgs(lstId)
      .then((imgs) => dispatch({ type: 'GET_IMGS', data: imgs }))
      .then(() => {if (cb) cb();})
      .catch(error => {dispatch({type: 'GET_IMGS_ERR', details: error});
                        if (errcb) errcb(); } );
   };
}


export function addImg(lstId, body, cb) {
   return (dispatch, prevState) => {
      api.postImg(lstId, body)
      .then( (imgs) => { console.log("imgs -----", imgs);
         dispatch({type: 'ADD_IMG', imgs: imgs}); } )
      .then(() => {if (cb) cb();})
      .catch(error => {
         dispatch({type: 'ADD_IMG_ERR', details: error})
      });
   };
}

export function clearError(cb) {
   return (dispatch, prevState) => {
      dispatch({type: 'CLEAR_ERROR', details: []});
   };
}