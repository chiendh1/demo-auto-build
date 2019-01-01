import React, { PureComponent } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import R from 'res/R';

class BaseInput extends PureComponent {

    static propTypes = {
        style: PropTypes.oneOfType([
            PropTypes.object,
            PropTypes.array
        ])
    }

    render() {
        return (
            <TextInput
                {...this.props}
                style={[styles.textInputStyle, this.props.style]}
                placeholderTextColor='grey'
            />
        );
    }
}

const styles = StyleSheet.create({
    textInputStyle: {
        width: '78%',
        borderBottomColor: R.colors.primaryColor,
        borderBottomWidth: 0.5,
        padding: 5,
        marginBottom: 5

    }
})

export default BaseInput;
