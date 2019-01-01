import React, { PureComponent } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import R from 'res/R';
import Icon from 'react-native-vector-icons/FontAwesome5';
import BaseInput from 'libraries/components/BaseInput';

export default class SeacherServiceComponent extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        return (
            <View style={styles.container}>
                <Icon name="search" size={18} color={R.colors.iconSeacher} style={styles.iconSeacher}/>
                <BaseInput
                    style={styles.textInputStyle}
                    placeholder={R.strings.selectService.hint_placeholder_seacher}
                    placeholderTextColor={R.colors.iconSeacher}
                    returnKeyType='go'
                    onChangeText={(text) => this.props.onChangeText(text)}
                />
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        backgroundColor: R.colors.primaryColor,
        height: 35,
        margin: 20,
        borderRadius: 20,
        justifyContent: 'center',
        flexDirection: 'row',
    },
    iconSeacher: {
        marginLeft: 10,
        marginTop: 8,
        flex: 1
    },
    textInputStyle: {
        color: R.colors.white100,
        flex: 9,
        width: null,
        borderBottomColor: null,
        borderBottomWidth: null,
        padding: null,
        marginBottom: null,
        marginLeft: -6,
        marginRight: 5,
        marginBottom: Platform.os === 'ios' ? null : -2,
    }
})