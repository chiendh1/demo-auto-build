import { LOCATION_UPDATED } from '../actions';

var initialState = {
    region: null
}

export const locationReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOCATION_UPDATED:
            return {
                ...state,
                region: action.payload
            }

        default:
            return state;
    }
}