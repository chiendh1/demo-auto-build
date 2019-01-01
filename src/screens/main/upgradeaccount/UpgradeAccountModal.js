import React, { Component } from "react";
import { StyleSheet, Text, TouchableOpacity, View, Platform, FlatList } from "react-native";
import Modal from "react-native-modal";
import ButtonContent from './ButtonContent';
import R from "res/R";
import Icon from 'react-native-vector-icons/Ionicons';
import PropTypes from 'prop-types';
import ImageButton from "libraries/components/ImageButton";

export default class UpgradeAccountModal extends Component {

    static propTypes = {
        isVisible: PropTypes.bool,
        onClose: PropTypes.func,
        onClickItem: PropTypes.func,
    }
    renderModalContent = () => (
        <View style={styles.modalContent}>
            <View style={styles.headerStyle}>

                <ImageButton
                    onPress={this.props.onClose}
                    iconName='ios-close'
                    iconColor={R.colors.white100}
                    iconSize={30}
                />
                <Text style={styles.txtHeader}>Bạn là ai?</Text>
            </View>

            <FlatList
                data={this.props.role}
                keyExtractor={(item, index) => item.type.toString()}
                renderItem={({ item, index }) => {
                    return (
                        <ButtonContent
                            key={index}
                            text={item.name}
                            onPress={() => this.props.onClickItem(item)}
                            imgIcon={R.images.imageRole[item.type]}
                        />
                    )
                }}
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
        justifyContent: "center",
        alignItems: "center"
    },
    headerStyle: {
        backgroundColor: R.colors.orangeColor,
        width: '100%',
        height: 45,
        flexDirection: 'row',
        alignItems: 'center',
        borderTopRightRadius: 5,
        borderTopLeftRadius: 5,
        paddingHorizontal: 8,
        paddingVertical: 3,
    },
    iconStyle: {
        flex: 1,
        marginLeft: 5,
    },
    modalContent: {
        backgroundColor: "white",
        borderRadius: 5,
        borderColor: "rgba(0, 0, 0, 0.1)",
        paddingBottom: 5
    },
    txtHeader: {
        flex: 1,
        fontSize: 16,
        textAlign: 'center',
        color: R.colors.white100,
        paddingRight: 30,
    }
});


