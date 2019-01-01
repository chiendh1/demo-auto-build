import React, { PureComponent } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import R from 'res/R';

import Icon from 'react-native-vector-icons/MaterialIcons';

class PasswordInput extends PureComponent {

    static propTypes = {
        style: PropTypes.oneOfType([
            PropTypes.object,
            PropTypes.array
        ])
    }

    static defaultProps = {
        iconSize: 22,
        password: false
    }

    constructor(props) {
        super(props);
        this.state = {
            icEye: 'visibility-off',
            password: this.props.password
        }
    }

    changePwdType = () => {
        let newState;
        if (this.state.password) {
            newState = {
                icEye: 'visibility',
                password: false
            }
        } else {
            newState = {
                icEye: 'visibility-off',
                password: true
            }
        }

        // set new state value
        this.setState(newState)

    };

    render() {
        return (
            <View style={{
                width: '78%',
                marginBottom: 5
            }}>
                <TextInput
                
                    {...this.props}
                    secureTextEntry={this.state.password}
                    style={[styles.textInputStyle, this.props.style]}
                    placeholderTextColor='grey'
                />

                {this.props.password ? <Icon style={styles.icon}
                    name={this.state.icEye}
                    size={this.props.iconSize}
                    color={this.props.iconColor}
                    onPress={this.changePwdType} /> : null}
                
            </View>

        );
    }
}

const styles = StyleSheet.create({
    textInputStyle: {
        borderBottomColor: R.colors.primaryColor,
        borderBottomWidth: 0.5,
        padding: 5,

    },
    icon: {
        bottom: 5,
        position: 'absolute',
        right: 0
    }
})

export default PasswordInput;
