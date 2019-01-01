import React, { PureComponent } from 'react';
import {  View, Text, StyleSheet } from 'react-native';
import R from 'res/R';

export default class TextDescriptionComponent extends PureComponent {

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.headerStyle}>{R.strings.infoRecruiment.text_job_description}</Text>
        <Text style={styles.contentStyle}>{this.props.textDes}</Text>
      </View>
    );
  }
}
const styles = StyleSheet.create({
    container: {
        marginVertical: 15
    },
    headerStyle: {
        fontSize: 16,
        fontWeight: '500',
        color: R.colors.grey900,
    },
    contentStyle: {
        marginTop: 8,
        fontSize: 16,
        color: R.colors.grey800
    }
})