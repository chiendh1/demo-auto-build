import React, { PureComponent } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import PropTypes from 'prop-types';

const propTypes = {
    text: PropTypes.string
}

export default class ImageHorizontal extends PureComponent {

    render() {
        return (
            <View style={{ flexDirection: 'row', marginBottom: 20, marginTop: 10 }}>
                <Image
                    resizeMode="contain"
                    style={{ width: 100, height: 2 }}
                    source={this.props.imageLeft}
                />
                <Text style={styles.textButton}>{this.props.text}</Text>
                <Image
                    resizeMode="contain"
                    style={{ width: 100, height: 2 }}
                    source={this.props.imageRight}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    textButton: {
        color: 'white',
        fontSize: 16,
        marginTop: -10, 
        marginLeft: 10, 
        marginRight: 10,
    },
})

ImageHorizontal.propTypes = propTypes;