import React, { Component } from 'react';
import { View } from 'react-native';
import R from 'res/R';
export default class CustomMarkerSlider extends Component {
    render() {
        return (
            <View style={{
                height: 16,
                width: 16,
                borderRadius: 16 / 2,
                backgroundColor: R.colors.orangeColor
            }}>
            </View>
        );
    }
}