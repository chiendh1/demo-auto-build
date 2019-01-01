import React, { PureComponent } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import R from 'res/R';
import NavigationService from 'routers/NavigationService';

export default class ViewContact extends PureComponent {

    render() {
        const { user } = this.props;
        return (
            <View style={styles.wrapper}>
                <View style={styles.horizontalStyle}>
                    <Image source={R.images.ic_money} style={styles.sizeImage} resizeMode="contain" />
                    <Text style={styles.pointStyle}>{user.point}</Text>
                    <Text style={styles.contentPoint}>{R.strings.conctact.text_point}</Text>
                </View>
                <TouchableOpacity style={styles.horizontalStyle} onPress={this.onStar}>
                    <Image source={R.images.ic_star} style={styles.sizeImage} resizeMode="contain" />
                    <Text style={styles.pointStyle}>{user.count_comment ? user.count_comment : 0}</Text>
                    <Text style={styles.contentPoint}>{R.strings.conctact.text_rating}</Text>
                </TouchableOpacity>
            </View>
        );
    }
    onStar = () => {
        const { user } = this.props;
        NavigationService.navigate("MyFeedBackScreen", { user })
    }
}


const styles = StyleSheet.create({
    wrapper: {
        height: 'auto',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 8,
        borderBottomWidth: 0.5,
        marginHorizontal: 15,
        borderColor: R.colors.grey400
    },
    horizontalStyle: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    pointStyle: {
        fontSize: 12,
    },
    contentPoint: {
        fontSize: 12,
        paddingLeft: 3,
    },
    sizeImage: {
        width: 28,
        height: 28,
    }
})
