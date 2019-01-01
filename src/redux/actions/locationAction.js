import { LOCATION_UPDATED } from "./actionTypes";

export function locationUpdated(region){
    return dispatch => {
        dispatch({
            type: LOCATION_UPDATED,
            payload: region
        })
    }
}