import { Status } from './../../../../libraries/networking/status';
import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Modal from 'react-native-modal';
import R from 'res/R';
import BaseButtonOpacity from 'libraries/components/BaseButtonOpacity';

import FastImage from 'react-native-fast-image'

const { width, height } = Dimensions.get('window');

export default class ModalVoucher extends Component {
    state = {
        curTime: null,
    }
    renderModalContent = () => {
        const { data } = this.props;
        if (data) {
            return <View style={styles.modalContent}>
                <View style={styles.headerStyle}>
                    <TouchableOpacity onPress={this.props.onClose}>
                        <View style={{ paddingLeft: 7 }}>
                            <Icon name="ios-close" size={35} color={R.colors.white100} style={styles.iconStyle} />
                        </View>
                    </TouchableOpacity>
                    <Text style={styles.txtHeader}>{R.strings.discoutCode.text_voucher_discount_partner}</Text>
                </View>
                <View style={styles.wrapperFlatlist}>
                    <View style={styles.viewImage}>

                        <FastImage
                            style={styles.imageStyle}
                            source={{
                                uri: data.image
                            }}
                            resizeMode={FastImage.resizeMode.cover}
                        />
                    </View>
                    <View style={styles.viewContent}>
                        <View style={styles.lable}>
                            <Text style={styles.textLable}>{R.strings.discoutCode.text_partner}</Text>
                        </View>
                        <View style={styles.viewDes}>
                            <Text style={styles.textDes}>{data.conditions}</Text>
                        </View>
                    </View>
                    <View style={styles.viewButton}>
                        <Text style={styles.textVoucher}>{R.strings.discoutCode.text_date_end}: {data.date_end.substring(0, 11)}</Text>
                        <Text style={styles.textVoucher}>{R.strings.discoutCode.text_voucher_relocation}: {data.remaining_voucher}</Text>
                    </View>
                    <BaseButtonOpacity
                        text={`${R.strings.discoutCode.text_change_voucher} ${data.number_point} ${R.strings.discoutCode.text_get_code_voucher}`}
                        textStyle={{ fontSize: 15 }}
                        containerStyle={styles.containerStyle}
                        onPress={this.props.changeVoucher}
                    />
                </View>
            </View>
        }
        return <View></View>;
    };

    render() {
        return (
            <Modal isVisible={this.props.isVisible}>
                {this.renderModalContent()}
            </Modal>
        );
    }

}
const styles = StyleSheet.create({

    modalContent: {
        backgroundColor: R.colors.white100,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 5,
        borderColor: "rgba(0, 0, 0, 0.1)",
    },
    headerStyle: {
        backgroundColor: R.colors.orangeColor,
        width: '100%',
        height: 45,
        flexDirection: 'row',
        borderTopRightRadius: 5,
        borderTopLeftRadius: 5,
        paddingTop: 7,
    },
    txtHeader: {
        flex: 9,
        fontSize: 16,
        textAlign: 'center',
        color: R.colors.white100,
        paddingTop: 2,
        paddingBottom: 2
    },
    wrapperFlatlist: {
        marginHorizontal: 15,
        alignItems: 'center',
        marginBottom: 15
    },
    viewImage: {
        width: width - 50,
        height: height / 7,
        borderWidth: 0.5,
        borderColor: R.colors.white100,
        borderRadius: 3,
        paddingTop: 15
    },
    imageStyle: {
        width: width - 50,
        height: height / 7,
        borderRadius: 5,
    },
    viewContent: {
        width: '92%',
        flexDirection: 'row',
        marginTop: 30,
        marginLeft: 15,
    },
    lable: {
        width: 60,
        height: 20,
        borderRadius: 10,
        backgroundColor: R.colors.orangeColor,
        justifyContent: 'center',
        alignItems: 'center'
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
        width: width - 50,
        flexDirection: 'column',
        marginLeft: 10,
    },
    containerStyle: {
        backgroundColor: R.colors.orangeColor,
        width: '90%',
        marginTop: 30,
        paddingRight: 20,
    },
    textVoucher: {
        paddingTop: 20,
        fontSize: 13
    }
});