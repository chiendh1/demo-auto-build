import React, { PureComponent } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import R from 'res/R';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/Ionicons';
export default class SelectServiece extends PureComponent {

    static propTypes = {
        onPress: PropTypes.func,
    }

    render() {
        return (
            <View style={styles.container}>
                <TouchableOpacity style={styles.btnSelect} onPress={this.props.onPress}>
                    <Text style={styles.leftTextService}>{this.props.textLeft}</Text>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={styles.rightTextService}>{this.props.textRight}</Text>
                        <Icon name="ios-arrow-forward" size={20} color={R.colors.colorPlaceHolder} />
                    </View>
                </TouchableOpacity>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        backgroundColor: R.colors.white100,
        width:'90%',
        borderBottomWidth: 0.8,
        borderBottomColor: R.colors.greyColor,
        marginVertical: 10,
    },
    leftTextService: {
        fontSize: 16,
        color: R.colors.grey900,
        paddingBottom: 8,
        fontWeight: Platform.OS === 'ios' ? '500' : '300',

    },
    rightTextService: {
        color: R.colors.orangeColor,
        fontSize: 16,
        marginRight: 8,
        paddingBottom: 8,
    },
    btnSelect: {
        flexDirection: 'row',
        marginTop: 10,
        justifyContent: 'space-between',
        marginVertical: 10,
    },
    txtContent: {
        fontSize: 16,
        marginLeft: 20,
        marginTop: Platform.OS === 'ios' ? 8 : 5,
        marginBottom: Platform.OS === 'ios' ? 10 : null,
    }
})