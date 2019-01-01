import React, { Component } from 'react';
import { View, Text, Image, StyleSheet, Dimensions, TouchableHighlight } from 'react-native';
import R from 'res/R';
import Moment from 'moment';
import FastImage from 'react-native-fast-image';

const { width, height } = Dimensions.get('window');

export default class FlatlistDiscountCode extends Component {
    render() {
        const { item } = this.props;
        const curTime = Math.floor(Date.now() / 1000);
        let timeStamp = Math.floor(new Date(item.voucher.date_end.replace(" ", "T")).getTime() / 1000)
        let date_used = Moment(item.date_used).format('DD-MM-YYYY');
        let date_end = Moment(item.voucher.date_end).format('DD-MM-YYYY');
        return (
            <View style={styles.wrapperFlatlist}>
                <TouchableHighlight
                    underlayColor='transparent'
                    onPress={() => this.props.onDetail(item)}
                >
                    <View style={styles.viewImage}>
                        <FastImage
                            style={styles.imageStyle}
                            source={{ uri: item.voucher.image }}
                            resizeMode={FastImage.resizeMode.cover}
                        />
                        {curTime - timeStamp > 0 ? <Image source={R.images.ic_expired} style={{ width: 50, height: 50, position: 'absolute', right: 0 }} /> : null}
                    </View>
                </TouchableHighlight>

                <View style={styles.viewContent}>
                    <View style={styles.lable}>
                        <Text style={styles.textLable}>{R.strings.discoutCode.text_partner}</Text>
                    </View>
                    <View style={styles.viewDes}>
                        <Text style={styles.textDes}>{item.voucher.conditions}</Text>
                    </View>
                </View>
                <View style={styles.viewDate}>
                    <View style={{ flexDirection: 'column' }}>
                        <Text style={styles.textDate}>{R.strings.discoutCode.text_day_use} {date_used.substring(0, 11)}</Text>
                        <Text style={styles.textDate}>{R.strings.discoutCode.text_HSD}: {date_end.substring(0, 11)}</Text>
                    </View>
                    <View style={styles.viewDiscount}>
                        <Text style={styles.textDiscount}>{R.strings.detailStar.text_discount}</Text>
                        <View style={styles.viewButton}>
                            <Text style={styles.textCode} selectable={true}>{item.code}</Text>
                        </View>
                    </View>
                </View>

            </View>
        );
    }
}
const styles = StyleSheet.create({
    wrapperFlatlist: {
        flex: 1,
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
        marginHorizontal: 15
    },
    textDes: {
        fontSize: 12,
        color: R.colors.primaryColor
    },
    viewButton: {
        width: 100,
        height: 30,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: R.colors.orangeColor,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 10
    },

    viewDate: {
        width: '100%',
        flexDirection: 'row',
        marginHorizontal: 15,
        paddingVertical: 5,
        justifyContent: 'space-between',
        paddingHorizontal: 10,
    },
    textDate: {
        paddingTop: 5
    },
    viewDiscount: {
        flexDirection: 'column',
        alignItems: 'center'
    },
    textDiscount: {
        paddingLeft: 7,
        color: R.colors.yellow900,
        fontSize: 12,
        paddingBottom: 5
    },
    textCode: {
        color: R.colors.yellow900,
        fontSize: 13
    }
})
