import { combineReducers } from 'redux';

import Prss from './Prss';
import Cnvs from './Cnvs';
import Cnv from './Cnv';
import Msgs from './Msgs';
import Errs from './Errs';

const rootReducer = combineReducers({Prss, Cnvs, Cnv, Msgs, Errs});

export default rootReducer;


