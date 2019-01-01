import React, { PureComponent } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import PropTypes from 'prop-types';
import R from 'res/R';
import Icon from 'react-native-vector-icons/Ionicons';
import FastImage from 'react-native-fast-image'


export default class UploadImageCMND extends PureComponent {
    static propTypes = {
        onImgCMND1: PropTypes.func.isRequired,
        onImgCMND2: PropTypes.func.isRequired,
        ondelIMG1: PropTypes.func.isRequired,
        ondelIMG2: PropTypes.func.isRequired,
    }
    render() {
        return (
            <View style={styles.container}>
                <TouchableOpacity onPress={this.props.onImgCMND1} style={styles.btnImgStyle}>
                    {this._render_img_1()}
                </TouchableOpacity>
                <TouchableOpacity onPress={this.props.onImgCMND2} style={styles.btnImgStyle}>
                    {this._render_img_2()}
                </TouchableOpacity>
            </View>
        );
    }
    _render_img_1() {
        if (this.props.source1 !== null) {
            return (
                <View style={styles.content}>
                    <FastImage
                        style={styles.imgCMNDStyle}
                        source={{
                            uri: this.props.source1.uri,
                        }}
                        resizeMode={FastImage.resizeMode.cover}
                    />

                    <View style={styles.viewDelStyle}>
                        <TouchableOpacity style={styles.delIMG} onPress={this.props.ondelIMG1}>
                            <Icon name="ios-close" size={20} color={R.colors.white100} style={styles.iconStyle} />
                        </TouchableOpacity>
                    </View>
                </View>
            )
        } else {
            return (
                <Text style={styles.textStyle}>Ảnh mặt trước</Text>
            )
        }
    }

    _render_img_2() {
        if (this.props.source2 !== null) {
            return (
                <View style={styles.content}>
                    <FastImage
                        style={styles.imgCMNDStyle}
                        source={{
                            uri: this.props.source2.uri,
                        }}
                        resizeMode={FastImage.resizeMode.cover}
                    />
                    <View style={styles.viewDelStyle}>
                        <TouchableOpacity style={styles.delIMG} onPress={this.props.ondelIMG2}>
                            <Icon name="ios-close" size={20} color={R.colors.white100} style={styles.iconStyle} />
                        </TouchableOpacity>
                    </View>
                </View>
            )
        } else {
            return (
                <Text style={styles.textStyle}>Ảnh mặt sau</Text>
            )
        }
    }
}
const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        width: "88%",
        marginTop: 10
    },
    content: {
        flex: 1
    },
    btnImgStyle: {
        borderWidth: 0.5,
        borderColor: R.colors.greyColor,
        margin: 3,
        flex: 1,
        height: 100,
        justifyContent: 'center',
        borderRadius: 5
    },
    viewDelStyle: {
        position: 'absolute',
        top: 2,
        right: 2
    },
    imgCMNDStyle: {
        flex: 1,
        borderRadius: 5,
    },
    delIMG: {
        width: 20,
        height: 20,
        borderRadius: 20 / 2,
        backgroundColor: R.colors.orangeColor,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        top: 0,
        right: 0
    },
    iconStyle: {
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        alignContent: 'flex-end',
    },
    textStyle: {
        textAlign: 'center'
    },
})