import React, { PureComponent } from 'react';
import { View, Text, StyleSheet, TouchableHighlight, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import R from 'res/R';
import BaseButtonOpacity from './BaseButtonOpacity';

const { width } = Dimensions.get('window');

export default class DoYouKnow extends PureComponent {

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.viewStyle}>
                    <View style={styles.viewText}>
                        <Icon name="ios-qr-scanner" size={25} />
                        <Text style={styles.textView}>{R.strings.doyouknow.text_question}</Text>
                    </View>
                    <TouchableHighlight
                        onPress={this.props.onClose}
                        underlayColor="transparent"
                    >
                        <View style={styles.viewIcon}>
                            <Icon name="ios-close" size={30} />
                        </View>
                    </TouchableHighlight>
                </View>
                <Text style={{ textAlign: 'center', marginTop: -10 }}>
                    {this.props.cityNameInMax} đang tập trung số lượng {this.props.type === 'recruitment' ? 'tin tuyển dụng' : 'hồ sơ'} lớn nhất!
                </Text>
                <BaseButtonOpacity
                    text={R.strings.doyouknow.label_detail}
                    containerStyle={styles.containerStyle}
                    textStyle={styles.textButton}
                    onPress={this.props.onDetailCityMaxPressed}
                />
            </View>
        );
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: R.colors.white100,
        paddingHorizontal: 10,
        alignItems: 'center',
    },
    viewStyle: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    viewText: {
        flexDirection: 'row',
        paddingLeft: width / 3 - 5,
        alignItems: 'center',
        marginBottom: 3,
    },
    textView: {
        fontSize: 16,
        color: '#111111',
        paddingLeft: 10
    },
    viewIcon: {
        width: 50,
        height: 50,
        paddingTop: 3,
        alignItems: 'flex-end',
        paddingRight: 10

    },
    containerStyle: {
        width: '35%',
        height: 30,
        backgroundColor: R.colors.white100,
        borderWidth: 1,
        borderColor: R.colors.grey800,
        marginTop: 10,
    },
    textButton: {
        color: R.colors.grey800,
        paddingRight: 7,
        fontSize: 13
    }
})