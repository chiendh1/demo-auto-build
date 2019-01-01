import React, { PureComponent } from 'react';
import { View, Text, TouchableHighlight, StyleSheet, Dimensions } from 'react-native';
import BaseButtonOpacity from 'libraries/components/BaseButtonOpacity';
import R from 'res/R';

import FastImage from 'react-native-fast-image'
const { width, height } = Dimensions.get('window');

export default class ListVoucher extends PureComponent {

    render() {
        const { item } = this.props;
        return (
            <View style={styles.wrapperFlatlist}>
                <TouchableHighlight
                    underlayColor='transparent'
                    onPress={() => this.props.onDetail(item)}
                >
                    <View style={styles.viewImage}>
                        <FastImage
                            style={styles.imageStyle}
                            source={{
                                uri: item.image,
                            }}
                            resizeMode={FastImage.resizeMode.cover}
                        />
                    </View>
                </TouchableHighlight>

                <View style={styles.viewContent}>
                    <View style={styles.lable}>
                        <Text style={styles.textLable}>{R.strings.discoutCode.text_partner}</Text>
                    </View>
                    <View style={styles.viewDes}>
                        <Text style={styles.textDes}>{item.conditions}</Text>
                    </View>
                </View>

                <View style={styles.viewButton}>
                    <Text style={styles.textNumberVoucher}>{R.strings.discoutCode.text_remaining}: {item.remaining_voucher}/{item.number_voucher}</Text>
                    <BaseButtonOpacity
                        text={`${item.number_point} - ${R.strings.discoutCode.text_change}`}
                        textStyle={{ fontSize: 15, paddingRight: 10 }}
                        containerStyle={styles.containerStyle}
                        onPress={() => this.props.onModal(item)}
                    />
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    wrapperFlatlist: {
        marginHorizontal: 5,
        alignItems: 'center',
        marginTop: 15,
        backgroundColor: R.colors.white100,
        borderRadius: 3
    },
    viewImage: {
        width: width - 15,
        height: height / 7,
    },
    imageStyle: {
        width: width - 15,
        height: height / 7,
        borderRadius: 3
    },
    viewContent: {
        width: '100%',
        flexDirection: 'row',
        paddingVertical: 7
    },
    lable: {
        width: 60,
        height: 20,
        borderRadius: 10,
        backgroundColor: R.colors.orangeColor,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 10
    },
    textLable: {
        fontSize: 12,
        color: R.colors.white100
    },
    viewDes: {
        width: width - 100,
        paddingHorizontal: 15
    },
    textDes: {
        fontSize: 12,
        color: R.colors.primaryColor
    },
    viewButton: {
        width: width - 30,
        flexDirection: 'row',
        marginVertical: 10,
        justifyContent: 'space-between',
    },
    containerStyle: {
        backgroundColor: R.colors.orangeColor,
        width: '40%',
        height: 30
    },
    textNumberVoucher: {
        paddingTop: 15,
        fontSize: 14
    }
})