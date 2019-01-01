import React, { PureComponent } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import R from 'res/R';
import BaseButtonOpacity from 'libraries/components/BaseButtonOpacity';

export default class ContentNotificationNewsRecru extends PureComponent {
    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.textHeader}>{this.props.txtTitle}</Text>
                <Text style={styles.textContent}>{this.props.txtContent}</Text>
                <BaseButtonOpacity
                    text={this.props.textBtn}
                    containerStyle={styles.btnStyle}
                    textStyle={{ color: R.colors.orangeColor, paddingLeft: null, }}
                    onPress={this.props.onPress}
                />
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
    textHeader: {
        marginTop: 10,
        marginBottom: 8,
        fontSize: 16,
        fontWeight: Platform.OS ==='ios' ? '500' : '300',
        color: R.colors.grey900
    },
    textContent: {
        color: R.colors.grey900,
        fontSize: 16,
        marginBottom: 10,
        marginLeft: 4,
    },
    btnStyle: {
        width:'100%',
        backgroundColor: null,
        borderColor: R.colors.orangeColor,
        borderWidth: 0.8,
        marginBottom: 5
    }
})