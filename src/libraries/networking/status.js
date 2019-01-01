import { showMessage } from "libraries/utils/utils";
import R from "res/R";

export const Status = {
    INTERNAL_SERVER_ERROR: 500,
    UNAUTHORIZED_TOKEN_INVALID: 401,
    SUSSESS: 200,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    PHONE_DOES_NOT_EXIT: 426,
    CODE_DOES_NOT_EXIT: 427,
    PHONE_ALREADY_LOGIN_SOCIAL: 428,
    POINT_NOT_ENOUGH: 429,
    DATE_EXPIRY: 434,
    NUMBER_EXPIRED: 432,
    NOT_ENTER_YOUR_CODE: 430,
    ERROR_MULTI_CODE: 435,
    GENERIC_ERROR: 1000,
}


export function showErrorMessage(error) {
    switch (error) {
        case 403:
            showMessage(R.strings.validate.msg_phone_exist)
            break

        default:
            showMessage(R.strings.validate.msg_generic_error)
            break
    }
}