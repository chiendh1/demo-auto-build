import constants from 'libraries/utils/constants';
import database from 'libraries/utils/database';
import React, { Component } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import Container from 'libraries/components/Container';
import Header from 'libraries/components/Header';
import R from 'res/R';
import BaseInput from 'libraries/components/BaseInput';
import BaseButtonOpacity from 'libraries/components/BaseButtonOpacity';
import NavigationService from 'routers/NavigationService';
import { validatePhone, showAlert } from 'libraries/utils/utils';
import { forgotPassword, checkPhone } from 'libraries/networking/apis';
import { Status, showErrorMessage } from 'libraries/networking/status';
import LoadingButton from 'libraries/components/LoadingButton';
import TabDismissKeybroad from 'libraries/components/TabDismissKeyboard';

export default class FrogotPasswordScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      phone: '',
      password: ''
    };
  }

  onPhoneNumberChanged = (phone) => {
    this.setState({ phone })
  };

  render() {
    return (
      <Container>
        {this.renderTitle()}
        <TabDismissKeybroad>
          <View style={styles.container}>
            <Text style={styles.txtInputNumber}>{R.strings.forpassword.hint_text_input_number}</Text>
            <BaseInput
              style={styles.textInput}
              keyboardType='number-pad'
              maxLength={12}
              autoFocus={true}
              onChangeText={this.onPhoneNumberChanged}
              value={this.state.phone}
            />

            <LoadingButton
              ref={c => (this.loadingButton = c)}
              containerStyle={styles.btnStyle}
              text={R.strings.forpassword.hint_text_send_code}
              onPress={this.onSendCode}
            />
          </View>
        </TabDismissKeybroad>
      </Container>
    );
  }

  renderTitle() {
    const { validatePhoneType } = this.props.navigation.state.params;
    let title = ''
    switch (validatePhoneType) {
      case constants.validatePhoneType.FORGOT_PASSWORD:
        title = R.strings.header.hint_forgot_password;
        break

      case constants.validatePhoneType.UPDATE_PHONE_NUMBER:
      case constants.validatePhoneType.CREATE_NEW_ACCOUNT:
        title = R.strings.header.title_update_phone
        break
    }

    return (<Header
      text={title}
    />)
  }

  onSendCode = () => {
    if (!validatePhone(this.state.phone)) {
      return;
    }
    const changeNumber = this.state.phone;
    let number = changeNumber;

    if (changeNumber.startsWith('0')) {
      number = changeNumber.replace("0", "+84");
    }
    const { validatePhoneType, user, socialLoginType } = this.props.navigation.state.params;

    this.loadingButton.show(true);
 
    checkPhone(this.state.phone).then(data => {
      this.loadingButton.show(false);
      const btn = 'ok';
      if (data.code === Status.SUSSESS || data.code === Status.PHONE_ALREADY_LOGIN_SOCIAL) {
        if (validatePhoneType === constants.validatePhoneType.FORGOT_PASSWORD) {
          NavigationService.navigate('CheckNumberScreen', { socialLoginType, number, validatePhoneType: constants.validatePhoneType.FORGOT_PASSWORD, btn });
        } else {
          if (data.code === Status.SUSSESS) {
            showAlert(R.strings.forpassword.title_show_alert,R.strings.forpassword.phone_number_is_exist)
          } else {
            showAlert( R.strings.forpassword.title_show_alert, R.strings.forpassword.phone_number_already_login_social)
          }
        }

      } else if (data.code === Status.NOT_FOUND) {
        if (validatePhoneType === constants.validatePhoneType.FORGOT_PASSWORD) {
          showAlert(R.strings.forpassword.title_show_alert,R.strings.validate.msg_phone_is_not_exist);
        } else {
          NavigationService.navigate('CheckNumberScreen', { socialLoginType, number, validatePhoneType, user });
        }


      } else {
        showErrorMessage(Status.GENERIC_ERROR);
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
  txtInputNumber: {
    color: R.colors.primaryColor,
    fontSize: 16,
    marginTop: 50
  },
  textInput: {
    borderColor: R.colors.primaryColor,
    borderWidth: 0.8,
    borderRadius: 20,
    marginTop: 20,
    padding: 5,
    paddingLeft: 12,
    paddingRight: 12,
    paddingTop: Platform.OS === 'ios' ? 12 : 5,
    paddingBottom: Platform.OS === 'ios' ? 12 : 5,
  },
  btnStyle: {
    marginTop: 20,
  }
})