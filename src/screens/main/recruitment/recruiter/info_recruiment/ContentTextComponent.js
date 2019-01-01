import React, { PureComponent } from 'react';
import { View, Text, StyleSheet, Dimensions, Platform } from 'react-native';
import R from 'res/R';
import NumberFormat from 'react-number-format';
const { width } = Dimensions.get('window');

export default class ContentTextComponent extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    _render_wage() {
        if (this.props.wage_min && this.props.wage_min !== "0") {
            return (
                <Text style={styles.textStyle}>{R.strings.infoRecruiment.text_level_wage}
                    <NumberFormat
                        value={this.props.wage_min}
                        displayType={'text'}
                        thousandSeparator="." decimalSeparator=","
                        renderText={
                            value => <Text style={styles.textContent}>{value}đ - </Text>
                        }
                    />
                    <NumberFormat
                        value={this.props.wage_max}
                        displayType={'text'}
                        thousandSeparator="." decimalSeparator=","
                        renderText={
                            value => <Text style={styles.textContent}>{value}đ</Text>
                        }
                    />
                </Text>
            )
        } else {
            return (
                <Text style={styles.textStyle}>{R.strings.infoRecruiment.text_level_wage}
                    <Text style={styles.textContent}>{R.strings.recruiterList.text_wage_agree_}</Text>
                </Text>
            )
        }
    }

    _render_reg_me_tho() {
        if (this.props.activeArtisan === true) {
            return (
                <View style={styles.viewStyle}>
                    <View style={styles.iconRound}></View>
                    <Text style={styles.textStyle}>{R.strings.infoRecruiment.text_regime}<Text style={styles.textContent}> {this.props.txtRegime}</Text></Text>
                </View>
            )
        }
    }

    _render_level_rercuiment() {
        if (this.props.activeArtisan === true) {
            <View style={styles.viewStyle}>
                <View style={styles.iconRound}></View>
                <Text style={styles.textStyle}>{R.strings.infoRecruiment.text_level_recuriment}<Text style={styles.textContent}> {this.props.txtLevelRecru}</Text></Text>
            </View>
        }
    }

    _render_probationary_period() {
        if (this.props.activeArtisan === true) {
            return (
                <View style={styles.viewStyle}>
                    <View style={styles.iconRound}></View>
                    <Text style={styles.textStyle}>{R.strings.infoRecruiment.text_probationary_period}<Text style={styles.textContent}> {this.props.txtProPer} {R.strings.infoRecruiment.text_month}</Text></Text>
                </View>
            )
        }
    }

    _render_time_work() {
        if (this.props.activeArtisan === false) {
            return (
                <View style={styles.viewStyle}>
                    <View style={styles.iconRound}></View>
                    <Text style={styles.textStyle}>{R.strings.infoRecruiment.text_time_work}<Text style={styles.textContent}> {this.props.txtTimeWork}</Text></Text>
                </View>
            )
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.viewStyle}>
                    <View style={styles.iconRound}></View>
                    {this._render_wage()}
                </View>
                <View style={styles.viewStyle}>
                    <View style={styles.iconRound}></View>
                    <Text style={styles.textStyle}>{R.strings.infoRecruiment.text_exp}<Text style={styles.textContent}> {this.props.txtExp}</Text></Text>
                </View>
                {this._render_probationary_period()}
                {this._render_time_work()}
                <View style={styles.viewStyle}>
                    <View style={styles.iconRound}></View>
                    <Text style={styles.textStyle}>{R.strings.infoRecruiment.text_number_of_recruitment}<Text style={styles.textContent}> {this.props.txtNumberRecru}</Text></Text>
                </View>
                {this._render_level_rercuiment()}
                <View style={styles.viewStyle}>
                    <View style={styles.iconRound}></View>
                    <Text style={styles.textStyle} numberOfLines={2}>{R.strings.infoRecruiment.text_address_work}<Text style={styles.textContent}> {this.props.txtAddress}</Text></Text>
                </View>
                {this._render_reg_me_tho()}
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        width: '100%',
        borderWidth: 0.8,
        borderColor: R.colors.greyColor,
        borderRadius: 6,
        borderStyle: 'dashed',
        marginTop: 10,
        paddingBottom: 10,
    },
    viewStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 10,
        marginTop: 10,
    },
    textStyle: {
        fontSize: 14,
        color: R.colors.grey800
    },
    iconRound: {
        width: 8,
        height: 8,
        borderRadius: 8 / 2,
        backgroundColor: R.colors.greyColor,
        marginRight: 10,
    },
    textContent: {
        color: R.colors.grey900,
        fontWeight: Platform.OS === 'ios' ? '500' : '400',
        fontSize: 14,
        flex: 1,
    }
})