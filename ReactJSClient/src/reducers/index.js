import { combineReducers } from 'redux';

import Prss from './Prss';
import Cnvs from './Cnvs';
import Msgs from './Msgs';
import Errs from './Errs';

const rootReducer = combineReducers({Prss, Cnvs, Msgs, Errs});

export default rootReducer;


