import { combineReducers } from 'redux';
import { loginReducer } from './loginReducer';
import { signupReducer } from './signupReducer';
import { qrscannerReducer } from './qrscannerReducer';
import { loginSocialReducer } from './loginSocialReducer';
import { checkSocialReducer } from './checkSocialReducer';
import { userReducer } from './userReducer';
import { locationReducer } from './locationReducer';
import { reloadSaveReducer } from './reloadSaveReducer';

const rootReducers = combineReducers({
    loginReducer,
    qrscannerReducer,
    signupReducer,
    loginSocialReducer,
    checkSocialReducer,
    userReducer,
    locationReducer,
    reloadSaveReducer
})

export default rootReducers;