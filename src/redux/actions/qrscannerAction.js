import { QRSCANNER_TEXT } from '../actions';

export  function qrSCanners(text){
    return dispatch => {
        return dispatch(qrSCanner(text))
    }
}


 function qrSCanner(text) {
    return {
        type: QRSCANNER_TEXT,
        payload: text
    }
}
