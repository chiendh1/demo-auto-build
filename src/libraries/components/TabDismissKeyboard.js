import React, { Component } from 'react';
import { TouchableWithoutFeedback, Keyboard } from 'react-native';
export default TabDismissKeybroad = ({ children }) => (
    <TouchableWithoutFeedback onPress={() => { Keyboard.dismiss() }}>
        {children}
    </TouchableWithoutFeedback>
)