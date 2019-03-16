function Prss(state = {}, action) {
   console.log("Prss reducing action " + action.type);
   switch(action.type) {
   case 'SIGN_IN':
      console.log("in signin");
      return action.user;
   case 'REGISTER':
      return action.user;
   case 'SIGN_OUT':
      return {}; // Clear user state
   default:
      return state;
   }
}

export default Prss;
