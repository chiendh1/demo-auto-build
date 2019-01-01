import {AsyncStorage} from 'react-native';

export const KEY_USER_TOKEN = 'KEY_USER_TOKEN';
export const KEY_USER = 'KEY_USER';
export const KEY_ENABLE_PASSWORD = 'KEY_ENABLE_PASSWORD';
export const KEY_GET_STARTED_PRESSED = 'KEY_GET_STARTED_PRESSED';
export const KEY_NOTIFICATION = "KEY_NOTIFICATION";

var tokenCache = '';
var user = {};
var notification = '';

function save(key, value){
    AsyncStorage.setItem(key, value);
}

async function get(key){
   return AsyncStorage.getItem(key);
}

export default {
    save,
    get,
    tokenCache,
    user,
    notification
}