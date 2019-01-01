import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import R from 'res/R';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/Ionicons';

export default class ListNewsTask extends Component {

    static propTypes = {
        textTitle: PropTypes.string.isRequired,
        textDate: PropTypes.string.isRequired,
    }

    _render_missing_Profile() {
        const { item } = this.props;
        if (item.type === 1 || item.type === 2) {
            if (item.type === 1) {
                if (!item.skill || !item.current_salary) {
                    return (
                        <TouchableOpacity>
                            <View style={styles.viewDot}>
                                <View style={styles.dot}></View>
                            </View>
                        </TouchableOpacity>
                    )
                } else {
                    return null;
                }
            }
            if (!item.skill || !item.address_current || !item.image_drawing || !item.image_forte || !item.image_product || !item.current_salary) {
                return (
                    <TouchableOpacity>
                        <View style={styles.viewDot}>
                            <View style={styles.dot}></View>
                        </View>
                    </TouchableOpacity>
                )
            } else {
                return null;
            }
        }
    }
    _render_more() {
        if (this.props.pupopMenu === true) {
            return (
                <View style={{ flexDirection: 'row' }}>
                    <TouchableOpacity
                        style={styles.iconStyle}
                        onPress={this.props.onMore}>
                        <Icon
                            name='ios-more'
                            size={20}
                        />
                    </TouchableOpacity>

                </View>
            )
        } else {
            return (
                <TouchableOpacity
                    onPress={this.props.onClose}
                    style={styles.iconStyle}
                >
                    <Image
                        source={R.images.ic_trash}
                        resizeMode='contain'
                        style={styles.imgLeftStyle}
                    />
                </TouchableOpacity>
            )
        }
    }


    render() {
        return (
            <TouchableOpacity style={styles.container} onPress={this.props.onClick}>
                <View style={styles.rightStyle}>
                    <Text style={styles.textTitle}>{this.props.textTitle}</Text>
                    <Text style={styles.textDate}>{R.strings.infoRecruiment.text_deadline}{this.props.textDate}</Text>
                </View>
                <View style={styles.leftStyle}>
                    {this._render_missing_Profile()}
                    {this._render_more()}
                </View>
            </TouchableOpacity>
        );
    }
}


const styles = StyleSheet.create({
    container: {
        backgroundColor: R.colors.white100,
        marginHorizontal: 5,
        marginVertical: 5,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    rightStyle: {
        flexDirection: 'column',
        marginLeft: 10,
        marginVertical: 10,
        flex: 9,
    },
    textTitle: {
        color: R.colors.grey800,
        fontSize: 16,
    },
    textDate: {
        color: R.colors.grey500,
        fontSize: 15,
        marginTop: 5,
    },
    leftStyle: {
        width: 80,
        height: 60,
        flexDirection: 'row'
    },
    imgLeftStyle: {
        width: 18,
        height: 18,
    },
    iconStyle: {
        width: 80,
        height: 30,
        alignItems: 'flex-end',
        paddingRight: 10,
        paddingTop: 10,
    },
    viewDot: {
        width: 80,
        height: 25,
        alignItems: 'flex-end',
        paddingRight: 12
    },
    dot: {
        width: 10,
        height: 10,
        borderRadius: 10 / 2,

        height: 60,
        alignItems: 'flex-end',
        paddingRight: 10,
        paddingTop: 10
    },
})
