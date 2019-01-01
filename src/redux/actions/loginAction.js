import {LOGGING_IN, LOGGING_IN_FAILED, LOGGING_IN_SUCCESS} from '../actions'
import { loginAPI } from 'libraries/networking/apis';
import NavigationService from 'routers/NavigationService';
import {showErrorMessage, Status} from 'libraries/networking/status';
import database, { KEY_USER_TOKEN, KEY_USER } from 'libraries/utils/database';
import R from 'res/R';
import {showMessage} from 'libraries/utils/utils';
import {onUpdateUser} from './userAction';

export function onLogin(telephone, password){
    return dispatch => {
        dispatch(loggingIn())
        loginAPI(telephone, password)
        .then(response => {
            if(response.code === Status.SUSSESS) {
                database.tokenCache = response.data.token;
                database.user = response.data.user;
                database.save(KEY_USER_TOKEN, response.data.token);
                database.save(KEY_USER, JSON.stringify(response.data.user));
                NavigationService.reset('HomeScreen');
                dispatch(onUpdateUser(response.data.user))
                return dispatch(loginSuccess())
                
            }else if(response.code === Status.NOT_FOUND){
                showMessage(R.strings.validate.msg_phone_error)
                return dispatch(loginFailed(response.code));
            }else{
                showErrorMessage(response.code);
                return dispatch(loginFailed(response.code));
            }
            
        })
        .catch(error => {
            dispatch(loginFailed(error))
        })
    }
    
}

function loggingIn(){
    return {
        type: LOGGING_IN,
    }
}

function loginSuccess(){
    return {
        type: LOGGING_IN_SUCCESS,
    }
}

function loginFailed(error){
    return {
        type: LOGGING_IN_FAILED,
        payload: error
    }
}



