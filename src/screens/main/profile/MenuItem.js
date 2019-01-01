import React, { PureComponent } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import R from 'res/R';

import Icon from 'react-native-vector-icons/Ionicons';

class MenuItem extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        const { item } = this.props;

        return (
            <View style={styles.containerStyle}>
                <TouchableOpacity
                    style={styles.container}
                    onPress={() => this.props.onPress(item)}
                >
                    <Image source={item.icon} style={{ width: 30, height: 30 }} resizeMode="contain" />

                    <View style={styles.TitleStyle}>
                        <Text style={{ flex: 1 }}>{item.title}</Text>
                        <Icon name="ios-arrow-forward" size={18} color={R.colors.grey800} />
                    </View>
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingVertical: 8,
        flexDirection: 'row',
        alignItems: 'center',
    },

    containerStyle: {

        marginHorizontal: 15,
        borderBottomWidth: 0.5,

        borderColor: R.colors.grey400
    },
    TitleStyle: {
        flex: 1,
        paddingLeft: 5,
        flexDirection: 'row',
        alignItems: 'center'
    }
})

export default MenuItem;
