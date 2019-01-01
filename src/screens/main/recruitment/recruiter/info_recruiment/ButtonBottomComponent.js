import React, { PureComponent } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import BaseButtonOpacity from 'libraries/components/BaseButtonOpacity';
import R from 'res/R';

export default class ButtonBottomComponent extends PureComponent {
    render() {
        return (
            <View style={styles.container}>
                <BaseButtonOpacity
                    text={R.strings.infoRecruiment.text_btn_right}
                    containerStyle={styles.btnRight}
                    textStyle={{ color: R.colors.orangeColor }}
                    onPress={this.props.onLeft}
                />
                <BaseButtonOpacity
                    text={R.strings.infoRecruiment.text_btn_left}
                    containerStyle={styles.btnLeft}
                    name='phone-volume'
                    size={20}
                    color={R.colors.white100}
                    onPress={this.props.onRight}
                />
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        marginBottom: 10,
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
    },
    btnRight: {
        width: '65%',
        backgroundColor: null,
        borderWidth: 0.8,
        borderColor: R.colors.orangeColor,
    },
    btnLeft: {
        width: '30%',
        backgroundColor: R.colors.orangeColor,
    }
})