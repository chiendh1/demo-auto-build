// KhanhLouis code

import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, Dimensions } from 'react-native';
import Modal from "react-native-modal";
import HeaderNotification from 'screens/main/notification/HeaderNotification';
import R from 'res/R';
import BaseButtonOpacity from 'libraries/components/BaseButtonOpacity';


const { width, height } = Dimensions.get('window');

export default class ModalMissingProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    renderModalContent = () => (
        <View style={styles.modalContent}>
            <HeaderNotification
                text="BẠN CÓ BIẾT"
                onPress={this.props.onClose}
            />
            <Image source={R.images.bg_star} style={{ width: width / 3, height: height / 5, marginVertical: 25 }} />

            <View style={{ marginHorizontal: 20, marginBottom: 30 }}>
                <Text style={{ fontSize: 15, color: '#333333' }}>{R.strings.notification.text_noti_missing_profile}</Text>
            </View>

            <BaseButtonOpacity
                text='Hồ sơ của tôi'
                containerStyle={{ marginBottom: 30, backgroundColor: null, borderWidth: 0.5, borderColor: R.colors.orangeColor }}
                textStyle={{ color: R.colors.orangeColor }}
                onPress={this.props.onProfileOfMe}
            />
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
        alignItems: 'center'
    },
    modalContent: {
        backgroundColor: "white",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 5,
        borderColor: "rgba(0, 0, 0, 0.1)",
        paddingBottom: 5
    },
})