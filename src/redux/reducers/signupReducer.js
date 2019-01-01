import { SIGN_UP, SIGN_UP_SUCCESS, SIGN_UP_FAILED, RESET_VALUE_SIGN_UP } from '../actions/actionTypes';

const initialState = {
    loading: false,
    isRegistered: false,
    user: null,
}

export const signupReducer = (state = initialState, action) => {
    switch (action.type) {
        case SIGN_UP:
            return {
                ...state,
                loading: true,
                isRegistered: false,
            }
        case SIGN_UP_SUCCESS:
            return {
                ...state,
                loading: false,
                isRegistered: true,
                user: action.payload
            }
        case SIGN_UP_FAILED:
            return {
                ...state,
                loading: false,
                isRegistered: false,
            }

        case RESET_VALUE_SIGN_UP:
            return {
                ...state,
                isRegistered: false
            }

        default:
            return state;
    }
}