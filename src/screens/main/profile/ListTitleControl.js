import React, { Component } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import R from 'res/R';
import NavigationService from 'routers/NavigationService';
import PropTypes from 'prop-types';
import UpgradeAccountModal from '../upgradeaccount/UpgradeAccountModal';
import MenuItem from './MenuItem';

export default class ListTitleControl extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isVisible: false,
        };
    }

    static propTypes = {
        onPress: PropTypes.func,
    }
    render() {
        return (
            <View
                style={{ flex: 1 }}
            >
                {this._render_modal()}
                <FlatList
                    data={this.props.data}
                    showsVerticalScrollIndicator={false}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={this.renderMenuItem}
                />
            </View>
        );
    }

    renderMenuItem = ({ item, index }) => {
        return <MenuItem
            onPress={this.onButtonControl}
            item={item} />
    }
    _render_modal() {
        let roles = [...this.props.role]
        roles.splice(0, 1);
        return (
            <UpgradeAccountModal
                isVisible={this.state.isVisible}
                onClose={() => { this.setState({ isVisible: false }) }}
                onClickItem={
                    (item) => {
                        this.setState({ isVisible: false }),
                            NavigationService.navigate("UpgradeAccountScreen", { key: item.type })
                    }}
                role={roles}
            />
        )
    }
    onButtonControl = (item) => {
        if (item.id === 'upgradeAcount') {
            this.setState({ isVisible: true })
        } else if (item.id === 'introducesFriend') {
            NavigationService.navigate('IntroducesFriends');
        } else if (item.id === 'voucher') {
            NavigationService.navigate('Vouchers');
        }
        else if (item.id === 'listNewsRecruiment') {
            NavigationService.navigate('ListNewsRecruimentScreen');
        }
        else if (item.id === 'saveProfile') {
            NavigationService.navigate('SaveProfileScreen');
        }
        else if (item.id === 'saveJobs') {
            NavigationService.navigate("SavedJobScreen");
        }
        else if (item.id === 'listProfile') {
            NavigationService.navigate("ListProfileScreen");
        }
    }
}