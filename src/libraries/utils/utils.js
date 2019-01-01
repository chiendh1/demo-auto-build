import React from 'react';
import { Platform, Alert, ToastAndroid, Keyboard, Linking } from 'react-native';
import R from 'res/R';
import Snackbar from 'react-native-snackbar';

import RNGooglePlaces from 'react-native-google-places';

import Geocoder from 'react-native-geocoder';
import constants from './constants';

export function log(message) {
    return message;
}

export function showMessage(message, action) {
    let duration = action ? Snackbar.LENGTH_LONG : Snackbar.LENGTH_SHORT
    Snackbar.show({
        title: message,
        duration,
        backgroundColor: R.colors.primaryColor,
        action
    });
}

export function validateImage(url){
        
    if(url.indexOf(constants.BASE_URL) > -1){
        return url
    }
    
    return constants.BASE_URL + url
}

export function dialCall(url) {
    let uri = `tel:${url}`
    Linking.canOpenURL(uri).then(supported => {
        if (!supported) {
            return uri;
        } else {
            return Linking.openURL(uri);
        }
    }).catch(err => {return err});
}

export function validateName(name) {
    const str = /[!@#$%^&*()-+=_";:{}~`\|<>?'+-]/;
    const strname = /[a-zA-Z]/;
    const space = /\s/g;

    let checkName = name.trimLeft().trimRight();
    if (name.length === 0) {
        showMessage(R.strings.validate.msg_empty_fullname);
        return false;
    }
    if (name.length < 2) {
        showMessage(R.strings.validate.msg_length_fullname_invalid);
        return false;
    }
    if (checkName.length === 0) {
        showMessage(R.strings.validate.msg_empty_fullname_space);
        return;
    }
    if (str.test(name)) {
        showMessage(R.strings.validate.msg_empty_fullname_special);
        return false;
    }
    if (!strname.test(name) && !space.test(name)) {
        showMessage(R.strings.validate.msg_not_fullname_special);
        return false;
    }
    return true;
}

export function validatePassword(password) {
    let checkPass = password.trimLeft().trimRight();
    if (checkPass.length === 0) {
        showMessage(R.strings.validate.msg_password_space)
        return false;
    }
    if (password.length === 0) {
        showMessage(R.strings.validate.msg_empty_password);
        return false;
    }
    if (password.length < 6) {
        showMessage(R.strings.validate.msg_length_password_invalid);
        return false;
    }
    return true;
}

export function validatePhone(phone) {
    const str = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
    if (phone.length === 0) {
        showMessage(R.strings.validate.msg_empty_phone);
        return false;
    }
    if (phone.length < 10) {
        showMessage(R.strings.validate.msg_phone_short);
        return false;
    }
    if (phone.length > 12) {
        showMessage(R.strings.validate.msg_phone_length);
        return false;
    }
    if (!str.test(phone)) {
        showMessage(R.strings.validate.msg_phone_validate);
        return false;
    }
    return true;
}

export function showAlert(title, message) {
    Alert.alert(title, message);
}

export function convertPhonenumber(phone) {
    if (!phone) return '';
    return phone.replace('+84', '0');
}

export function hideKeyboard() {
    Keyboard.dismiss()
}

export async function openAutocompleteModal() {
    let place = await RNGooglePlaces.openAutocompleteModal({
        country: 'VN',
    });

    if (place) {
        let ret = await Geocoder.geocodePosition({ lat: place.latitude, lng: place.longitude })
        return {
            place,
            city_name: ret.length > 0 ? ret[0].adminArea : 'N/A'
        }
    }
}

