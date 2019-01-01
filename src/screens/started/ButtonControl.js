import React, { PureComponent } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';

const propTypes = {
    text: PropTypes.string,
    style: PropTypes.object
}

export default class ButtonControl extends PureComponent {


    render() {
        return (
            <TouchableOpacity
                {...this.props}
                style={[styles.btnStart, this.props.style]}

            >
                <Text style={styles.textButton}>{this.props.text}</Text>
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({

    btnStart: {
        width: '80%',
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
        borderWidth: 0.5,
        borderColor: 'white',
        marginBottom: 20
    },
    textButton: {
        color: 'white',
        fontSize: 16
    },
})

ButtonControl.propTypes = propTypes;