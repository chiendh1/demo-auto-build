import React, { PureComponent } from 'react';
import { Text, StyleSheet, Platform } from 'react-native';
import PropTypes from 'prop-types';
import R from 'res/R';

export default class TitleContent extends PureComponent {

    static propTypes = {
        text: PropTypes.string.isRequired,
    }

    render() {
        return (
            <Text style={styles.textStyle}>{this.props.text}</Text>
        );
    }
}
const styles = StyleSheet.create({
    textStyle: {
        fontSize: 16, 
        textAlign:'left',
        marginLeft: "5%",
        marginTop: 10,
        color: R.colors.grey900,
        fontWeight: Platform.OS === 'ios' ? '500' : '300',
    }
})