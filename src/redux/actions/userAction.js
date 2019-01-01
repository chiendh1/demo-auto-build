import {
    UPDATING_PHONE, UPDATING_PHONE_SUCCESS, UPDATING_PHONE_FAILED,
    UPDATING_USER, FETCHING_USER_SUCCESS, FETCHING_USER_FAILED, RESET_VALUE_USER
} from "./actionTypes";
import { updatePhone, getUserInfo } from "libraries/networking/apis";
import { Status } from "libraries/networking/status";
import database, { KEY_USER_TOKEN, KEY_USER } from "libraries/utils/database";
import NavigationService from "routers/NavigationService";

export function onUpdatePhone(type, access_token, phone) {
    return dispatch => {
        dispatch(updatingPhone())
        updatePhone(type, access_token, phone)
            .then(response => {
                if (response.status === Status.SUCCESS) {
                    database.tokenCache = response.data.token;
                    database.user = response.data.user;
                    database.save(KEY_USER_TOKEN, response.data.token);
                    database.save(KEY_USER, JSON.stringify(response.data.user));

                    NavigationService.reset('HomeScreen');
                    return dispatch(updatingPhoneSuccess(response.data));
                }

                showErrorMessage(response.code);
                return dispatch(updatingPhoneFail(response.code));

            })
            .catch(error => {
                return dispatch(updatingPhoneFail(error))
            })
    }
}

export function onResetUser(){
    return dispatch=> {
        dispatch({
            type: RESET_VALUE_USER
        })
    }
}

function updatingPhone() {
    return {
        type: UPDATING_PHONE
    }
}
function updatingPhoneSuccess(data) {
    return {
        type: UPDATING_PHONE_SUCCESS,
        payload: data
    }
}
function updatingPhoneFail(error) {
    return {
        type: UPDATING_PHONE_FAILED,
        payload: error
    }
}

export function onFetchUser(id_user, token) {
    return dispatch => {
        getUserInfo(id_user, token).then(response => {
            if (response.code === Status.SUSSESS) {
                let newUser = response.data.info_user;
                database.user = response.data.info_user
                database.save(KEY_USER, JSON.stringify(newUser));
                return dispatch(fetchingUserSuccess(newUser))
            } else {
                
                return dispatch(fetchingUserFail(response.code));
            }

        }).catch(error => {
            return dispatch(fetchingUserFail(error))
        })
    }
}

export function fetchingUserSuccess(data) {
    return {
        type: FETCHING_USER_SUCCESS,
        payload: data
    }
}
function fetchingUserFail(error) {
    return {
        type: FETCHING_USER_FAILED,
        payload: error
    }
}


export function onUpdateUser(user){
    return dispatch => {
        dispatch({
            type: UPDATING_USER,
            payload: user
        })
    }
}

