import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import BaseInput from 'libraries/components/BaseInput';
import R from 'res/R';
export default class SkillPerson extends Component {

    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.labelStyle}>{R.strings.createBasicProfile.skills_personal}</Text>
                <View style={styles.textAreaContainer} >
                    <BaseInput
                        {...this.props}
                        style={styles.inputAreaStyle}
                        underlineColorAndroid="transparent"
                        placeholder={this.props.placeholder}
                        placeholderTextColor="grey"
                        multiline={true}
                    />
                </View>
                <Text style={styles.attentionStyle}>{R.strings.createBasicProfile.text_attention}</Text>

            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 5,
    },
    labelStyle: {
        fontSize: 16,
        color: '#111111',
        paddingTop: 10
    },
    textAreaContainer: {
        borderColor: '#CCCCCC',
        borderWidth: 0.5,
        minHeight: 100,
        marginTop: 7,
        borderRadius: 3,
      },
      inputAreaStyle: {
        width: '95%',
        fontSize: 13,
        marginHorizontal: 5,
        borderBottomWidth: null,
      },
      attentionStyle:{
        fontSize: 13, 
        color: '#333333', 
        paddingTop: 5, 
        fontStyle: 'italic'
      }
})