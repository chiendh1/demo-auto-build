import {CHECK_LOGGING_IN_SOCIAL, CHECK_LOGGING_IN_SOCIAL_SUCCESS, CHECK_LOGGING_IN_SOCIAL_FAILED} from '../actions/actionTypes';

const initialState = {
    isLoadingSocial: false,
    isCheckSuccess: false,
};

export const checkSocialReducer = (state = initialState, action) => {
    switch (action.type) {
        case CHECK_LOGGING_IN_SOCIAL:
            return {
                ...state,
                isCheckSuccess: false,
                isLoadingSocial: true
            }
        case CHECK_LOGGING_IN_SOCIAL_SUCCESS:
            return {
                ...state,
                isCheckSuccess: true,
                isLoadingSocial: false
            }

        case CHECK_LOGGING_IN_SOCIAL_FAILED:
            return {
                ...state,
                isCheckSuccess: false,
                isLoadingSocial: false
            }

        default:
            return state;
    }
}