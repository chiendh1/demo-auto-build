 import React, { PureComponent } from 'react';
import { View, Text } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import R from 'res/R';

export default class LoadingPage extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <Spinner 
          visible={this.props.visible}
          textContent={R.strings.loadingPage.msg_loading_page}
          textStyle={{color: R.colors.white100}}
          cancelable
      />
    );
  }
}
