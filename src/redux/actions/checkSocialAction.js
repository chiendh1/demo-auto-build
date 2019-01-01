import constants from 'libraries/utils/constants';
import database, { KEY_USER_TOKEN, KEY_USER } from 'libraries/utils/database';
import { Status, showErrorMessage } from 'libraries/networking/status';
import { CHECK_LOGGING_IN_SOCIAL, CHECK_LOGGING_IN_SOCIAL_SUCCESS, CHECK_LOGGING_IN_SOCIAL_FAILED } from './actionTypes';
import { checkAPISocial } from 'libraries/networking/apis';
import NavigationService from 'routers/NavigationService';

export function checkAPILoginSocial(type, user) {

    return dispatch => {
        dispatch(checkLoginSocial())
        checkAPISocial(type, user.accessToken)
            .then(response => {
                if (response.code === Status.SUSSESS) {
                    //TODO: Account is exist. navigate to main screen
                    database.tokenCache = response.data.token;
                    database.user = response.data.user;
                    database.save(KEY_USER_TOKEN, response.data.token);
                    database.save(KEY_USER, JSON.stringify(response.data.user));

                    return dispatch(checkLoginSocialSuccess(response.data));

                } else if (response.code === Status.PHONE_DOES_NOT_EXIT) {
                    //TODO: Account is exist but their phone ís not exist. Navigate to validation phone
                    NavigationService.navigate('ForgotPasswordScreen', { socialLoginType: type, validatePhoneType: constants.validatePhoneType.UPDATE_PHONE_NUMBER, user });
                    return dispatch(checkLoginSocialFail(response.code));
                } else if (response.code === Status.NOT_FOUND) {
                    //TODO: Account is not exist. Navigate to validate phone and then create new account.
                    NavigationService.navigate('ForgotPasswordScreen', { socialLoginType: type, validatePhoneType: constants.validatePhoneType.CREATE_NEW_ACCOUNT, user });
                    return dispatch(checkLoginSocialFail(response.code));
                }
                showErrorMessage(response.code);
                return dispatch(checkLoginSocialFail(response.code));
            })
            .catch(error => {
                return (checkLoginSocialFail(error));
            })
    }
}

function checkLoginSocial() {
    return {
        type: CHECK_LOGGING_IN_SOCIAL
    }
}
function checkLoginSocialSuccess(data) {
    return {
        type: CHECK_LOGGING_IN_SOCIAL_SUCCESS,
        payload: data
    }
}

function checkLoginSocialFail(error) {
    return {
        type: CHECK_LOGGING_IN_SOCIAL_FAILED,
        payload: error
    }
}
