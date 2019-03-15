function Msgs(state = [], action) {
    console.log("Msgs reducing action " + action.type);
    switch(action.type) {
    case 'UPDATE_MSGS':
       return action.data;
    case 'ADD_MSG':
        return state.concat([action.msg]);
    default:
       return state;
    }
 }
 
 export default Msgs;