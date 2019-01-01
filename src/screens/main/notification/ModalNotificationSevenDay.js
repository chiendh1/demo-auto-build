import React, { PureComponent } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Platform } from 'react-native';
import Modal from "react-native-modal";
import R from "res/R";
import PropTypes from 'prop-types';
import BaseButtonOpacity from "libraries/components/BaseButtonOpacity";
import HeaderNotification from './HeaderNotification';

export default class ModalNotificationSevenDay extends PureComponent {

    static propTypes = {
        isVisible: PropTypes.bool,
    }


    renderModalContent = () => (
        <View style={styles.modalContent}>
            <HeaderNotification onPress={this.props.onClose} />
            <Text style={styles.textContet}>{this.props.textContent}</Text>
            <View style={styles.btnStyle}>
                <BaseButtonOpacity
                    containerStyle={styles.btnLeft}
                    text={R.strings.notification.btn_you_find_done}
                    textStyle={{ color: R.colors.orangeColor, paddingLeft: null }}
                    onPress={this.props.onFindDone}
                />
                <BaseButtonOpacity
                    containerStyle={styles.btnRight}
                    textStyle={{ paddingLeft: null, paddingBottom: 2 }}
                    text={R.strings.notification.btn_you_find_no}
                    onPress={this.props.onFindNo}
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
    textContet: {
        width: '90%',
        fontSize: 16,
        marginVertical: 20,
    },
    btnStyle: {
        width: '88%',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        marginVertical: 20
    },
    btnLeft: {
        width: '45%',
        backgroundColor: null,
        borderColor: R.colors.orangeColor,
        borderWidth: 0.8,
        marginRight: 10,
    },
    btnRight: {
        width: '45%',
        backgroundColor: R.colors.orangeColor
    }
});
