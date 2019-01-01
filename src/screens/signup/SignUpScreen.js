import React, { Component } from 'react';
import { View, Text, StyleSheet, Dimensions, Platform, Alert, ScrollView } from 'react-native';
import BaseInput from 'libraries/components/BaseInput';
import R from 'res/R';
import Header from 'libraries/components/Header';
import Container from 'libraries/components/Container';
import Icon from 'react-native-vector-icons/FontAwesome';
import BaseButtonOpacity from 'libraries/components/BaseButtonOpacity';
import { connect } from 'react-redux';
import NavigationService from 'routers/NavigationService';
import { showMessage, validatePhone, hideKeyboard, validateName, validatePassword } from 'libraries/utils/utils';
import database from 'libraries/utils/database';
import { checkPhone } from 'libraries/networking/apis';
import { qrSCanners } from '../../redux/actions';
import { Status, showErrorMessage } from 'libraries/networking/status';
import LoadingButton from 'libraries/components/LoadingButton';
import constants from 'libraries/utils/constants';
import TabDismissKeyboard from 'libraries/components/TabDismissKeyboard';
import firebase from 'react-native-firebase';
import OneSignal from 'react-native-onesignal';
import PasswordInput from 'libraries/components/PasswordInput';

const {height} = Dimensions.get('window');

class SignUpScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            phone: '',
            name: '',
            password: '',
            confirm_password: '',
            code_intro: this.props.textQR,
        };

        this.onPhoneNumberChanged = this.onPhoneNumberChanged.bind(this);
        this.onClickQR = this.onClickQR.bind(this);
        this.clickNextSteep = this.clickNextSteep.bind(this);
    }

    onPhoneNumberChanged = (phone) => {
        this.setState({ phone })
    };
    onFullname = (name) => {
        this.setState({ name })
    }
    onPassword = (password) => {
        this.setState({ password })
    }
    onConfilmPassword = (confirm_password) => {
        this.setState({ confirm_password })
    }
    onHaveAcount = () => {
        NavigationService.navigate('LoginScreen');
    }

    componentDidMount() {
        this.props.qrSCanner('');

        firebase.auth().signOut();
        OneSignal.sendTag('user_id', '');
    }

    render() {
        return (
            <Container>
                <Header
                    text={R.strings.header.hint_text_signup}
                />
                
                <TabDismissKeyboard>
                    <ScrollView style={{ flex: 1, backgroundColor: 'white' }}>

                    
                    <View style={styles.container}>
                        <BaseInput
                            style={styles.textinputStyle}
                            placeholder={R.strings.signup.hint_full_name}
                            onChangeText={this.onFullname}
                            value={this.state.fullname}
                            maxLength={32}
                        />
                        <BaseInput
                            style={styles.textinputStyle}
                            placeholder={R.strings.signup.hint_phone_number}
                            keyboardType='number-pad'
                            onChangeText={this.onPhoneNumberChanged}
                            value={this.state.phone}
                            maxLength={12}
                        />

                        <PasswordInput
                            style={styles.textinputStyle}
                            placeholder={R.strings.signup.hint_password}
                            password={true}
                            onChangeText={this.onPassword}
                            value={this.state.password}
                        />

                        <PasswordInput
                            style={styles.textinputStyle}
                            placeholder={R.strings.signup.hint_confirm_password}
                            password={true}
                            onChangeText={this.onConfilmPassword}
                            value={this.state.confilmPassword}
                        />

                        {/* <View style={styles.QrCode}>
                            <BaseInput
                                style={styles.inputCode}
                                placeholder={R.strings.signup.hint_invitation_code}
                                value={this.props.textQR}
                                onChangeText={(text) => { this.props.qrSCanner(text) }}
                            />
                            <TouchableOpacity onPress={this.onClickQR}>
                                <Icon name="qrcode" size={20} color="#104a7a" style={{ paddingRight: 10, }} />
                            </TouchableOpacity>
                        </View> */}
                        
                        <View style={styles.btnBotoom}>

                            <LoadingButton
                                ref={c => (this.loadingButton = c)}
                                text={R.strings.signup.hint_next_steep}
                                onPress={this.clickNextSteep}
                            />

                            <BaseButtonOpacity
                                containerStyle={{ width: '80%', backgroundColor: null, marginTop: 20, }}
                                text={R.strings.signup.hint_yes_account}
                                textStyle={{ color: '#104a7a', textDecorationLine: 'underline' }}
                                onPress={this.onHaveAcount}
                            />
                        </View>
                   
                   </View>
                   </ScrollView>
                </TabDismissKeyboard>
            </Container>
        );
    }
    onClickQR() {
        this.props.navigation.navigate('QRScannerScreen', {key: constants.QRcode.SiUp})
    };
    clickNextSteep() {

        hideKeyboard();

        const changeNumber = this.state.phone;
        let number = changeNumber;
        if (number.startsWith('0')) number = changeNumber.replace("0", "+84");
        let { name, password, phone, confirm_password, code_intro } = this.state;
        name.trimLeft().trimRight();
        if (!validateName(name)) {
            return;
        }
        if (!validatePhone(phone)) {
            return;
        }
        if (!validatePassword(password)) {
            return;
        }
        if (confirm_password !== password) {
            showMessage(R.strings.validate.msg_password_not_match);
            return;
        }
        this.loadingButton.show(true);
        checkPhone(this.state.phone, database.tokenCache).then(data => {
            this.loadingButton.show(false);

            if (data.code === Status.SUSSESS || data.code === Status.PHONE_ALREADY_LOGIN_SOCIAL) {
                Alert.alert(
                    'Thông báo',
                    'Số điện thoại đã được đăng ký trên hệ thống. Vui lòng đăng ký bằng số khác hoặc quay lại màn hình đăng nhập,',
                    [
                        { text: 'Quay lại đăng nhập', onPress: () => NavigationService.navigate('LoginScreen'), style: 'success' },
                        { text: 'Cancel', onPress: () => {} },
                    ]
                )
            } else if (data.code === Status.NOT_FOUND) {
                NavigationService.navigate('CheckNumberScreen', { number, name, phone, password, code_intro, validatePhoneType: constants.validatePhoneType.CREATE_NEW_SIGN_UP })
            } else {
                showErrorMessage(Status.GENERIC_ERROR);
            }
        })
    };
}

const styles = StyleSheet.create({
    container: {
        flex: 1, paddingTop: 35, alignItems: 'center', backgroundColor: 'white'
    },
    btnStyle: {
        backgroundColor: "#104a7a",
        width: '78%',
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
        borderWidth: 0.5,
        borderColor: 'white',
        marginTop: 50
    },
    QrCode: {
        width: '80%',
        borderColor: '#104a7a',
        borderWidth: 1,
        borderRadius: 20,
        marginTop: 30,
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 60
    },
    inputCode: {
        borderBottomWidth: 0,
        paddingLeft: 10,
        width: '90%',
        paddingTop: Platform.OS === 'ios' ? 10 : 3,
        paddingBottom: 3
    },
    btnBotoom: {
        flex: 1,
        width: '100%',
        alignItems: 'center',
        marginTop: height / 4
    },
    textinputStyle: {
        marginTop: 15,
        fontSize: 16
    }
});
const mapStateToProps = state => {
    return {
        textQR: state.qrscannerReducer.textQR,
        loading: state.signupReducer.loading,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        qrSCanner: (code_intro) => dispatch(qrSCanners(code_intro)),
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(SignUpScreen);

