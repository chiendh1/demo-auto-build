import React, { PureComponent } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import R from 'res/R';

class SearchJob extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        return (
            <View style={styles.container}>
                <TextInput
                    {...this.props}
                    underlineColorAndroid='rgba(0,0,0,0)'
                    placeholderTextColor='#6b879e'
                    style={styles.textInputStyle}
                />

                <Icon
                    name='search'
                    color='white'
                    size={14}
                />
            </View>

        );
    }
}

const styles = StyleSheet.create({
    container: {
        height: 30,
        borderRadius: 15,
        flex: 1,
        marginRight: 10,
        marginLeft: 5,
        marginVertical: 8,
        paddingHorizontal: 10,
        backgroundColor: R.colors.primaryColor,
        flexDirection: 'row',
        alignItems: 'center',
    },

    textInputStyle: {
        color: 'white',
        flex: 1,
        height: 38,
        fontSize: 12,

    }
});

export default SearchJob;
