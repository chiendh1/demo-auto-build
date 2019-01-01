import React, { PureComponent } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Platform } from 'react-native';
import Modal from "react-native-modal";
import R from "res/R";
import PropTypes from 'prop-types';
import BaseButtonOpacity from "libraries/components/BaseButtonOpacity";
import ContentNotificationNewsRecru from './ContentNotificationNewsRecru';
import HeaderNotification from './HeaderNotification';

export default class ModalNotificationSevenDayContent extends PureComponent {

    static propTypes = {
        isVisible: PropTypes.bool,
    }


    renderModalContent = () => (
        <View style={styles.modalContent}>
            <HeaderNotification onPress={this.props.onClose}/>
            <View style={styles.content}>
                <ContentNotificationNewsRecru
                    txtTitle={this.props.txtTitleNewReset}
                    txtContent={this.props.txtCotentNewReset}
                    textBtn={R.strings.notification.text_news_btn}
                    onPress={this.props.onReset}
                />
                <View style={styles.viewSpace}></View>
                <ContentNotificationNewsRecru
                    txtTitle={this.props.txtTitleChange}
                    txtContent={this.props.txtContentChange}
                    textBtn={R.strings.notification.text_change_news_btn}
                    onPress={this.props.onChange}
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
    content: {
        width: '90%',
    },
    viewSpace: {
        width: '100%',
        borderColor: R.colors.greyColor,
        borderWidth: 0.5,
        marginTop: 5,
    }
});
