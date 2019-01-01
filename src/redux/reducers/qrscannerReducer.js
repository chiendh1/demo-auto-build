import { QRSCANNER_TEXT } from '../actions';

const initialState = {
    textQR: ''
}

export const qrscannerReducer = (state = initialState, action) => {
    switch (action.type) {
        
        case QRSCANNER_TEXT:
            return {
                ...state,
                textQR: action.payload.toUpperCase(),
            }
        default:
            return state
    }
}