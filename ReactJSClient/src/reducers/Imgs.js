function Imgs(state = [], action) {
    console.log("Imgs reducing action " + action.type);
    switch(action.type) {
    case 'GET_IMGS':
      return action.data;
    case 'ADD_IMG':
      return action.data;
    default:
       return state;
    }
 }
 
 export default Imgs;