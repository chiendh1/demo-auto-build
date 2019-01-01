import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Dimensions } from 'react-native';
import R from 'res/R';

const { width, height } = Dimensions.get('window');

export default class ImageProductForWork extends Component {

    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.labelStyle}>{this.props.text}</Text>
                <TouchableOpacity onPress={this.props.onAddImg}>
                    <View style={styles.imgAdd}>
                        <Image
                            source={R.images.add_imgSV}
                            style={styles.img1}
                        />
                    </View>
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingVertical: 10,
    },
    imgAdd: {
        height: 100,
        width: (width / 2) - 30,
        borderWidth: 0.5,
        borderStyle: 'dashed',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5,
        margin: 4
    },
    img1: {
        width: 40,
        height: 40,
        margin: 3,
    },
})
