import { onLoginSocial } from './../../redux/actions/loginSocialAction';
import constants from 'libraries/utils/constants';
import React, { Component } from 'react';
import { View, Text, StyleSheet, Platform, TextInput, TouchableOpacity, TouchableWithoutFeedback, Keyboard } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import R from 'res/R';
import BaseInput from 'libraries/components/BaseInput';
import BaseButtonOpacity from 'libraries/components/BaseButtonOpacity';
import Header from 'libraries/components/Header';
import Container from 'libraries/components/Container';
import firebase from 'react-native-firebase';
import { connect } from 'react-redux';
import { onSignUp, onUpdatePhone, onResetUser, onResetSignUp } from '../../redux/actions';
import NavigationService from 'routers/NavigationService';
import { convertPhonenumber, showAlert } from 'libraries/utils/utils';
import { showMessage } from 'libraries/utils/utils';
import LoadingButton from 'libraries/components/LoadingButton';
import TabDismissKeybroad from 'libraries/components/TabDismissKeyboard';
import {hideKeyboard} from 'libraries/utils/utils';

class CheckNumberScreen extends Component {
    isAuthAndroid = false;
    constructor(props) {
        super(props);
        this.state = {
            code: '',
            confirmResult: null,
            count: 60
        };

        this.onNextSteep = this.onNextSteep.bind(this);
        this.onResendCode = this.onResendCode.bind(this);
    }

    
    componentDidMount() {

        if(Platform.OS === 'android'){
            this.unsubscribe = firebase.auth().onAuthStateChanged((user) => {
                if(user){
                    this.confirmPhoneSuccess();
                }
            });
        }
        this.verifyPhoneNumber();  
    }


    componentWillReceiveProps(nextProps) {
        if (!nextProps.loading && !nextProps.isLoadingSocial && !nextProps.loadingUpdatePhone) {
            this.loadingButton.show(false);
        }
    }

    componentDidUpdate(){
        // if (this.props.isRegistered || this.props.isUpdated) {
        //     NavigationService.reset('HomeScreen');
        // }
    }

    componentWillUnmount() {
        clearTimeout(this.clickedTimeout);
        clearInterval(this.counts);

        // this.props.onResetUser()
        // this.props.onResetSignUp()
        if (this.unsubscribe) this.unsubscribe();
    }
    render() {
        const btn = this.props.navigation.state.params.btn;
        return (
            <Container style={styles.container}>
                <Header
                    text={R.strings.header.hine_text_validatenumber}
                />

                <TabDismissKeybroad>
                    <View style={styles.contentStyle}>
                        <Text style={styles.txtCode}>{R.strings.validatenumber.hint_text_recevie_code}</Text>

                        <BaseInput
                            keyboardType='number-pad'
                            style={styles.inputCode}
                            maxLength={6}
                            autoFocus={true}
                            value={this.state.code}
                            onChangeText={(code) => this.setState({ code })}
                        />
                        <TouchableOpacity style={styles.countStyle}>
                            <BaseButtonOpacity
                                containerStyle={{ backgroundColor: null, width: null }}
                                text={ this.state.count === 0 ? R.strings.validatenumber.hint_text_resend_code : `${R.strings.validatenumber.hint_text_resend_code_in} ${this.state.count}s`}
                                textStyle={{ color: '#104a7a', textDecorationLine: 'underline' }}
                                onPress={this.onResendCode}
                            />
                            {this.state.count === 0 ? <Icon name="sync" size={14} color={R.colors.primaryColor} style={styles.iconSync} /> : null}

                        </TouchableOpacity>

                        <LoadingButton
                            ref={c => (this.loadingButton = c)}
                            containerStyle={{ marginTop: 20 }}
                            text={btn === 'ok' ? R.strings.forpassword.hint_text_confirm_create_password : R.strings.signup.hint_done_singup}
                            onPress={this.onNextSteep}
                        />
                    </View>
                </TabDismissKeybroad>
            </Container>
        );
    }
    _render_sync() {
        if (this.state.count === 0) {
            return <View style={{ justifyContent: 'center' }}>
                <Icon name="sync" size={14} color={R.colors.primaryColor} style={styles.iconSync} />
            </View>
        } else {
            return <View style={{ justifyContent: 'center' }}>
                <Text style={styles.textCount}>{this.state.count}</Text>
            </View>
        }
    }
    verifyPhoneNumber() {
        const number = this.props.navigation.state.params.number;
        this.counts = setInterval(() => {
            if (this.state.count > 0) {
                this.setState({ count: this.state.count - 1 });
            } else {
                this.setState({ count: 0 });
            }
        }, 1000)

        firebase.auth().signInWithPhoneNumber(number)
            .then(confirmResult => {
                this.setState({ confirmResult });
            })
            .catch(error => {
                return error;
            });
    }
    onResendCode = () => {
        const number = this.props.navigation.state.params.number;
        if (this.state.count === 0) {
            firebase.auth().signInWithPhoneNumber(number)
                .then(confirmResult => {
                    this.setState({ count: 60, code: '' });
                    alert("Mã xác nhận đã được gửi lại");
                })
                .catch(error => {
                    this.setState({ count: 60, code: '' })
                    alert("Chưa gửi lại được mã xác nhận, vui lòng kiểm tra lại số điện thoại hoặc đường truyền mạng");
                });
        } else {
            this.setState({ code: '' })
            alert("Vui lòng chờ 60 giây để gửi lại mã xác nhận");
        }
    }
    onNextSteep() {
        hideKeyboard();
        
        if (this.state.code.length === 0) {
            showMessage(R.strings.validatenumber.hint_text_no_input_code);
            return;
        }
    
        if (this.state.confirmResult) {

            this.loadingButton.show(true);

            this.state.confirmResult.confirm(this.state.code)
                .then((userValidation) => {
                    
                    this.confirmPhoneSuccess();
                })
                .catch(error => {
                    this.loadingButton.show(false);
                    alert('Mã xác nhận của bạn không đúng')
                });
        } else {
            alert('Mã xác nhận không tồn tại, số điện thoại chưa nhận được mã xác nhận')
        }
    }
    confirmPhoneSuccess(){

        if(this.isAuthAndroid) return;

        this.isAuthAndroid = true;

        this.clickedTimeout = setTimeout(()=> {
            this.isAuthAndroid = false
        }, 1000); 
        
        const { validatePhoneType, number, user, socialLoginType } = this.props.navigation.state.params;

        switch (validatePhoneType) {
            case constants.validatePhoneType.FORGOT_PASSWORD:
                this.loadingButton.show(false);
                this.setState({ code: '' });
                NavigationService.navigate('CreateNewPassword', { number });
                break;

            case constants.validatePhoneType.UPDATE_PHONE_NUMBER:
                //TODO: Call API update phone number and then go to main screen
                this.props.onUpdatePhone(socialLoginType, user.accessToken, convertPhonenumber(number))
                break;

            case constants.validatePhoneType.CREATE_NEW_SIGN_UP:
                const { password,  phone, name } = this.props.navigation.state.params;
                this.props.onSignUp(name, phone, password, password);

                break;

            case constants.validatePhoneType.CREATE_NEW_ACCOUNT:
                //TODO: call api signup and then go to main screen
                const { accessToken, email, } = user;
                this.props.onLoginSocial(user.name, email, convertPhonenumber(number), accessToken, socialLoginType)

                break;
        }
    }

}
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    contentStyle: {
        flex: 1,
        width: '100%',
        backgroundColor: 'white',
        alignItems: 'center'
    },
    txtCode: {
        color: '#104a7a',
        fontSize: 16,
        textAlign: 'center',
        marginTop: 50
    },
    inputCode: {
        width: '78%',
        borderColor: '#104a7a',
        borderWidth: 1,
        padding: 8,
        borderRadius: 20,
        marginTop: 20,
        textAlign: 'center',
        paddingTop: Platform.OS === 'ios' ? 12 : 5,
        paddingBottom: Platform.OS === 'ios' ? 12 : 5,
    },
    countStyle: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    textCount: {
        fontSize: 16,
        color: R.colors.primaryColor,
        textDecorationLine: 'underline'
    },
    iconSync: {
        color: R.colors.primaryColor,
        marginLeft: 3
    }
})

const mapStateToProps = state => {
    return {
        loading: state.signupReducer.loading,
        isRegistered: state.signupReducer.isRegistered,
        isLoadingSocial: state.loginSocialReducer.isLoadingSocial,
        loadingUpdatePhone: state.userReducer.loadingUpdatePhone,
        isUpdated: state.userReducer.isUpdated,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onSignUp: (name, phone, password, confirm_password) => dispatch(onSignUp(name, phone, password, confirm_password)),
        onLoginSocial: (name, email, phone, access_token, type) => dispatch(onLoginSocial(name, email, phone, access_token, type)),
        onUpdatePhone: (type, access_token, phone) => dispatch(onUpdatePhone(type, access_token, phone)),
        onResetUser: () => dispatch(onResetUser()),
        onResetSignUp: () => dispatch(onResetSignUp()),
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(CheckNumberScreen);