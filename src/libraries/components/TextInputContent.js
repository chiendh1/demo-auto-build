import React, { PureComponent } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import BaseInput from 'libraries/components/BaseInput';
import R from 'res/R';

export default class TextInputContent extends PureComponent {

    render() {
        return (
            <View style={styles.viewMoney}>
                <BaseInput
                    {...this.props}
                    style={styles.baseInput}
                    keyboardType='number-pad'
                />
                <Text style={styles.textMoney}>{R.strings.createStudentPortfolio.text_money}</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    viewMoney: {
        width: '100%',
        alignItems: 'flex-end',
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderBottomWidth: 0.5,
        borderBottomColor: '#CCCCCC',
    },
    baseInput: {
        borderBottomWidth: null,
        height: 30,
        paddingVertical: 3,
        paddingLeft: 5,
        padding: 0,
        marginBottom: 0
    },
    textMoney: {
        fontSize: 13,
        color: 'rgba(0, 0, 0, .38)',
        paddingBottom: 7,
    },
})