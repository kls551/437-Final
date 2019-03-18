import { combineReducers } from 'redux';

import Prss from './Prss';
import Listing from './Listing';
import Imgs from './Imgs';
import Errs from './Errs';

const rootReducer = combineReducers({Prss, Listing, Imgs, Errs});

export default rootReducer;


