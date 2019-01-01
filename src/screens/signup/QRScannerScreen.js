import React, { PureComponent } from 'react';

import { StyleSheet, View, Dimensions, Text } from 'react-native';

import QRCodeScanner from 'react-native-qrcode-scanner';
import Container from 'libraries/components/Container';
import Header from 'libraries/components/Header';
import R from 'res/R';
import { connect } from 'react-redux';
import {qrSCanners} from '../../redux/actions';
import NavigationService from 'routers/NavigationService';

const { height, width } = Dimensions.get('window');

class QRScannerScreen extends PureComponent {
    render() {
        return (
            <Container>
                <Header
                    text={R.strings.header.hint_text_qrscranner}
                />
                <QRCodeScanner
                    reactivate={true}
                    checkAndroid6Permissions={true}
                    fadeIn
                    showMarker
                    onRead={this.onSuccess.bind(this)}
                    style={styles.containerQR}
                    cameraStyle={styles.cameraStyle}
                    cameraType='back'
                />
                <Text style={styles.contentStyle}>{`Di chuyển camera đến vùng chứa \n mã QR để quét`}</Text>
            </Container>
        );
    }

    onSuccess(e) {
        const key = this.props.navigation.state.params.key;

        const data = e.data
        this.props.qrSCanners(data);
        
        if(key === 1){
            NavigationService.navigate('SignUpScreen')
        }else if(key === 2){
            NavigationService.navigate('IntroducesFriends')
        }
    }
}

const styles = StyleSheet.create({
    containerQR: {
        flex: 1
    },
    cameraStyle: {
        height: height / 2
    },
    contentStyle: {
        color: 'white',
        fontSize: 18,
        width: '100%',
        textAlign: 'center',
        marginBottom: 15
    }
});

const mapStateToProps = state => {
    return {
        textQR: state.qrscannerReducer.textQR,
    }
};

const mapDispatchToProps = dispatch => {
    return {
        qrSCanners: (text) => dispatch(qrSCanners(text))
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(QRScannerScreen);