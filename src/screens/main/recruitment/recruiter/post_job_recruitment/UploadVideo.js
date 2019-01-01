import React, { PureComponent } from 'react';
import { View, StyleSheet, TouchableOpacity, Image, Linking } from 'react-native';
import R from 'res/R';
import Icon from 'react-native-vector-icons/Ionicons';

export default class UploadVideo extends PureComponent {
    render() {
        return (
            <View style={styles.container}>
                <TouchableOpacity style={styles.btnStyle} onPress={this.props.onPress}>
                    {this._render_video()}
                </TouchableOpacity>
            </View>
        );
    }
    onShowVideo = () => {
        const { url } = this.props;
        Linking.openURL(url);
    }
    _render_video() {
        const { url } = this.props;
        if (url && url.length > 0) {
            return (
                <View style={styles.viewVideo}>
                    <TouchableOpacity onPress={this.onShowVideo} style={styles.viewVideo}>
                        <Image
                            source={R.images.ic_upload_video}
                            style={{ flex: 1, borderRadius: 5, width: '100%' }}
                            resizeMode='cover'
                        />
                    </TouchableOpacity>
                    <View style={{ position: 'absolute', top: 2, right: 2 }}>
                        <TouchableOpacity style={styles.delIMG} onPress={this.props.onDeleteVideo} >
                            <Icon name="ios-close" size={20} color={R.colors.white100} />
                        </TouchableOpacity>
                    </View>
                </View>
            )
        } else {
            return (
                <Image
                    source={R.images.ic_video}
                    style={styles.imgStyle}
                    resizeMode='contain'
                />
            )
        }
    }
}
const styles = StyleSheet.create({
    container: {
        width: '90%',
        paddingLeft: 2,
    },
    btnStyle: {
        flex: 1,
        width: '48%',
        height: 100,
        borderWidth: 0.6,
        borderColor: R.colors.grey800,
        borderRadius: 5,
        borderStyle: 'dashed',
        alignItems: 'center',
        justifyContent: 'center',
    },
    viewVideo: {
        flex: 1,
        height: 100,
        width: '100%'
    },
    delIMG: {
        width: 20,
        height: 20,
        borderRadius: 20 / 2,
        backgroundColor: R.colors.orangeColor,
        position: 'absolute',
        top: 0,
        right: 0,
        alignItems: 'center',
        justifyContent: 'center'
    },
    imgStyle: {
        width: 40,
        height: 40
    },
})