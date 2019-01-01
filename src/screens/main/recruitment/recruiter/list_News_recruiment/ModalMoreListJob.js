import React, { PureComponent } from "react";
import { StyleSheet, Text, View, Platform, Image, TouchableOpacity, TouchableWithoutFeedback } from "react-native";
import Modal from "react-native-modal";
import PropTypes from 'prop-types';
import R from "res/R";

export default class ModalMoreListJob extends PureComponent {
    static propTypes = {
        isVisible: PropTypes.bool,
    }
    render() {
        return (
            <Modal isVisible={this.props.isVisible} style={styles.modalContent} onBackdropPress={this.props.onBackdropPress}>
                <View style={styles.container}>
                    <TouchableOpacity onPress={this.props.onEdit} style={styles.btnStyle}>
                        <Text style={styles.textStyle}>{R.strings.listNewsRecruiment.text_edit_menu}</Text>
                        <Image
                            source={R.images.ic_pen_edit}
                            resizeMode='contain'
                            style={styles.imgLeftStyle}
                        />
                    </TouchableOpacity>
                    <View style={styles.viewSpace} ></View>
                    <TouchableOpacity onPress={this.props.onDel} style={styles.btnStyle}>
                        <Text style={[styles.textStyle, { color: R.colors.redA700 }]}>{R.strings.listNewsRecruiment.text_trash_menu}</Text>
                        <Image
                            source={R.images.ic_trash}
                            resizeMode='contain'
                            style={styles.imgLeftStyle}
                        />
                    </TouchableOpacity>
                </View>
            </Modal>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    modalContent: {
        backgroundColor: "white",
        borderRadius: 5,
        borderColor: "rgba(0, 0, 0, 0.1)",
        margin: 0,
        flex: 0,
        bottom: 0,
        position: 'absolute',
        width: '100%',
        paddingHorizontal: 20,
    },
    btnStyle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 12,
    },
    imgLeftStyle: {
        width: 18,
        height: 18,
    },
    textStyle: {
        fontSize: 16,
        fontWeight: Platform.OS === 'ios' ? '500' : '300',
    },
    viewSpace: {
        borderBottomWidth: 0.8,
        borderColor: R.colors.greyColor
    }
});


