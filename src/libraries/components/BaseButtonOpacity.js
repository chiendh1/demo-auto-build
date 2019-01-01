import React, { PureComponent } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import R from 'res/R';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/FontAwesome5';
import _ from 'lodash';

class BaseButtonOpacity extends PureComponent {

  static propTypes = {
    containerStyle: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.array
    ]),
    text: PropTypes.string.isRequired,
    textStyle: PropTypes.object,
    onPress: PropTypes.func,
    name: PropTypes.string,
    size: PropTypes.number,
    color: PropTypes.string,
  }

  constructor(props) {
    super(props);

    this.onPress = _.debounce(this.onPress, 200);
  }

  render() {
    return (
      <TouchableOpacity
        onPress={this.onPress}
        style={[styles.containerStyle, this.props.containerStyle]}>
        <Icon name={this.props.name} size={this.props.size} color={this.props.color} />
        <Text style={[styles.textStyle, this.props.textStyle]}>{this.props.text}</Text>
      </TouchableOpacity>
    );
  }

  onPress = () => {
    this.props.onPress()
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
  }
}


const styles = StyleSheet.create({
  containerStyle: {
    width: '78%',
    borderRadius: 20,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: R.colors.primaryColor,
    flexDirection: 'row',
    textAlign: 'center'
  },
  textStyle: {
    color: 'white',
    fontSize: 16,
    paddingLeft: 8
  },
})

export default BaseButtonOpacity;
