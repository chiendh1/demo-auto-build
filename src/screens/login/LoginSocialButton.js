import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import PropTypes from 'prop-types';

class LoginSocialButton extends Component {

    static propTypes = {
        iconName: PropTypes.string.isRequired,
        iconSize: PropTypes.number,
        iconColor: PropTypes.string,
        containerStyle: PropTypes.object,
        onSocialPress: PropTypes.func,
    }

    static defaultProps = {
        iconSize: 20,
    }

    render() {
        return (
            <TouchableOpacity
                style={[styles.container, this.props.containerStyle]}
                onPress={this.props.onSocialPress}
            >
                <Icon name={this.props.iconName} size={this.props.iconSize} color={this.props.iconColor} />
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        width: 50,
        height: 50,
        borderRadius: 50 / 2,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 3,
        marginHorizontal: 8
    }
});

export default LoginSocialButton;
