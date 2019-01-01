import React, { Component } from 'react';
import { View, Image, StyleSheet, Text, Dimensions } from 'react-native';
import R from 'res/R';
import { validateImage } from 'libraries/utils/utils';

const { width } = Dimensions.get('window');

export default class ImagePagePerson extends Component {
    render() {
        const { item } = this.props;
        let gender = item.user ? item.user.gender : item.gender;
        let _gender = null;
        switch (gender) {
            case 0:
            _gender =  "Nam";
            break;
            case 1:
            _gender =  "Nữ";
                break;
                case 2:
                _gender =  "Khác";
                break;
            default:
                break;
        }

        let address = item ? ( item.address || item.user.address) : null;

        let source = R.images.ic_image
        if (item.user.avatar) {
            source = {
                uri: validateImage(item.user.avatar)
            }
        }
        return (
            <View style={styles.constainer}>
                <View style={styles.cycleImage}>
                    <Image source={source} style={styles.imageStyle} />
                </View>
                <View style={styles.infoStyle}>
                    <Text style={styles.textStyle}>{R.strings.personPage.text_email} {item ? (item.email || item.user.email) : null}</Text>
                    <Text style={styles.textStyle}>{R.strings.personPage.text_gender} {_gender}</Text>
                    <Text style={styles.textStyle}>{R.strings.personPage.text_telephone} { !item.user ? item.telephone.replace(item.telephone.substring(7, 10), "***") : item.user.telephone.replace(item.user.telephone.substring(7, 10), "***") }</Text>
                    <Text style={styles.textStyle}>{R.strings.personPage.text_address} { item ? address : null }</Text>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    constainer: {
        width: '100%',
        flexDirection: 'row',
    },
    cycleImage: {
        width: 90,
        height: 90,
        borderRadius: 45,
        borderWidth: 1.2,
        borderColor: '#fff',
        marginVertical: 10,
        marginTop: 10,
        marginLeft: 15,
        justifyContent: 'center',
        alignItems: 'center'
    },
    imageStyle: {
        width: 87,
        height: 87,
        borderRadius: 90 / 2
    },
    textStyle: {
        color: R.colors.white100,
        fontSize: 14,
        width: width / 2 + 50
    },
    infoStyle: {
        width: '100%',
        marginLeft: 15,
        justifyContent: 'flex-end',
        paddingBottom: 20
    }

})