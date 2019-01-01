import { RELOAD_SAVE } from '../actions';
import constants from 'libraries/utils/constants';

const initialState = {
    reloadSave: constants.reloadList.DEFAULT
}

export const reloadSaveReducer = (state = initialState, action) => {
    switch (action.type) {
        case RELOAD_SAVE:
            return {
                ...state,
                reloadSave: action.payload,
            }
        default:
            return state;
    }
}