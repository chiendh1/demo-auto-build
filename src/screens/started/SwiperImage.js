import React, { PureComponent } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import PropTypes from 'prop-types';
import R from 'res/R';

const propTypes = {
    text: PropTypes.string,
}
export default class SwiperImage extends PureComponent {

    render() {
        return (
            <View style={styles.swImg}>
                <Image
                    style={{ width: '100%', height: '100%' }}
                    source={this.props.imageSwiper}
                    resizeMode="contain"
                />
                <Text style={styles.textSwiper}>{this.props.text}</Text>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    swImg: {
        width: '100%',
        height: '70%'
    },
    textSwiper: {
        color: 'white',
        textAlign: 'center',
        marginTop: 30,
        fontSize: 18
    }
})

SwiperImage.propTypes = propTypes;