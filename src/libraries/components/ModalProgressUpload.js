import React, { PureComponent } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Modal from "react-native-modal";
import * as Progress from 'react-native-progress';
import R from 'res/R';

export default class ModalProgressUpload extends PureComponent {

    constructor(props) {
        super(props);

        this.state = {
            progress: 0
        }
    }

    setProgress(progress) {
        this.setState({ progress })
    }

    renderModalContent = () => {
        return (
            <View style={styles.modalContent}>
                <Text style={styles.txtTitle}>{this.props.titleUpload}</Text>
                <Progress.Circle
                    style={styles.progress}
                    progress={this.state.progress}
                    showsText={true}
                    size={100}
                />
            </View>
        )
    };
    render() {
        return (
            <View style={styles.container}>
                <Modal isVisible={this.state.progress > 0}>
                    {this.renderModalContent()}
                </Modal>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    modalContent: {
        backgroundColor: "white",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 5,
        borderColor: "rgba(0, 0, 0, 0.1)",
        paddingBottom: 5,
    },
    progress: {
        margin: 10,
    },
    txtTitle: {
        marginTop: 10,
        fontSize: 18,
        fontWeight: '600',
        color: R.colors.primaryColor,
        textAlign: 'center'
    }
})