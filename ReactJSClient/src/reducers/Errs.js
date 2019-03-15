function Errs(state = [], action) {
    console.log("Errs reducing action " + action.type);
 
    switch (action.type) {
        case 'LOGIN_ERR':
            console.log("login error ", action.details);
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
        case 'UPDATE_MSGS_ERR':
            return action.details;
        case 'ADD_MSG_ERR':
            return action.details;   
        case 'CLEAR_ERROR':
            return action.details;       
        default:
          return state;
    }
 }

 export default Errs;