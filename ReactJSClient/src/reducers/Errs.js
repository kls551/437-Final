export default function Errs(state = [], action) {
   console.log("Errs reducing action " + action.type);
   switch(action.type) {
   case 'LOGIN_ERR':
      return state.concat(action.details);
   case 'REGISTER_ERR':
      return state.concat(action.details);
   case 'FIELD_MIS_ERR':
      return state.concat(action.details);
   case 'DUP_TITLE':
      return state.concat(action.details);
   case 'SVR_ERR':
      return state.concat(action.details);
   case 'ERRS':
      return [];
   default:
      return state;
   }
}
