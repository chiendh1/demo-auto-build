import React, { PureComponent } from 'react';
import { View, FlatList, Image } from 'react-native';
import constants from 'libraries/utils/constants';

export default class ListImageDetail extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        return (
            <FlatList
                style={{ flex: 1 }}
                data={this.props.image}
                keyExtractor={this.keyExtractor}
                renderItem={this.renderItem}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                ListFooterComponent={this.renderFooter}
                onEndReachedThreshold={0.5}
            />
        );
    }

    renderItem = ({ item, index }) => {
        return (
            <View style={{ width: 150, height: 90, borderRadius: 5, marginRight: 10 }}>
                <Image source={{ uri: `${constants.BASE_URL}${item}` }} style={{ width: 150, height: 90, borderRadius: 5 }} />
            </View>
        )
    }

    keyExtractor = (item, index) => index.toString()
}
