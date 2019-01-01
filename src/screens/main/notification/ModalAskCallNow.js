import React, { PureComponent } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import HeaderNotification from './HeaderNotification';
import BaseButtonOpacity from 'libraries/components/BaseButtonOpacity';
import Modal from "react-native-modal";
import R from 'res/R';
import PropTypes from 'prop-types';

class ModalAskCallNow extends PureComponent {

    static propTypes = {
        isVisible: PropTypes.bool,
    }


    constructor(props) {
        super(props);
        this.state = {
        };
    }

    renderModalContent = () => (
        <View style={styles.modalContent}>
            <HeaderNotification onPress={this.props.onClose} />
            <Text style={styles.textContet}>Bạn đã liên hệ thành công với {this.props.textContent} chưa?</Text>
            <View style={styles.btnStyle}>
                <BaseButtonOpacity
                    containerStyle={styles.btnLeft}
                    text={R.strings.notification.btn_you_call_failed}
                    textStyle={{ color: R.colors.orangeColor, paddingLeft: null }}
                    onPress={this.props.onFindNo}
                />
                <BaseButtonOpacity
                    containerStyle={styles.btnRight}
                    textStyle={{ paddingLeft: null }}
                    text={R.strings.notification.btn_you_call_done}
                    onPress={this.props.onFindDone}
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
        width: '40%',
        backgroundColor: null,
        borderColor: R.colors.orangeColor,
        borderWidth: 0.8,
        marginRight: 10,
    },
    btnRight: {
        width: '50%',
        backgroundColor: R.colors.orangeColor
    }
});

export default ModalAskCallNow;
