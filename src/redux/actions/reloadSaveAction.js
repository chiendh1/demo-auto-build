import { RELOAD_SAVE } from '.';

export function reloadSaves(text) {
    return dispatch => {
        return dispatch(reloadSave(text))
    }
}


function reloadSave(text) {
    return {
        type: RELOAD_SAVE,
        payload: text
    }
}
