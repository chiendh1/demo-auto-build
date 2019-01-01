import React, { Component } from "react";
import { StyleSheet, Text, View } from "react-native";
import Modal from "react-native-modal";
import R from "res/R";
import PropTypes from 'prop-types';
import BaseButtonOpacity from "libraries/components/BaseButtonOpacity";
export default class UpgradeAccountModal extends Component {

    static propTypes = {
        isVisible: PropTypes.bool,
    }

    renderModalContent = () => (
        <View style={styles.modalContent}>
            <Text style={styles.textHeader}>{R.strings.selectService.hint_signin_done}</Text>
            <Text style={styles.contentStyle}>{R.strings.selectService.hint_noti_signin}</Text>
            <View style={styles.viewBtn}>
                <BaseButtonOpacity
                    onPress={this.props.onSee}
                    text={R.strings.selectService.btn_see_benefits}
                    containerStyle={styles.btnSee}
                    textStyle={styles.textSee}
                />
                <BaseButtonOpacity
                    onPress={this.props.onHave}
                    text={R.strings.selectService.btn_have_understand}
                    containerStyle={styles.btnHave}
                    textStyle={styles.textHave}
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
    textHeader: {
        textAlign: 'center',
        fontSize: 18,
        fontWeight: '600',
        color: R.colors.grey900,
        marginTop: 20,
        marginBottom: 10,
    },
    contentStyle: {
        fontSize: 16,
        color: R.colors.grey900,
        marginLeft: 10,
        marginRight: 10,
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
        paddingLeft: null
    },
    textHave: {
        paddingLeft: null
    }
});
