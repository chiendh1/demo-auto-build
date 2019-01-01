import React, { PureComponent } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Platform } from 'react-native';
import Modal from "react-native-modal";
import R from "res/R";
import PropTypes from 'prop-types';
import HeaderNotification from './HeaderNotification';

export default class ModalThanksYou extends PureComponent {

    static propTypes = {
        isVisible: PropTypes.bool,
    }


    renderModalContent = () => (
        <View style={styles.modalContent}>
            <HeaderNotification onPress={this.props.onClose} />
            <Image
                source={R.images.ic_thanks_you}
                resizeMode='contain'
                style={styles.imgStyle}
            />
            <Text style={styles.textStyle}>{R.strings.notification.text_thanks}</Text>
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
    imgStyle: {
        width: 150,
        height: 150,
        marginVertical: 15,
    },
    textStyle: {
        fontSize: 16,
        textAlign:'center',
        color: R.colors.primaryColor,
        marginBottom: 20,
        fontWeight: Platform.OS ==='ios' ? '500' : '300',
    }
});
