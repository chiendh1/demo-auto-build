
import React, { Component } from 'react';
import { View, Text, SafeAreaView, StyleSheet, Keyboard, StatusBar } from 'react-native';
import { LoginManager, GraphRequest, GraphRequestManager } from "react-native-fbsdk";
import R from 'res/R';
import BaseInput from 'libraries/components/BaseInput';
import Logo from './Logo';
import BaseButtonOpacity from 'libraries/components/BaseButtonOpacity';
import ForgotPasswordButton from './ForgotPasswordButton';
import LoginSocialButton from './LoginSocialButton';
import NavigationService from 'routers/NavigationService';
import { connect } from 'react-redux';
import { onLogin, checkAPILoginSocial } from '../../redux/actions';
import { showMessage, validatePhone, hideKeyboard } from 'libraries/utils/utils';
import { GoogleSignin, statusCodes } from 'react-native-google-signin';
import constants from 'libraries/utils/constants';
import LoadingButton from 'libraries/components/LoadingButton';
import LoadingPage from 'libraries/components/LoadingPage';
import TabDismissKeyboard from 'libraries/components/TabDismissKeyboard';

import OneSignal from 'react-native-onesignal';
import firebase from 'react-native-firebase';
import PasswordInput from 'libraries/components/PasswordInput';

class LoginScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            telephone: '',
            password: '',
        };
    }

    componentDidMount() {
        GoogleSignin.configure({
            iosClientId: '232705078716-6tnhormefli1a4rrhjsdt153695dca6d.apps.googleusercontent.com',
            webClientId: '232705078716-7g83knf9j27aifpefj4s8e79f2kcfrdf.apps.googleusercontent.com',
            offlineAccess: true
        });
        LoginManager.logOut();
        firebase.auth().signOut();

        OneSignal.sendTag('user_id', '');
    }


    componentWillReceiveProps(nextProps) {
        if (this.props.isLoadingSocial && nextProps.isCheckSuccess) {
            NavigationService.reset('HomeScreen');
        }
        if (nextProps.isLoading !== this.props.isLoading) {
            this.loadingButton.show(nextProps.isLoading);
        }
    }

    onPhoneChanged = (telephone) => {
        this.setState({ telephone }) 
    }

    onPasswordChanged = (password) => {
        this.setState({ password })
    }
    authFb = async () => {
        await LoginManager.logInWithReadPermissions(['public_profile', 'email']);
        const userInfo = await this.graphRequest();
        
        
        let user = {
            ...userInfo,
            accessToken: userInfo.id
        }

        this.props.checkAPILoginSocial(constants.socialLoginType.FACEBOOK, user);
    }
    graphRequest() {
        return new Promise((resolve, reject) => {
            const infoRequest = new GraphRequest('/me', {
                parameters: {
                    fields: {
                        string: 'email,name,first_name,last_name'
                    }
                }
            }, (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result);

                }
            });
            new GraphRequestManager()
                .addRequest(infoRequest)
                .start()
        })
    }

    render() {
        return (
            <TabDismissKeyboard>
                <SafeAreaView style={styles.container}>
                    <StatusBar
                        barStyle="dark-content"
                        backgroundColor="#104a7a"
                    />
                    
                    <Logo />
                    
                    <View style={{ alignItems: 'center', marginTop: 50 }}>
                        <BaseInput
                            placeholder={R.strings.login.hint_phone_number}
                            keyboardType='number-pad'
                            value={this.state.telephone}
                            maxLength={12}
                            onChangeText={this.onPhoneChanged}
                        />
                        
                        
                        <PasswordInput
                            style={{ marginTop: 10 }}
                            placeholder={R.strings.login.hint_password}
                            value={this.state.password}
                            password={true}
                            onChangeText={this.onPasswordChanged}
                        />
                    </View>


                    <View style={{ alignItems: 'center', marginTop: 28 }}>

                        <LoadingButton
                            ref={c => (this.loadingButton = c)}
                            containerStyle={{ marginBottom: 20 }}
                            text={R.strings.login.label_login}
                            onPress={this.onSignInPressed}
                        />

                        <BaseButtonOpacity
                            onPress={this.onSignUpPressed}
                            containerStyle={{ backgroundColor: R.colors.amber1000, marginBottom: 20 }}
                            text={R.strings.login.label_sign_up}
                        />

                        <ForgotPasswordButton
                            onPress={this.onForgotPassword}
                        />

                        <Text style={{ color: R.colors.primaryColor, marginBottom: 20 }} >{R.strings.login.label_sign_in_with}</Text>

                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                        <LoginSocialButton
                            iconName='facebook-f'
                            iconColor={R.colors.primaryColor}
                            containerStyle={{ borderColor: R.colors.primaryColor }}
                            onSocialPress={this.authFb}
                        />

                        <LoginSocialButton
                            iconName='google-plus'
                            iconColor={R.colors.secondaryColor}
                            containerStyle={{ borderColor: R.colors.secondaryColor }}
                            onSocialPress={this.onGooglePressed}
                        />
                    </View>

                    <LoadingPage
                        visible={this.props.isLoadingSocial}
                    />
                   {/* </TabDismissKeyboard> */}
                </SafeAreaView>
                </TabDismissKeyboard>
        );

    }
    onForgotPassword = () => {
        NavigationService.navigate('ForgotPasswordScreen', { validatePhoneType: constants.validatePhoneType.FORGOT_PASSWORD });
    }
    onSignUpPressed = () => {
        hideKeyboard();
        NavigationService.navigate('SignUpScreen');
    }
    onSignInPressed = () => {
        let { telephone, password } = this.state;
        Keyboard.dismiss()
        if (!validatePhone(telephone)) {
            return;
        }

        if (password.length === 0) {
            showMessage(R.strings.validate.msg_empty_password);
            return;
        }
        if (password.length < 6) {
            showMessage(R.strings.validate.msg_length_password_invalid);
            return;
        }
        this.props.onLogin(telephone, password);
    }

    onGooglePressed = async () => {
        try {
            await GoogleSignin.hasPlayServices();
            const userInfo = await GoogleSignin.signIn();
            if (userInfo) {
                let user = {
                    ...userInfo.user,
                    accessToken: userInfo.user.id
                }
    
                this.props.checkAPILoginSocial(constants.socialLoginType.GOOGLE, user);
            }
        } catch (error) {
            if (error.code === statusCodes.SIGN_IN_CANCELLED) {
                // user cancelled the login flow
            } else if (error.code === statusCodes.IN_PROGRESS) {
                // operation (f.e. sign in) is in progress already
            } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
                // play services not available or outdated
            } else {
                // some other error happened
            }
        }
    };
}




const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
})


const mapStateToProps = state => {
    return {
        isLoadingSocial: state.checkSocialReducer.isLoadingSocial,
        isCheckSuccess: state.checkSocialReducer.isCheckSuccess,
        isLoading: state.loginReducer.isLoading,
        isLoggedIn: state.loginReducer.isLoggedIn
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onLogin: (telephone, password) => dispatch(onLogin(telephone, password)),
        checkAPILoginSocial: (type, user) => dispatch(checkAPILoginSocial(type, user))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen);