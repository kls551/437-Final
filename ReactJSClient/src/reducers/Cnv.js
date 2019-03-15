export default function Cnv(state = [], action) {
    console.log("Msgs reducing action " + action.type);

    switch (action.type) {
        case 'GET_CNV':
            return action.oneCnv;
        default:
            return state;
    }
}