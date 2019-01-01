import React, { PureComponent } from 'react';
import { View, Text, SafeAreaView, StyleSheet, StatusBar } from 'react-native';
import R from 'res/R';

class Container extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        return (
            <SafeAreaView style={[styles.container, this.props.style]}>
                <StatusBar
                    backgroundColor={R.colors.primaryColor}
                    barStyle="light-content"
                />
                <View style={[{ backgroundColor: 'white', flex: 1 }, this.props.containerStyle]}>
                    {this.props.children}
                </View>

            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: R.colors.primaryColor
    }
})

export default Container;
