import React, { PureComponent } from 'react';
import { View, ActivityIndicator } from 'react-native';
import R from 'res/R';

export default class BottomLoadingIndicator extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        return (
            <View style={{ paddingVertical: 2, backgroundColor: R.colors.grey300, alignItems: 'center' }}>
                <ActivityIndicator size="small" color="#FFF" />
            </View>
        );
    }
}
