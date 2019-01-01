import React, { PureComponent } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import R from 'res/R';
import PropTypes from 'prop-types';

export default class TitleContent extends PureComponent {

    static propTypes = {
        text: PropTypes.string.isRequired,
    }

    render() {
        return (
            <View style={[styles.viewStyle, this.props.textStyle]}>
                <Text style={styles.textStyle}>{this.props.text}</Text>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    viewStyle: {
        width: '100%',
        marginLeft: '10%',
        marginTop: 10,
        marginBottom: 5,
    },
    textStyle: {
        color: R.colors.grey900,
        fontSize: 16,
        fontWeight: Platform.OS === 'ios' ? '500' : '300',
    }
})