import React, { PureComponent } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import R from 'res/R';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/Ionicons';
export default class SelectServiecCompnent extends PureComponent {

    static propTypes = {
        onPress: PropTypes.func,
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity style={styles.btnSelect} onPress={this.props.onPress}>
                        <Text style={styles.leftTextService}>{this.props.textLeft}</Text>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={styles.rightTextService}>{this.props.textRight}</Text>
                            <Icon name="ios-arrow-forward" size={20} color={R.colors.colorPlaceHolder} />
                        </View>

                    </TouchableOpacity>
                </View>
                <Text style={styles.txtContent}>{R.strings.selectService.hint_estimated_price}</Text>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        backgroundColor: R.colors.white100,
        flex: 1
    },
    header: {
        borderBottomColor: R.colors.greyColor,
        borderBottomWidth: 0.8,
        marginLeft: 18,
        marginRight: 18
    },
    leftTextService: {
        fontSize: 16,
        color: R.colors.grey900,
        paddingBottom: 8,
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
        alignItems: 'center',
    },
    txtContent: {
        fontSize: 16,
        marginLeft: 20,
        marginTop: 10
    }
})