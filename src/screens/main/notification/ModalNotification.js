import React, { PureComponent } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Platform } from 'react-native';
import Modal from "react-native-modal";
import R from "res/R";
import PropTypes from 'prop-types';
import BaseButtonOpacity from "libraries/components/BaseButtonOpacity";
import Icon from 'react-native-vector-icons/Ionicons';
import HeaderNotification from './HeaderNotification';
export default class ModalNotification extends PureComponent {

    static propTypes = {
        isVisible: PropTypes.bool,
        onSee: PropTypes.func,
        onContinue: PropTypes.func,
        textTitle: PropTypes.string,
        textContent: PropTypes.string,
        onClose: PropTypes.func,
    }

    renderModalContent = () => (
        <View style={styles.modalContent}>
            <HeaderNotification onPress={this.props.onClose}/>
            <Image
                style={styles.imgNoti}
                source={R.images.icon_notifi}
                resizeMode='contain'
            />
            <Text style={styles.textTitle}>{R.strings.notification.hint_noti_title}</Text>
            <Text style={styles.textContent}>{R.strings.notification.hint_noti_content}</Text>
            <View style={styles.viewBtn}>
                <BaseButtonOpacity
                    onPress={this.props.onSee}
                    text={R.strings.notification.btn_see_rights}
                    containerStyle={styles.btnSee}
                    textStyle={styles.textSee}
                />
                <BaseButtonOpacity
                    onPress={this.props.onContinue}
                    text={R.strings.notification.btn_continue}
                    containerStyle={styles.btnHave}
                    textStyle={styles.textContinue}
                />
            </View>
        </View>
    );
    render() {
        return (
            <View style={styles.container}>
                <Modal isVisible={this.props.isVisible}>
                    {this.renderModalContent()}
                </Modal>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: "white",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 5,
        borderColor: "rgba(0, 0, 0, 0.1)",
        paddingBottom: 5
    },
    imgNoti: {
        width: 200,
        height: 200
    },
    viewBtn: {
        flexDirection: 'row',
        marginTop: 30,
        marginBottom: 20
    },
    btnSee: {
        flex: 1,
        marginLeft: 30,
        backgroundColor: null,
        borderColor: R.colors.orangeColor,
        borderWidth: 0.5,
    },
    btnHave: {
        flex: 1,
        marginLeft: 10,
        marginRight: 30,
        backgroundColor: R.colors.orangeColor,
    },
    textSee: {
        color: R.colors.orangeColor,
        paddingLeft: null,
    },
    textTitle: {
        color: R.colors.primaryColor,
        textAlign:'center',
        fontSize: 18,
        width: 250,
        fontWeight: '500',
    },
    textContent: {
        fontSize: 18,
        color: R.colors.grey900,
        marginLeft: 10,
        marginRight: 10,
        marginTop: 10
    },
    textContinue: {
        paddingLeft: null
    }
});
