import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import R from 'res/R';
import PropTypes from 'prop-types';

class ForgotPasswordButton extends Component {
    static propTypes = {
        onPress: PropTypes.func,
    }

    render() {
        return (
            <TouchableOpacity onPress={this.props.onPress}>
                <Text style={styles.textStyle}>{R.strings.login.label_forgot_password}</Text>
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    textStyle: {
        color: '#104a7a',
        textDecorationLine: 'underline',
        marginBottom: 35
    }
});

export default ForgotPasswordButton;
