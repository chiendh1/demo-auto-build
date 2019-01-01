import React, { PureComponent } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import R from 'res/R';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Moment from 'moment';

export default class ListProfile extends PureComponent {

    keyExtractor = (item, index) => index.toString();
    renderItem = ({ item }) => {
        let updated_at = item ? Moment(item.updated_at).format('DD-MM-YYYY') : null;
        return (
            <TouchableOpacity
                style={{ flex: 1 }}
                onPress={this.props.onDetailProfilePressed(item)}
            >
                <View style={styles.wrapper}>
                    <Icon name="circle" size={8} style={{ paddingTop: 14 }} />
                    <Text style={styles.textStyle}>{item.position || item.vacancies}</Text>
                </View>
                <Text style={styles.timeStyle}>{R.strings.personPage.text_update_at} {updated_at}</Text>
            </TouchableOpacity>
        )
    }

    render() {
        const { listProfile } = this.props;
        return (
            <FlatList
                data={listProfile}
                keyExtractor={this.keyExtractor}
                renderItem={this.renderItem}
                showsVerticalScrollIndicator={false}
                onRefresh={this.props.onRefresh}
                refreshing={this.props.loading}
            />
        );
    }
}

const styles = StyleSheet.create({
    wrapper: {
        width: '100%', 
        flexDirection: 'row', 
        borderTopWidth: 0.5, 
        marginLeft: 15, 
        marginTop: 8, 
        borderColor: '#CCCCCC'
    },
    textStyle: {
        paddingTop: 8, 
        paddingLeft: 10, 
        width: '95%'
    },
    timeStyle: {
        paddingTop: 5, 
        paddingLeft: 32, 
        fontSize: 12, 
        color: '#999999'
    }
})