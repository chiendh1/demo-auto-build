import React, { Component } from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';
import R from 'res/R';

export default class SwitchChoose extends Component {
    constructor(props) {
        super(props);
        this.state = {
            switchValue: false,
        };
    }

    render() {
        return (
            <View style={[styles.container, this.props.styleContainer]}>
                <View style={{ width: '50%',justifyContent: 'center', alignItems: 'flex-start' }}>
                    <Text style={[styles.textStyle, this.props.textStyle]}>{this.props.text}</Text>
                </View>
                <View style={{ width: '50%',justifyContent: 'center', alignItems: 'flex-end' }}>
                    <Switch
                        {...this.props}
                        value={this.state.switchValue}
                        onValueChange={(value) => { this.onValueChange(value) }}
                        ios_backgroundColor={R.colors.grey400}
                        thumbColor={R.colors.white100}
                        trackColor={{ true: R.colors.orangeColor, false: null }}
                        style={{ transform: [{ scaleX: .8 }, { scaleY: .8 }] }}
                    />
                </View>
            </View>
        );
    }
    getSwitchValue = () => {
        return this.state.switchValue ? 1 : 0;
    }

    setSwitchValue(value) {
        this.setState({ switchValue: value })
    }

    onValueChange = (value) => {
        this.setState({ switchValue: value });
        if (this.props.onChange) {
            this.props.onChange(value);
        }
    }
}
const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: 65,
        flexDirection: 'row',
        borderBottomWidth: 0.5,
        borderColor: '#CCCCCC',
    },
    textStyle: {
        fontSize: 13,
        color: '#111111',
    }
})