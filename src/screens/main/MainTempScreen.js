import React, { Component } from 'react';
import { View, Text } from 'react-native';
import BaseButtonOpacity from 'libraries/components/BaseButtonOpacity';
import NavigationService from 'routers/NavigationService';

class MainTempScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <View style={{flex: 1, alignItems: "center", justifyContent: 'center', padding: 30}}>
        <Text style={{marginBottom: 30}}>Chúc mừng bạn đã đăng nhập thành công!</Text>

        <BaseButtonOpacity
            text='Logout'
            onPress={()=> NavigationService.reset("GetStartedScreen")}
        />
      </View>
    );
  }
}

export default MainTempScreen;
