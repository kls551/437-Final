function Errs(state = [], action) {
    console.log("Errs reducing action " + action.type);
 
    switch (action.type) {
        case 'LOGIN_ERR': 
            return action.details;
        case 'REGISTER_ERR':
            return action.details;
        case 'UPDATE_LSTS_ERR':
            return action.details;
        case 'GET_LST_ERR':
            return action.details;
        case 'ADD_LST_ERR':
            return action.details;
        case 'UPDATE_LST_ERR':
            return action.details;
        case 'DEL_CNV_ERR':
            return action.details;
        case 'GET_IMGS_ERR':
            return action.details;
        case 'ADD_IMG_ERR': 
            return action.details;   
        case 'CLEAR_ERROR':
            return action.details;       
        default:
          return state;
    }
 }

 export default Errs;