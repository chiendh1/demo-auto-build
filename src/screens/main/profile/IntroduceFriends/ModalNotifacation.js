import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/Ionicons';
import R from 'res/R';

const { width, height } = Dimensions.get('window');

export default class ModalNotification extends Component {
 
  render() {
    return (
        <Modal isVisible={this.props.isVisible}>
        <View style={styles.modalContent}>
            <View style={styles.headerStyle}>
                <TouchableOpacity onPress={this.props.onClose}>
                    <View>
                        <Icon name="ios-close" size={35} color={R.colors.white100} style={styles.iconStyle} />
                    </View>
                </TouchableOpacity>
            </View>
            <Image source={R.images.ic_notifi} style={styles.imageStyle} resizeMode="contain" />
            <Text style={styles.textShare}>{R.strings.Introduce.msg_introduce_success(this.props.point)}</Text>
        </View>
    </Modal>
    );
  }
}

const styles = StyleSheet.create({
    headerStyle: {
        backgroundColor: R.colors.orangeColor,
        width: '100%',
        height: 45,
        flexDirection: 'row',
        borderTopRightRadius: 5,
        borderTopLeftRadius: 5,
    },
    modalContent: {
        backgroundColor: R.colors.white100,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 5,
        borderColor: "rgba(0, 0, 0, 0.1)",
    },
    iconStyle: {
        paddingLeft: 10,
        paddingTop: 5
    },
    imageStyle: {
        width: width / 2, 
        height: height / 3, 
        paddingVertical: height / 5
    },
    textShare: {
        color: R.colors.primaryColor, 
        textAlign: 'center', 
        paddingBottom: 40, 
        fontSize: 17, 
        marginHorizontal: 30
    }
})