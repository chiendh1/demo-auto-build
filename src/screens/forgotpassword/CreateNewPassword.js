import NavigationService from 'routers/NavigationService';
import { showErrorMessage } from './../../libraries/networking/status';
import { forgotPassword } from './../../libraries/networking/apis';
import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Container from 'libraries/components/Container';
import Header from 'libraries/components/Header';
import R from 'res/R';
import BaseButtonOpacity from 'libraries/components/BaseButtonOpacity';
import { showMessage, convertPhonenumber } from 'libraries/utils/utils';
import { Status } from 'libraries/networking/status';
import TabDismissKeybroad from 'libraries/components/TabDismissKeyboard';
import PasswordInput from 'libraries/components/PasswordInput';
import { connect } from 'react-redux';
import { onUpdateUser } from '../../redux/actions';
import database from 'libraries/utils/database';

class CreateNewPassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            password: '',
            confirm_password: '',
        };
    }

    onPassword = (password) => {
        this.setState({ password })
    }
    onConfilmPassword = (confirm_password) => {
        this.setState({ confirm_password })
    }

    render() {
        return (
            <Container>
                <Header
                    text={R.strings.header.hint_create_password}
                />
                <TabDismissKeybroad>
                    <View style={styles.container}>
                        <PasswordInput
                            style={styles.textInput}
                            placeholder={R.strings.forpassword.hint_text_input_password}
                            password={true}
                            onChangeText={this.onPassword}
                            value={this.state.password}
                        />
                        <PasswordInput
                            style={styles.textInput}
                            placeholder={R.strings.forpassword.hint_text_reinput_password}
                            password={true}
                            onChangeText={this.onConfilmPassword}
                            value={this.state.confilmPassword}
                        />
                        <BaseButtonOpacity
                            containerStyle={styles.btnStyle}
                            text={R.strings.forpassword.hint_text_next_steep}
                            onPress={this.onNext}
                        />
                    </View>
                </TabDismissKeybroad>
            </Container>
        );
    }
    onNext = () => {
        const phoneNumber = this.props.navigation.state.params;
        let { password, confirm_password } = this.state;
        if (password.length === 0) {
            showMessage(R.strings.validate.msg_empty_password);
            return;
        }
        if (password.length < 6) {
            showMessage(R.strings.validate.msg_length_password_invalid);
            return;
        }
        if (confirm_password !== password) {
            showMessage(R.strings.validate.msg_password_not_match);
            return;
        }

        forgotPassword(convertPhonenumber(phoneNumber.number), password)
            .then(response => {
                if (response.code === Status.SUSSESS) {
                    database.tokenCache = response.data.token;
                    const newUser = response.data.user;
                    database.user = newUser;
                    this.props.onUpdateUser(newUser);
                    showMessage(R.strings.validate.msg_change_password_success);
                    NavigationService.reset('HomeScreen');
                } else {
                    showErrorMessage(R.strings.validate.msg_cannot_change_password);
                }
            })
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: R.colors.white100,
        alignItems: 'center',
    },
    btnStyle: {
        marginTop: 60
    },
    textInput: {
        marginTop: 50,
        marginBottom: -30
    }
})
const mapDispatchToProps = dispatch => {
    return {
        onUpdateUser: (user) => dispatch(onUpdateUser(user)),
    }
}


export default connect(null, mapDispatchToProps)(CreateNewPassword);