import React, { PureComponent } from 'react';
import { View, Text, Image, Dimensions } from 'react-native';
import R from 'res/R';

class Logo extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        return (
            <View style={[{ alignItems: 'center', marginTop: 70 }, this.props.style]}>
                <Image
                    style={{ width: "70%", height: 50 }}
                    resizeMode="contain"
                    source={R.images.logo}
                />
            </View>
        );
    }
}

export default Logo;
