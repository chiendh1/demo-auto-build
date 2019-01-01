import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import R from 'res/R';
import PropTypes from 'prop-types';
class ButtonContent extends Component {

  static propTypes = {
    text: PropTypes.string.isRequired,
    onPress: PropTypes.func,
  }

  render() {
    return (
      <TouchableOpacity
        onPress={this.props.onPress}
        style={styles.containerStyle}>
        <Image
          style={styles.imgStyle}
          source={this.props.imgIcon}
          resizeMode="contain"
        />
        <View style={styles.styleText}>
          <Text style={styles.textStyle}>{this.props.text}</Text>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  containerStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 20,
    paddingRight: 20,
  },
  imgStyle: {
    width: 22,
    height: 17,
    marginRight: 12
  },
  styleText: {
    flex: 9,
    paddingTop: 22,
    paddingBottom: 20,
  },
  textStyle: {
    color: R.colors.grey800,
    fontSize: 16,
  }
})

export default ButtonContent;
