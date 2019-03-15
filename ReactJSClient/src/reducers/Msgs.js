export default function Msgs(state = [], action) {
    console.log("Msgs reducing action " + action.type);

    switch (action.type) {
        case 'GET_MSGS':
            return action.msgs;
        default:
            return state;
    }
}