import {LOGGING_IN_SOCIAL, LOGGING_IN_SOCIAL_SUCCESS, LOGGING_IN_SOCIAL_FAILED} from '../actions/actionTypes';

const initialState = {
    isLoadingSocial: false
};

export const loginSocialReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOGGING_IN_SOCIAL:
            return {
                ...state,
                isLoadingSocial: true
            }
        case LOGGING_IN_SOCIAL_SUCCESS:
            return {
                ...state,
                isLoadingSocial: false
            }

        case LOGGING_IN_SOCIAL_FAILED:
            return {
                ...state,
                isLoadingSocial: false
            }

        default:
            return state;
    }
}