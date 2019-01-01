import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, Dimensions } from 'react-native';
import Container from 'libraries/components/Container';
import Header from 'libraries/components/Header';
import R from 'res/R';
import Moment from 'moment';

import FastImage from 'react-native-fast-image'
const { width, height } = Dimensions.get('window');

export default class DetailVoucher extends Component {
    render() {
        let data = this.props.navigation.state.params.item;

        let timeStamp = Math.floor(new Date(data.date_end.replace(" ", "T")).getTime() / 1000)
        const curTime = Math.floor(Date.now() / 1000);
        let date_start = Moment(data.date_start).format('DD-MM-YYYY');
        let date_end = Moment(data.date_end).format('DD-MM-YYYY');

        return (
            <Container style={styles.container}>
                <Header
                    text={R.strings.voucher.text_header_info_voucher}
                />
                <View style={styles.wrapperFlatlist}>
                    <View style={styles.viewImage}>
                        <FastImage
                            style={styles.imageStyle}
                            source={{
                                uri: data.image
                            }}
                            resizeMode={FastImage.resizeMode.cover}
                        />
                        {curTime - timeStamp > 0 ? <Image source={R.images.ic_expired} style={{ width: 50, height: 50, position: 'absolute', right: 0 }} /> : null}
                    </View>
                    <View style={styles.viewContent}>
                        <Image source={{ uri: data.icon }} style={styles.iconStyle} />
                        <Text style={styles.textCondition}>{data.conditions}</Text>
                    </View>
                    <View style={styles.viewDescrip}>
                        <Text>{R.strings.voucher.text_date} {date_start.substring(0, 11)} - {date_end.substring(0, 11)}</Text>
                        <Text style={styles.textDescription}>{data.description}</Text>
                    </View>
                </View>
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    wrapperFlatlist: {
        marginHorizontal: 15,
        alignItems: 'center',
        marginBottom: 15,
        marginTop: 15,
    },
    viewImage: {
        width: width - 30,
        height: height / 7,
        borderWidth: 0.5,
        borderColor: R.colors.white100,
        borderRadius: 3
    },
    imageStyle: {
        width: width - 30,
        height: height / 7,
        borderRadius: 3
    },
    viewContent: {
        alignItems: 'center',
        marginTop: 7,
        paddingBottom: 10,
        borderBottomWidth: 0.5,
        borderColor: R.colors.grey500
    },
    iconStyle: {
        width: 80,
        height: 80
    },
    textCondition: {
        textAlign: 'center',
        fontSize: 17,
        color: R.colors.orangeColor,
        marginHorizontal: 15
    },
    viewDescrip: {
        alignItems: 'center',
        paddingVertical: 15
    },
    textDescription: {
        marginTop: 20,
        fontSize: 15
    }
})