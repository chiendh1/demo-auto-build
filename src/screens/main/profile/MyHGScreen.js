import React, { Component } from 'react';
import { View, StyleSheet, Image, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import R from 'res/R';
import OneSignal from 'react-native-onesignal';

import BaseButtonOpacity from 'libraries/components/BaseButtonOpacity';
import NavigationService from 'routers/NavigationService';
import database, { KEY_USER_TOKEN, KEY_GET_STARTED_PRESSED, KEY_USER, KEY_NOTIFICATION } from 'libraries/utils/database';
import Container from 'libraries/components/Container';
import { onUpdateUser, reloadSaves } from '../../../redux/actions'

import ImagePerson from './ImagePerson';
import ViewContact from './ViewContact';
import ListTitleControl from './ListTitleControl';
import InfoPerson from './InfoPerson';
import SignInRequireScreen from 'screens/login/SignInRequireScreen';
import { getRoleUser } from 'libraries/networking/apis';
import { connect } from 'react-redux';
import menus from './menu';
import constants from 'libraries/utils/constants';

class MyHGScreen extends Component {

    static navigationOptions = {
        tabBarLabel: 'HG của tôi',
        tabBarIcon: ({ tintColor }) => (
            <Icon
                name='user-circle'
                size={26}
                color={tintColor}
            />
        )
    }

    constructor(props) {
        super(props);
        this.state = {
            role: [],
            data: menus.menuGuest,
        };
    }


    componentDidMount() {

        if (database.tokenCache) {
            this.getRoleUser();
        }

        if (database.user) {
            if (
                database.user.loaitk === constants.upgradeAcc.KTS
                || database.user.loaitk === constants.upgradeAcc.NBS
                || database.user.loaitk === constants.upgradeAcc.NX) {
                this.setState({ data: menus.menuRecruiter })
            } else if (database.user.loaitk === constants.upgradeAcc.GUEST) {
                this.setState({ data: menus.menuGuest })
            } else {
                this.setState({ data: menus.menuCandidate })
            }
        }

    }

    async getRoleUser() {
        try {
            const res = await getRoleUser();
            if (res) {
                const role = res.data.role_user;
                this.setState({ role });
            }
        } catch (error) {
            return error;
        }
    }

    componentWillReceiveProps(props) {
        if (props.reloadSave === constants.reloadList.UPGRADE_USER) {
            setTimeout(() => {
                this.props.reloadSaves(constants.reloadList.DEFAULT);
            }, 2000);
            if (
                database.user.loaitk === constants.upgradeAcc.KTS
                || database.user.loaitk === constants.upgradeAcc.NBS
                || database.user.loaitk === constants.upgradeAcc.NX) {
                this.setState({ data: menus.menuRecruiter })
            } else if (database.user.loaitk === constants.upgradeAcc.GUEST) {
                this.setState({ data: menus.menuGuest })
            } else {
                this.setState({ data: menus.menuCandidate })
            }
        }
    }
    
    render() {
        return (
            database.tokenCache ?
                <Container style={styles.container}>
                    <View style={styles.headerStyle}>
                        <Image source={R.images.backgroungHG} style={styles.backgroundImage} resizeMode="cover" />
                        <ImagePerson />
                        <InfoPerson user={this.props.user} role={this.state.role} />
                    </View>
                    <View style={{ flex: 1, }}>

                        <ViewContact user={this.props.user} />
                        <ScrollView>
                            <ListTitleControl
                                role={[...this.state.role]}
                                data={this.state.data}
                            />
                            <BaseButtonOpacity
                                text={R.strings.login.label_logout}
                                onPress={() => {

                                    this.props.onUpdateUser({})

                                    database.tokenCache = ''
                                    database.user = {}
                                    database.save(KEY_USER_TOKEN, database.tokenCache);
                                    database.save(KEY_GET_STARTED_PRESSED, false.toString());
                                    database.save(KEY_USER, '');
                                    database.save(KEY_NOTIFICATION, '');
                                    OneSignal.sendTag('user_id', '');

                                    NavigationService.reset("GetStartedScreen");
                                }}
                                textStyle={styles.textStyle}
                                containerStyle={styles.button}
                            />
                        </ScrollView>
                    </View>
                </Container>
                :
                <SignInRequireScreen />
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    headerStyle: {
        height: 'auto',
        backgroundColor: R.colors.blue800,
        flexDirection: 'row'
    },

    button: {
        width: '100%',
        borderRadius: 0,
        backgroundColor: null,
        height: 'auto',
        alignItems: 'center',
        paddingVertical: 30,

    },
    backgroundImage: {
        width: '100%',
        opacity: 0.2,
        height: '100%',
        position: 'absolute',
        top: 0
    },
    textStyle: {
        fontSize: 13,
        color: R.colors.red800
    }
})

const mapStateToProps = state => {
    return {
        user: state.userReducer.user,
        reloadSave: state.reloadSaveReducer.reloadSave
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onUpdateUser: (user) => dispatch(onUpdateUser(user)),
        reloadSaves: (text) => dispatch(reloadSaves(text))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MyHGScreen);