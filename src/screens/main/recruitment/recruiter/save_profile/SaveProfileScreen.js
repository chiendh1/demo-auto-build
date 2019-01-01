import React, { Component } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native'
import Container from 'libraries/components/Container';
import Header from 'libraries/components/Header';
import NavigationService from 'routers/NavigationService';
import Icon from 'react-native-vector-icons/Ionicons';
import R from 'res/R';
import { getProfileSave, deleteSaveProfile } from 'libraries/networking/apis';
import database from 'libraries/utils/database';
import { Status } from 'libraries/networking/status';
import Moment from 'moment';
import { reloadSaves } from '../../../../../redux/actions';
import { connect } from 'react-redux';
import StarRating from 'react-native-star-rating';
import constants from 'libraries/utils/constants';

class SaveProfileScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listSaveProfile: [],
            loading: true,
        };
    }
 
    componentWillMount() {
        this.onSaveProfile();
    }

    onSaveProfile = () => {
        getProfileSave(database.user.id_users, database.tokenCache).then(response => {
            if (response.code === Status.SUSSESS) {
                const data = response.data;
                if (data && data.profile_saved) {
                    this.setState({ listSaveProfile: data.profile_saved, loading: false })
                }
            }
        }).catch(error => {
            this.setState({ loading: false })
            return error;
        })
    }

    onDeleteProfile = (item, index) => () => {
        deleteSaveProfile(item.id, database.tokenCache).then(response => {
            if (response.code === Status.SUSSESS) {
                let listSaveProfile = this.state.listSaveProfile;
                listSaveProfile.splice(index, 1);
                this.setState({ listSaveProfile })
            }

        }).catch(error => {
            return error;
        })
    }

    keyExtractor = (item, index) => index.toString();

    _renderItem = ({ item, index }) => {
        let updated_at = item.profile ? Moment(item.profile.updated_at).format('DD-MM-YYYY') : null;
        return (
            <TouchableOpacity
                onPress={this.onDetailProfile(item)}
            >
                <View style={styles.viewFlatlist} key={index}>
                    <View style={styles.updateStyle}>
                        <Text style={styles.textTitle}>{item.profile ? item.profile.position : ""}</Text>
                        <Text style={styles.nameStyle}>{item.profile.user.name}</Text>
                        <StarRating
                            disabled={true}
                            maxStars={5}
                            rating={item.profile.user ? item.profile.user.rate_feedback : null}
                            starSize={12}
                            containerStyle={{ width: 70, marginTop: 2 }}
                            fullStarColor={R.colors.secondaryColor}
                        />
                    </View>
                    <View style={styles.viewIcon}>
                        <TouchableOpacity
                            style={styles.iconStyle}
                            onPress={this.onDeleteProfile(item, index)}
                        >
                            <Icon name='ios-close' size={30} style={{width: 50}}/>
                        </TouchableOpacity>
                        <Text style={styles.textDate}>{R.strings.saveProfile.text_update_at} {updated_at}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }

    _renderFlatlist = () => {
        if (!this.state.loading) {
            if (this.state.listSaveProfile.length !== 0) {
                return <FlatList
                    data={this.state.listSaveProfile}
                    keyExtractor={this.keyExtractor}
                    renderItem={this._renderItem}
                    style={{ width: '100%' }}
                    onRefresh={this.onRefresh}
                    refreshing={this.state.loading}
                    extraData={this.state}
                />
            } else {
                return (
                    <View style={styles.notProfile}>
                        <Text>{R.strings.saveProfile.text_not_profile}</Text>
                    </View>
                )
            }
        }
        return null;
    }

    render() {
        return (
            <Container containerStyle={styles.containerStyle}>
                <Header
                    text={R.strings.saveJob.text_header_save_profile}
                    onLeftPressed={this.onLeftPressed}
                />
                {this._renderFlatlist()}
            </Container>
        );
    }

    onLeftPressed = () => {
        this.props.reloadSaves(constants.reloadList.SAVE_PROFILE);
        NavigationService.pop();
    }

    onRefresh = () => {
        this.setState({ loading: true });
        this.onSaveProfile();
    }
    onDetailProfile = (item) => () => {
        NavigationService.navigate('DetailProfile', { item : item.profile, onRefreshLocalList: this.onRefreshLocalList });
    }

    onRefreshLocalList = (item) => {
        if (item) {
            this.onSaveProfile();
        }
    }
}

const styles = StyleSheet.create({
    containerStyle: {
        backgroundColor: R.colors.grey100,
        alignItems: 'center',
        paddingBottom: 10
    },
    viewFlatlist: {
        flexDirection: 'row',
        backgroundColor: R.colors.white100,
        marginTop: 10,

        justifyContent: 'space-between'
    },
    updateStyle: {
        paddingTop: 10,
        paddingLeft: 10,
        paddingBottom: 15
    },
    iconStyle: {
        width: 50,
        paddingTop: 10,
        paddingLeft: 27,
    },

    textTitle: {
        color: R.colors.primaryColor,
        fontSize: 18,
    },
    textDate: {
        color: R.colors.grey500,
        fontSize: 13,
        marginTop: 5,
        paddingRight: 10,
    },
    notProfile: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    nameStyle: {
        fontSize: 16, 
        color: '#333333', 
        paddingTop: 6
    },
    viewIcon: {
        flexDirection: 'column', 
        alignItems: 'flex-end'
    }
})

const mapDispatchToProps = dispatch => {
    return {
        reloadSaves: (text) => dispatch(reloadSaves(text))
    }
};

export default connect(null, mapDispatchToProps)(SaveProfileScreen);