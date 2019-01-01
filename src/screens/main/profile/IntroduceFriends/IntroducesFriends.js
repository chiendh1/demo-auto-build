import { Status, showErrorMessage } from 'libraries/networking/status';
import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, Share, ScrollView, KeyboardAvoidingView, Keyboard } from 'react-native';
import Container from 'libraries/components/Container';
import Header from 'libraries/components/Header';
import R from 'res/R';
import NavigationService from 'routers/NavigationService';
import BaseButtonOpacity from 'libraries/components/BaseButtonOpacity';
import { qrSCanners, onUpdateUser } from '../../../../redux/actions';
import { connect } from 'react-redux';
import { putIntroduceFriend, getConfig } from 'libraries/networking/apis';
import database from 'libraries/utils/database';
import constants from 'libraries/utils/constants';
import { showMessage, hideKeyboard } from 'libraries/utils/utils';
import ModalNotification from './ModalNotifacation';
import Icon from 'react-native-vector-icons/FontAwesome';
import BaseInput from 'libraries/components/BaseInput';
import QRCode from 'react-native-qrcode';


class IntroducesFriends extends Component {

    isButtonPressed = false;
    constructor(props) {
        super(props);
        this.state = {
            code_intro: this.props.textQR,
            isVisible: false,
            showInput: true,
            point: null,
            result: '',
        };
    }
    componentDidMount() {
        getConfig(database.tokenCache).then(response => {
            if (response.data.point) {
                this.setState({ point: response.data.point })
            }
        })
        this.props.qrSCanner('')
    }
    onShareContent = () => {
        Share.share({
            message: 'Tải ứng dụng LimberNow ngay:'+ 'https://play.google.com/store/apps/details?id=vn.noithathg' + '\n' 
            + 'Đừng quên nhập mã' + ' ' + database.user.code_present.toUpperCase() + ' ' + 'để nhận ngay' + ' '+ this.state.point + ' ' + 'điểm' ,
        }).then(this.showResult)
    }
    showResult = result => {
        this.setState({ result: result })
    }
    render() {
        return (
            <Container styles={styles.container}>
                <Header
                    text={R.strings.Introduce.text_introduce_friend}
                    onLeftPressed={() => NavigationService.pop()}
                />

                {this.showModal()}
                <ScrollView
                    keyboardShouldPersistTaps='always'
                >
                    <KeyboardAvoidingView style={styles.contentStyles} behavior='position' enabled>
                        <Text style={styles.textIntroduce}>{R.strings.Introduce.text_introduce(this.state.point)}</Text>
                        <Text style={styles.textQRStyle}>{R.strings.Introduce.text_QR}</Text>
                        <View style={styles.viewQRStyle}>
                            <View style={styles.borderQR}>
                                <QRCode
                                    value={database.user.code_present ? database.user.code_present : ''}
                                    size={120}
                                    bgColor={R.colors.grey900}
                                    fgColor='white'
                                />
                            </View>
                            <View style={[styles.borderQR, styles.borderQR1]}>
                                <Text>{R.strings.Introduce.text_your_code}: </Text>
                                <Text style={styles.textQR} selectable={true}>{database.user.code_present.toUpperCase()}</Text>
                            </View>
                        </View>
                        <View style={styles.viewBtnStyle}>
                            <BaseButtonOpacity
                                text={R.strings.Introduce.text_share_code}
                                containerStyle={styles.buttonShare}
                                name="share-alt"
                                size={16}
                                color={R.colors.white100}
                                textStyle={{ fontSize: 14 }}
                                onPress={this.onShareContent}
                            />
                        </View>

                        {this._renderInputCodeFriend()}

                    </KeyboardAvoidingView>
                </ScrollView>

            </Container>
        );
    }

    _renderInputCodeFriend() {
        if (!database.user.code_intro) {
            return (
                <View style={styles.wrapperShare}>
                    <Text style={styles.textPoint}>{R.strings.Introduce.text_input_code_friends(this.state.point)}</Text>

                    <View style={styles.viewButton}>
                        <View style={styles.QrCode}>
                            <BaseInput
                                style={styles.inputCode}
                                autoCapitalize='characters'
                                placeholder={R.strings.Introduce.text_input_code}
                                value={this.props.textQR}
                                onChangeText={(textQR) => { this.props.qrSCanner(textQR) }}
                            />
                            <TouchableOpacity onPress={this.onClickQR}>
                                <Icon name="qrcode" size={20} color="#104a7a" style={styles.iconQR} />
                            </TouchableOpacity>
                        </View>
                        <BaseButtonOpacity
                            text={R.strings.Introduce.text_button}
                            containerStyle={styles.buttonSucces}
                            onPress={this.onPressQR}
                        />
                    </View>
                </View>
            )
        }
        return null;
    }
    onClickQR() {
        NavigationService.navigate('QRScannerScreen', { key: constants.QRcode.Intro })
    };

    onPressQR = () => {

        if (this.isButtonPressed) return;

        this.isButtonPressed = true;

        this.timeoutButton = setTimeout(() => {
            this.isButtonPressed = false;
        }, 1000)

        hideKeyboard();
        if (this.props.textQR.length === 0) {
            showMessage(R.strings.validate.msg_input_introduce)
            return;
        }
        putIntroduceFriend(database.user.id_users, this.props.textQR, database.tokenCache)
            .then(response => {
                if (response.code === Status.SUSSESS) {
                    database.user = response.data.user;
                    this.props.onUpdateUser(database.user)
                    this.setState({ isVisible: true })
                } else if (response.code === Status.CODE_DOES_NOT_EXIT) {
                    showMessage(R.strings.Introduce.msg_code_does_not_exist)
                } else if (response.code === Status.NOT_ENTER_YOUR_CODE) {
                    showMessage(R.strings.Introduce.msg_not_enter_your_code)
                } else if (response.code === Status.ERROR_MULTI_CODE) {
                    showMessage(R.strings.Introduce.msg_multi_click_code)
                }
            }).catch(error => {
                return error
            })
    }
    showModal() {
        return (
            <ModalNotification
                isVisible={this.state.isVisible}
                onClose={this.onClose}
                point={this.state.point}
            />
        );
    }
    onClose = () => {
        this.setState({ isVisible: false })
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    viewQRStyle: {
        alignItems: 'center',
    },
    viewBtnStyle: {
        alignItems: 'center'
    },
    QrCode: {
        width: '65%',
        height: 40,
        borderColor: '#104a7a',
        borderWidth: 1,
        borderRadius: 20,
        justifyContent: 'space-between',
        flexDirection: 'row',
    },
    inputCode: {
        borderBottomWidth: 0,
        paddingLeft: 10,
        width: '90%',
        paddingTop: Platform.OS === 'ios' ? 10 : 3,
        paddingBottom: 3,
        paddingLeft: 20
    },
    contentStyles: {
        flex: 1,
        backgroundColor: R.colors.white100,
        flexDirection: 'column',
        alignItems: 'center',
        paddingBottom: Platform.OS === 'ios' ? 80 : null,
    },
    textIntroduce: {
        textAlign: 'center',
        fontSize: 15,
        fontWeight: '500',
        color: R.colors.orangeColor,
        marginVertical: 15
    },
    textQRStyle: {
        fontSize: 15,
        textAlign: 'center',
        paddingVertical: 10,
        color: R.colors.grey900
    },
    borderQR: {
        width: 150,
        height: 150,
        borderWidth: 1,
        borderRadius: 5,
        borderColor: R.colors.grey800,
        borderStyle: 'dashed',
        marginVertical: 15,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row'
    },
    borderQR1: {
        width: 220,
        height: 40,
        marginVertical: 7
    },
    textQR: {
        color: R.colors.orangeColor,
        fontSize: 14
    },
    buttonShare: {
        backgroundColor: R.colors.orangeColor,
        width: '90%',
        marginTop: 25
    },
    wrapperShare: {
        alignItems: 'center'
    },
    textPoint: {
        textAlign: 'center',
        margin: 30,
        fontSize: 14,
    },
    viewButton: {
        flex: 1,
        flexDirection: 'row'
    },
    iconQR: {
        paddingRight: 10,
        paddingVertical: 9
    },
    buttonSucces: {
        backgroundColor: R.colors.orangeColor,
        width: '25%',
        height: 40,
        borderRadius: 20,
        marginLeft: 5,
        paddingRight: 10,
        paddingBottom: 3
    }
})
const mapStateToProps = state => {
    return {
        textQR: state.qrscannerReducer.textQR,
        loading: state.signupReducer.loading,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        qrSCanner: (code_intro) => dispatch(qrSCanners(code_intro)),
        onUpdateUser: (user) => dispatch(onUpdateUser(user))
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(IntroducesFriends);