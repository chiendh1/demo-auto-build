import React, { PureComponent } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, Image } from 'react-native';
import R from 'res/R';
import PropTypes from 'prop-types';

export default class WageComponent extends PureComponent {
    static propTypes = {
        onPress: PropTypes.func.isRequired,
        wageActive: PropTypes.bool
    }

    _render_ic_Check() {
        if (this.props.wageActive) {
            return (
                <TouchableOpacity style={styles.btnStyle} onPress={this.props.onPress}></TouchableOpacity>
            )
        }else {
            return (
                <TouchableOpacity onPress={this.props.onPress}>
                    <Image
                        source={R.images.ic_select}
                        style={styles.imgStyle}
                        resizeMode='contain'
                    />
                </TouchableOpacity>
            )
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.contentStyle}>
                    <Text style={styles.textTitleWage}>{R.strings.studentJobRecruitment.text_level_wage}</Text>
                    <View style={styles.rightStyle}>
                        {this._render_ic_Check()}
                        <Text style={styles.textWage}>{R.strings.studentJobRecruitment.text_wage_agree}</Text>
                    </View>
                </View>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        width: '90%',
        marginTop: 10,
    },
    contentStyle: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    rightStyle: {
        flexDirection: 'row'
    },
    textTitleWage: {
        fontSize: 16,
        color: R.strings.greyColor,
        fontWeight: Platform.OS === 'ios' ? '500' : '300',
    },
    btnStyle: {
        width: 20,
        height: 20,
        borderColor: R.strings.greyColor,
        borderRadius: 20 / 2,
        borderWidth: 1,
        marginRight: 10,
    },
    textWage: {
        fontSize: 16,
        color: R.strings.greyColor,
    },
    imgStyle: {
        width: 20,
        height: 20,
        marginRight: 10,
    }
})