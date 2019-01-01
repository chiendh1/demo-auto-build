import React, { PureComponent } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import R from 'res/R';

const { width } = Dimensions.get('window');

export default class PlaceLocation extends PureComponent {

    render() {
        return (
            <View style={[{flex: 1}, this.props.style]}>
                <Text style={[styles.labelStyle, this.props.labelStyle]}>{this.props.text}</Text>
                <TouchableOpacity
                    onPress={this.props.onLocationPressed}
                >
                    <View style={styles.viewButton}>
                        <Text style={styles.labelCareerStyle}>{this.props.place}</Text>
                        <Icon name="map-marker-alt" size={20} style={styles.iconStyle} />
                    </View>
                </TouchableOpacity>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    labelStyle: {
        fontSize: 16,
        color: '#111111',
        marginTop: 8,
       
    },
    labelCareerStyle: {
        fontSize: 14,
        paddingVertical: 6,
        width: width - 60,

    },
    viewButton: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderBottomColor: '#CCCCCC',
        borderBottomWidth: 0.5,
    },
    iconStyle: {
        color: R.colors.orangeColor,
    },
})

