export default function Cnvs(state = [], action) {
   console.log("Cnvs reducing action " + action.type);

   switch (action.type) {
      case 'UPDATE_LSTS': // Replace previous cnvs
         console.log("data ", action.data)
         return action.data;
      case 'UPDATE_LST':
         return state.map(val => val.id !== action.data.id ?
            val : Object.assign({}, val, { title: action.data.title }));
      case 'ADD_LST':
         return state.concat([action.lst]);
      case 'GET_LST':
         return action.data;
      default:
         return state;
   }
}
