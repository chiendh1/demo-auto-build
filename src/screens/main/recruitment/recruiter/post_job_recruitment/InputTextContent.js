import React, { PureComponent } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import BaseInput from 'libraries/components/BaseInput';
import R from 'res/R';

export default class InputTextContent extends PureComponent {

    constructor(props) {
        super(props);

        this.state = {
            value: ''
        }
    }

    getValue = () => this.state.value

    setValue = (value) => {
        this.setState({value})
    }


    onChangeText = text => {
        this.setState({ value: text })
    }
    
    render() {
        return (
            <View style={[styles.container, this.props.styleInput]}>
                <BaseInput
                    style={styles.textinputStyle}
                    placeholder={this.props.placeholder}
                    keyboardType='number-pad'
                    maxLength={this.props.maxLength}
                    onChangeText={this.onChangeText}
                    value={this.state.value}
                />
                <Text style={styles.textRight}>{this.props.textRight}</Text>
            </View>
        );
    }

}
const styles = StyleSheet.create({
    container: {
        width: '90%',
        borderBottomColor: R.colors.greyColor,
        borderBottomWidth: 0.8,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 5,
    },
    textinputStyle: {
        width: '80%',
        borderBottomColor: null,
        borderBottomWidth: null,
        padding: 0,
        marginBottom: Platform.OS === 'ios' ? 5 : 0
    },
    textRight: {
        color: R.colors.grey900,
        fontSize: 14,
        marginTop: Platform.OS === 'ios' ? null : 3
    }
})