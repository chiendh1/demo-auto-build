import React, { PureComponent } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import R from 'res/R';
import Icon from 'react-native-vector-icons/Ionicons';

export default class HeaderNotification extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    static defaultProps = {
        text: 'Thông báo'
    }

    render() {
        return (
            <View style={styles.headerStyle}>
                <TouchableOpacity onPress={this.props.onPress} style={styles.btnIcon}>
                    <Icon name="ios-close" size={35} color={R.colors.white100} />
                </TouchableOpacity>
                <Text style={styles.txtHeader}>{this.props.text}</Text>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    headerStyle: {
        backgroundColor: R.colors.orangeColor,
        width: '100%',
        flexDirection: 'row',
        borderTopRightRadius: 5,
        borderTopLeftRadius: 5,
        alignItems: 'center'
    },
    btnIcon: {
        marginLeft: 5,
        paddingHorizontal: 5,
    },
    txtHeader: {
        flex: 1,
        fontSize: 16,
        textAlign: 'center',
        color: R.colors.white100,
    },
})