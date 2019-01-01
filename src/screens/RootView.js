import React, { PureComponent } from 'react';
import { View } from 'react-native';
import OneSignal from 'react-native-onesignal';
import { connect } from 'react-redux';
import NavigationService from 'routers/NavigationService';
import { onUpdateUser, reloadSaves } from '../redux/actions';
import ModalNotification from 'screens/main/notification/ModalNotification';
import constants from 'libraries/utils/constants';
import database from 'libraries/utils/database';
import ModalNotificationSevenDayContent from './main/notification/ModalNotificationSevenDayContent';
import { putUpdateRecruitment, editProfileOfMe, getRecruiment } from 'libraries/networking/apis';
import { Status } from 'libraries/networking/status';
import { showMessage } from 'libraries/utils/utils';
import R from 'res/R';
import ModalNotificationSevenDay from './main/notification/ModalNotificationSevenDay';
import ModalThanksYou from './main/notification/ModalThanksYou';
import ModalAskCallNow from './main/notification/ModalAskCallNow';

class RootView extends PureComponent {


    constructor(props) {
        super(props);

        this.onReceived = this.onReceived.bind(this);
        this.onOpened = this.onOpened.bind(this);

        this.state = {
            isVisible: false,
            updateUser: '',
            isVisibleSevenDay: false,
            itemSevenDay: {},
            isVisibleSevenDayContent: false,
            isVisibleThankYou: false,
            isVisibleAskCallNow: false,
            callNowUserData: null,
            type: ''
        }
        OneSignal.init("6788c5d7-7a4a-4045-b341-f2be8328e18e");
        OneSignal.inFocusDisplaying(2);
        OneSignal.addEventListener('received', this.onReceived);
        OneSignal.addEventListener('opened', this.onOpened);
        OneSignal.addEventListener('ids', this.onIds);

    }

    componentWillUnmount() {
        OneSignal.removeEventListener('received', this.onReceived);
        OneSignal.removeEventListener('opened', this.onOpened);
        OneSignal.removeEventListener('ids', this.onIds);
    }

    onReceived(notification) {

        // console.log(notification.payload);

        if (database.tokenCache) {
            const type = notification.payload.additionalData.type;
            if (type === constants.notification.UPGRADE_USER) {
                this.setState({ isVisible: true, updateUser: notification.payload.additionalData.user, type });
            } else if (type === constants.notification.INVITATION_CODE) {
                if (database.user) {
                    const point = notification.payload.additionalData.point;
                    const newUser = { ...database.user, point: database.user.point + point }
                    database.user = newUser;
                    this.props.onUpdateUser(newUser);
                }
            } else if (type === constants.notification.SEVEN_DAY_WORK) {
                this.setState({ isVisibleSevenDay: true, itemSevenDay: notification.payload.additionalData.recruitment, type })
            } else if (type === constants.notification.CALL_NOW) {
                this.setState({ isVisibleAskCallNow: true, type, callNowUserData: notification.payload.additionalData.info })
            } else if (type === constants.notification.SEVEN_DAY_PROFILE) {
                this.setState({ isVisibleSevenDay: true, itemSevenDay: notification.payload.additionalData.profile, type })
            }

        }
    }

    onOpened(openResult) {

        setTimeout(()=> {
            if (database.tokenCache) {
                const type = openResult.notification.payload.additionalData.type;
                if (type === constants.notification.UPGRADE_USER) {
                    this.setState({ isVisible: true, updateUser: openResult.notification.payload.additionalData.user });
                } else if (type === constants.notification.SEVEN_DAY_WORK) {
                    this.setState({ isVisibleSevenDay: true, itemSevenDay: openResult.notification.payload.additionalData.recruitment, type })
                } else if (type === constants.notification.CALL_NOW) {
                    this.setState({ isVisibleAskCallNow: true })
                } else if (type === constants.notification.NOTIFY_FOR_NEW_PROFILE) {
                    NavigationService.navigate("DetailProfile", { item: openResult.notification.payload.additionalData.profile });
                } else if (type === constants.notification.NOTIFY_NEW_RECRUITMENT) {
                    getRecruiment(openResult.notification.payload.additionalData.recruitment.user, database.tokenCache).then(res => {
                        let data = res.data.recruitment.filter(item => item.id === openResult.notification.payload.additionalData.recruitment.id);
                        NavigationService.navigate("InfoRecruimentScreen", { item: data[0] });
                    }).catch(error => {
                        return error;
                    })
                } else if (type === constants.notification.NOTIFY_FOR_NEW_COMMENT) {
                    NavigationService.navigate('FeedBackScreen', { profile: openResult.notification.payload.additionalData })
                }
            }
        }, 5000);
        
    }

    onIds(device) {

    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                {this._render_modal_upgrade()}
                {this._render_modal_seven_day()}
                {this._render_modal_seven_content_day()}
                {this._render_modal_thanks_you()}
                {this._render_modal_call_now()}
                {this.props.children}
            </View>
        )
    }

    _render_modal_call_now() {
        return (
            <ModalAskCallNow
                textContent={this.state.callNowUserData ? this.state.callNowUserData.user.name : ''}
                onClose={() => this.setState({ isVisibleAskCallNow: false })}
                isVisible={this.state.isVisibleAskCallNow}
                onFindDone={() => {
                    this.setState({ isVisibleAskCallNow: false, })
                    //TODO: Khánh show feedback screen
                    NavigationService.navigate('FeedBackScreen', { user: this.state.callNowUserData })
                }}
                onFindNo={() => {
                    this.setState({ isVisibleAskCallNow: false, isVisibleThankYou: true })

                }}
            />
        )
    }

    _render_modal_thanks_you() {
        return (
            <ModalThanksYou
                onClose={() => this.setState({ isVisibleThankYou: false })}
                isVisible={this.state.isVisibleThankYou}
            />
        )
    }

    _render_modal_seven_day() {
        return (
            <ModalNotificationSevenDay
                textContent={this.state.type === constants.notification.SEVEN_DAY_WORK ? R.strings.notification.text_you_find_content : R.strings.notification.text_recuiment_find_content}
                onClose={() => this.setState({ isVisibleSevenDay: false })}
                isVisible={this.state.isVisibleSevenDay}
                onFindDone={() => this.setState({ isVisibleSevenDay: false, isVisibleThankYou: true })}
                onFindNo={() => this.setState({ isVisibleSevenDay: false, isVisibleSevenDayContent: true })}
            />
        )
    }


    _render_modal_seven_content_day() {
        const isRecruiter = this.state.type === constants.notification.SEVEN_DAY_WORK
        return (
            <ModalNotificationSevenDayContent
                onClose={() => this.setState({ isVisibleSevenDayContent: false })}
                isVisible={this.state.isVisibleSevenDayContent}
                onReset={this.onReset}
                onChange={this.onChange}
                txtTitleNewReset={isRecruiter ? R.strings.notification.text_news_reset : R.strings.notification.text_profiles_reset}
                txtCotentNewReset={R.strings.notification.text_news_reset_content}
                txtTitleChange={R.strings.notification.text_change_news}
                txtContentChange={isRecruiter ? R.strings.notification.text_change_news_content : R.strings.notification.text_change_profiles_content}
            />
        )
    }

    onReset = () => {
        const isRecruiter = this.state.type === constants.notification.SEVEN_DAY_WORK

        this.setState({ isVisibleSevenDayContent: false })
        const item = this.state.itemSevenDay;
        if (isRecruiter) {
            putUpdateRecruitment(database.tokenCache, item.id).then(res => {
                if (res.code === Status.SUSSESS) {
                    setTimeout(() => {
                        showMessage(R.strings.notification.text_update_job_done);
                    }, 1500)
                } else {
                    showMessage(R.strings.notification.text_update_job_err);
                }
            }).catch(error => {
                return error;
            });

        } else {
            editProfileOfMe(database.tokenCache, item.id)
                .then(res => {
                    if (res.code === Status.SUSSESS) {
                        showMessage(R.strings.notification.text_update_profile_done);
                    } else {
                        showMessage(R.strings.notification.text_update_profile_err)
                    }
                }).catch(error => {
                    return error;
                })
        }
    }
    onChange = () => {

        const isRecruiter = this.state.type === constants.notification.SEVEN_DAY_WORK

        this.setState({ isVisibleSevenDayContent: false })
        const item = this.state.itemSevenDay;
        if (isRecruiter) {
            if (item.type === constants.ProfileType.Student) {
                NavigationService.navigate("PostJobRecruitmentScreen", { key: constants.RECRUITER.STUDENT_RECRUITER, item })
            } else if (item.type === constants.ProfileType.Worker_Basic) {
                NavigationService.navigate("PostJobRecruitmentScreen", { key: constants.RECRUITER.WORKER_RECRUITER, item })
            }
        } else {
            if (item.type === constants.ProfileType.Student) {
                NavigationService.navigate('CreateStudentPortfolioScreen', { key: constants.CANDIDATE.STUDENT_CANDIDATE, item })
            } else {
                const type = item.type === constants.ProfileType.Worker_Basic ? 'basic' : 'advanced';
                NavigationService.navigate('WorkerAdvancedPortfolioScreen', { key: constants.CANDIDATE.WORKER_CANDIDATE, item, type })
            }
        }

    }


    _render_modal_upgrade() {
        return (
            <ModalNotification
                isVisible={this.state.isVisible}
                onClose={this.onClose}
                onContinue={this.onContinue}
                onSee={this.onSee}
            />
        )
    }
    onClose = () => {
        database.user = this.state.updateUser;
        this.props.onUpdateUser(this.state.updateUser);
        this.props.reloadSaves(constants.reloadList.UPGRADE_USER);
        this.setState({ isVisible: false });
    }
    onSee = () => {
        database.user = this.state.updateUser;
        this.props.onUpdateUser(this.state.updateUser);
        this.props.reloadSaves(constants.reloadList.UPGRADE_USER);
        this.setState({ isVisible: false });
        NavigationService.navigate("DetailStarScreen", { key: constants.upgradeAcc.DONE })
    }
    onContinue = () => {
        database.user = this.state.updateUser;
        this.props.onUpdateUser(this.state.updateUser);
        this.props.reloadSaves(constants.reloadList.UPGRADE_USER);
        this.setState({ isVisible: false });
    }
}
const mapDispatchToProps = dispatch => {
    return {
        onUpdateUser: (user) => dispatch(onUpdateUser(user)),
        reloadSaves: (text) => dispatch(reloadSaves(text))
    }
}

export default connect(null, mapDispatchToProps)(RootView);