import { UPDATING_PHONE, UPDATING_PHONE_SUCCESS, UPDATING_PHONE_FAILED, RESET_VALUE_USER, UPDATING_USER, FETCHING_USER_SUCCESS, FETCHING_USER_FAILED } from "../actions/actionTypes";

const initialState = {
    loadingUpdatePhone: false,
    loadingUpdateUser: false,
    isUpdated: false,
    user: null,
}

export const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case UPDATING_PHONE:
            return {
                ...state,
                loadingUpdatePhone: true,
                isUpdated: false,
            }
        case UPDATING_PHONE_SUCCESS:
            return {
                ...state,
                loadingUpdatePhone: false,
                isUpdated: true,
            }
        case UPDATING_PHONE_FAILED:
            return {
                ...state,
                loadingUpdatePhone: false,
                isUpdated: false,
            }

        case FETCHING_USER_SUCCESS:
            return {
                ...state,
                loadingUpdateUser: false,
                isUpdated: true,
                user: action.payload
            }
        case FETCHING_USER_FAILED:
            return {
                ...state,
                loadingUpdateUser: false,
                isUpdated: false,
            }

        case UPDATING_USER:
            return {
                ...state,
                user: action.payload
            }

        case RESET_VALUE_USER:
            return {
                ...state,
                isUpdated: false
            }

        default:
            return state;
    }
}
