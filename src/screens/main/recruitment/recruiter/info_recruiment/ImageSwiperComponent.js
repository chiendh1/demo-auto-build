import React, { PureComponent } from 'react';
import { View, Text, StyleSheet, Image, Dimensions, Platform, TouchableOpacity, Linking } from 'react-native';
import Swiper from 'react-native-swiper';
import R from 'res/R';
const { width, height } = Dimensions.get('window');
import FastImage from 'react-native-fast-image';
import { validateImage } from 'libraries/utils/utils';

export default class ImageSwiperComponent extends PureComponent {

    render() {
        const { item } = this.props;
        if (item.images && item.images.length > 0) {
            return (
                <View style={styles.container}>
                    <Swiper
                        autoplay
                        autoplayTimeout={3}
                        showsPagination={item.images.length > 0}
                        height={height / 2}
                        width={Platform.OS === 'android' ? width : null}
                        showsButtons={false}
                    >
                        {this._renderListSwiper()}
                    </Swiper>
                </View>
            );
        }
        return null;
    }
    _renderListSwiper() {
        const { item } = this.props;
        let list = item.images.map((url, index) => <FastImage
            key={index}
            style={styles.imgStyle}
            source={{
                uri: validateImage(url)
            }}
            resizeMode={FastImage.resizeMode.cover}
        />)

        if (item.videos) {
            const video = <TouchableOpacity key='videos' onPress={this.onShowVideo}>
                <Image
                    source={R.images.ic_show_video}
                    resizeMode='contain'
                    style={styles.imgStyle}
                />
            </TouchableOpacity>
            list = [...list, video];
        }
        return list;
    }
    onShowVideo = () => {
        const { item } = this.props;
        Linking.openURL(`${validateImage(item.videos)}`)
    }
}
const styles = StyleSheet.create({
    container: {
        width: '100%',
        alignItems: 'center',
        height: 220,
        marginVertical: 10,
    },
    imgStyle: {
        width: '100%',
        height: 220,
    }
})