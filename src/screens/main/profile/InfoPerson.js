import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import R from 'res/R';
import NavigationService from 'routers/NavigationService';

export default class InfoPerson extends Component {

    render() {
        return (
            <View style={styles.info}>
                <View style={styles.wrapper}>
                    <Text style={styles.textName}>{this.props.user.name}</Text>
                    <TouchableOpacity
                        onPress={this.onEditProfile}
                    >
                        <Icon name="ios-create" size={22} color={R.colors.white100} style={styles.iconStyle} />
                    </TouchableOpacity>
                </View>
                <Text style={styles.textRole}>
                    ({this.props.role
                        && this.props.role.length > 0
                        && this.props.user.loaitk > 0
                        && this.props.role[this.props.user.loaitk - 1].name})
                    </Text>
                <View style={styles.wrapperStar}>
                    <View style={styles.textStar}>
                        {this._renderStar()}
                    </View>
                    <TouchableOpacity
                        onPress={this.DetailStar}
                    >
                        <View style={{ flexDirection: 'row' }}>
                            {this.props.user.rate === 0 ? <Text style={styles.textDetail}>{R.strings.detailStar.text_detail_star}</Text> : null}
                            <Icon name="ios-information-circle" size={22} color={R.colors.orangeColor} />
                        </View>
                    </TouchableOpacity>
                </View>

            </View>
        );
    }
    _renderStar() {
        let stars = [];
        if (this.props.user.rate !== 0) {
            for (var i = 1; i <= 5; i++) {
                let name = 'ios-star';

                if (i > this.props.user.rate) {
                    name = null
                }
                stars.push((<Icon name={name} size={20} color={R.colors.orangeColor} key={i} />));
            }
        }
        return stars;
    }
    onEditProfile() {
        NavigationService.navigate('EditProfileScreen', {});
    }
    DetailStar() {
        NavigationService.navigate('DetailStarScreen', {});
    }
}

const styles = StyleSheet.create({
    info: {
        flex: 3,
        flexDirection: 'column',
        justifyContent: 'flex-end',
        paddingBottom: 10,
        paddingLeft: 40
    },
    wrapper: {
        flexDirection: 'row'
    },
    textName: {
        fontSize: 18,
        color: R.colors.white100
    },
    iconStyle: {
        paddingLeft: 7,
    },
    textRole: {
        color: R.colors.white100
    },
    wrapperStar: {
        flexDirection: 'row',
        paddingTop: 3
    },
    textStar: {
        flexDirection: 'row',
        paddingRight: 5
    },
    textDetail: {
        fontSize: 12,
        color: R.colors.white100,
        paddingRight: 5,
        paddingTop: 2
    }
})