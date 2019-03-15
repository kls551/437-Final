import { combineReducers } from 'redux';

import Prss from './Prss';
import Listing from './Listing';
import Msgs from './Msgs';
import Errs from './Errs';

const rootReducer = combineReducers({Prss, Listing, Msgs, Errs});

export default rootReducer;


