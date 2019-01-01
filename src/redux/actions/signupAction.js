import { SIGN_UP, SIGN_UP_SUCCESS, RESET_VALUE_SIGN_UP, SIGN_UP_FAILED } from './actionTypes';
import { signupAPI } from 'libraries/networking/apis';
import { showErrorMessage, Status } from 'libraries/networking/status';
import database, { KEY_USER_TOKEN, KEY_USER } from 'libraries/utils/database';

import NavigationService from "routers/NavigationService";
export function onSignUp(name, phone, password, confirm_password) {
    return dispatch => {
        dispatch(signingUp())
        signupAPI(name, phone, password, confirm_password)
            .then(response => {
                if (response.status === Status.SUCCESS) {
                    database.tokenCache = response.data.token;
                    database.user = response.data.user;
                    database.save(KEY_USER_TOKEN, response.data.token);
                    database.save(KEY_USER, JSON.stringify(response.data.user));

                    NavigationService.reset('HomeScreen');
                    return dispatch(signUpSuccess(response.data.user));
                }

                showErrorMessage(response.code);
                return dispatch(signUpFail(response.code));

            })
            .catch(error => {
                // showErrorMessage(Status.GENERIC_ERROR);
                return dispatch(signUpFail(error))
            })
    }
}

export function onResetSignUp() {
    return dispatch => {
        dispatch({
            type: RESET_VALUE_SIGN_UP
        })
    }
}


function signingUp() {
    return {
        type: SIGN_UP
    }
}

function signUpSuccess(data) {
    return {
        type: SIGN_UP_SUCCESS,
        payload: data
    }
}

function signUpFail(error) {
    return {
        type: SIGN_UP_FAILED,
        payload: error
    }
}