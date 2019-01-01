import database,{ KEY_USER_TOKEN, KEY_USER  } from 'libraries/utils/database';
import { Status, showErrorMessage } from 'libraries/networking/status';
import { LOGGING_IN_SOCIAL, LOGGING_IN_SOCIAL_SUCCESS, LOGGING_IN_SOCIAL_FAILED} from './actionTypes';
import { LoginSocial } from 'libraries/networking/apis';
import NavigationService from 'routers/NavigationService';
import {onUpdateUser} from './userAction';
export function onLoginSocial(name, email,phone, access_token, type) {
    return dispatch => {
        dispatch(loginSocial())
        LoginSocial(name, email,phone, access_token, type)
        .then(response => {
            if(response.code === Status.SUSSESS) {
                database.tokenCache = response.data.token;
                database.user = response.data.user;
                database.save(KEY_USER_TOKEN,  response.data.token);
                database.save(KEY_USER, JSON.stringify(response.data.user));
            
                dispatch(onUpdateUser(response.data.user))
                NavigationService.reset('HomeScreen');
                return dispatch(loginSocialSuccess(response.data))
            }
            showErrorMessage(response.code);
            return dispatch(loginSocialFail(response.code));
        })
        .catch(error => {
            return(loginSocialFail(error));
        })
    }
}

function loginSocial() {
    return {
        type: LOGGING_IN_SOCIAL
    }
}
function loginSocialSuccess() {
    return {
        type: LOGGING_IN_SOCIAL_SUCCESS,
        payload: data
    }
}

function loginSocialFail(error) {
    return {
        type: LOGGING_IN_SOCIAL_FAILED,
        payload: error
    }
}

