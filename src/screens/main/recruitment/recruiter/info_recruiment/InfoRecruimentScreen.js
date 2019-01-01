import React, { Component } from 'react';
import { View, Text, StyleSheet, ScrollView, Share, Alert } from 'react-native';
import Container from 'libraries/components/Container';
import Header from 'libraries/components/Header';
import R from 'res/R';
import ButtonHeaderComponent from './ButtonHeaderComponent';
import ImageSwiperComponent from './ImageSwiperComponent';
import ContentTextComponent from './ContentTextComponent';
import TextDescriptionComponent from './TextDescriptionComponent';
import ButtonBottomComponent from './ButtonBottomComponent';
import database from 'libraries/utils/database';
import { dialCall, showMessage } from 'libraries/utils/utils';
import { alertSign } from 'libraries/components/AlertLogin';
import { getDetailRecruiment, postJobSave, getConfig, postCallNowRecruiment } from 'libraries/networking/apis';
import NavigationService from 'routers/NavigationService';
import constants from 'libraries/utils/constants';
import { Status } from 'libraries/networking/status';
import Moment from 'moment';
import { connect } from 'react-redux';
import { onUpdateUser } from '../../../../../redux/actions';

class InfoRecruimentScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            result: '',
            item: this.props.navigation ? this.props.navigation.state.params.item : this.props.item,
            activeArtisan: null,
            point_call: ''
        };
    }

    componentWillMount() {
        this.setState({
            activeArtisan: this.state.item.type === constants.ProfileType.Student ? false : true
        })
        this.getConfig();
    }

    getConfig() {
        if (database.tokenCache) {
            getConfig(database.tokenCache).then(res => {
                if (res.code === Status.SUSSESS) {
                    this.setState({ point_call: res.data.point_call })
                }
            }).catch(error => {
                return error;
            })
        }
    }

    render() {
        const { item } = this.state;
        let updated_at = Moment(item.expiration_date).format('DD-MM-YYYY');

        return (
            <Container>
                <Header
                    onLeftPressed={this.onLeftPressed}
                    text={item.service.length > 0 && item.service[0].name}
                />
                <ScrollView contentContainerStyle={styles.scStyle}>
                    <Text style={styles.txtHeader}>{item.vacancies}</Text>
                    <ButtonHeaderComponent
                        textLeft={item.save_status === constants.saveProfile.save ? R.strings.recruitment.worker.remove_job : R.strings.recruitment.worker.save_job}
                        textActionRight={`${R.strings.infoRecruiment.text_deadline}${updated_at}`}
                        onSave={() => this.onSave(item)}
                        onShare={() => this.onShare(item)}
                        activeSave={database.user && item.user.id_users === database.user.id_users ? false : true}
                    />
                    <ImageSwiperComponent item={item} />
                    <ContentTextComponent
                        activeArtisan={this.state.activeArtisan}
                        wage_min={item.wage_min}
                        wage_max={item.wage_max}
                        txtExp={item.experience.name}
                        txtProPer={item.probationary_period}
                        txtNumberRecru={item.number_vacancies}
                        txtLevelRecru={item.level_recruitment && item.level_recruitment.name}
                        txtAddress={item.city_name}
                        txtRegime={item.support_mode}
                        txtTimeWork={item.time_work}
                    />
                    <TextDescriptionComponent textDes={item.description} />

                    {
                        database.user && item.user.id_users === database.user.id_users ? null :
                            <ButtonBottomComponent
                                onLeft={() => { this.onLeft(item) }}
                                onRight={() => { this.onCall(item) }}
                            />
                    }

                </ScrollView>
            </Container>
        );
    }

    onLeftPressed = () => {
        if (this.props.navigation && this.props.navigation.state.params.onRefreshLocalList)
            this.props.navigation.state.params.onRefreshLocalList(this.state.item, this.props.navigation.state.params.index)
        NavigationService.pop()
    }

    onSave = (item) => {

        if (database.tokenCache) {
            if (database.user.loaitk === constants.upgradeAcc.GUEST) {
                const action = {
                    title: R.strings.main.hint_text_upgrade_mess,
                    color: R.colors.orangeColor,
                    onPress: () => NavigationService.navigate("MyHGScreen"),
                }
                showMessage(R.strings.upgradeacc.text_you_update_acc, action);
            } else {
                const save = item.save_status === constants.saveProfile.save ? constants.saveProfile.remove : constants.saveProfile.save

                postJobSave(database.user.id_users, item.id, save, database.tokenCache).then(response => {
                    if (response.code === Status.SUSSESS) {
                        const action = {
                            title: R.strings.main.hint_text_detail_mess,
                            color: R.colors.orangeColor,
                            onPress: () => NavigationService.navigate("SavedJobScreen"),
                        }
                        save === constants.saveProfile.save ?
                            showMessage(R.strings.Candidate.msg_save_profile_success, action) :
                            showMessage(R.strings.Candidate.msg_remove_profile_success)

                        let job = { ...item }
                        job.save_status = save;

                        this.setState({ item: job })

                    }
                }).catch(error => {
                    save === constants.saveProfile.save ?
                        showMessage(R.strings.Candidate.msg_save_profile_failure) :
                        showMessage(R.strings.Candidate.msg_remove_profile_failure)
                    return error;
                })
            }
        } else {
            alertSign();
        }

    }
    onShare = (item) => {
        if (database.tokenCache) {
            if (database.user.loaitk === constants.upgradeAcc.GUEST) {
                const action = {
                    title: R.strings.main.hint_text_upgrade_mess,
                    color: R.colors.orangeColor,
                    onPress: () => NavigationService.navigate("MyHGScreen"),
                }
                showMessage(R.strings.upgradeacc.text_you_update_acc, action);
            } else {
                Share.share({
                    message: 'Họ tên: ' + item.user.name + '\n'
                        + 'Địa chỉ:' + item.user.address + '\n'
                        + 'Số điện thoại:' + item.user.telephone.replace(item.user.telephone.substring(7, 10), "***") + '\n'
                        + 'Vị trí:' + item.description + '\n'
                        + 'Tải LimberNow tại đây:' + 'https://play.google.com/store/apps/details?id=vn.noithathg',
                }).then(this.showResult)
            }
        } else {
            alertSign();
        }

    }

    showResult = result => {
        this.setState({ result: result })
    }
    onLeft = (item) => {
        NavigationService.navigate("PersonalPage", { recruiment: item })
    }
    onCall = (item) => {
        if (database.tokenCache) {
            if (database.user.loaitk === constants.upgradeAcc.GUEST) {
                const action = {
                    title: R.strings.main.hint_text_upgrade_mess,
                    color: R.colors.orangeColor,
                    onPress: () => NavigationService.navigate("MyHGScreen"),
                }
                showMessage(R.strings.upgradeacc.text_you_update_acc, action);
            } else {
                if (this.state.point_call === constants.config.POINT_NULL) {
                    postCallNowRecruiment(database.user.id_users, item.id, null, database.tokenCache, item.user.id_users).then(res => {
                        if (res.code === Status.SUSSESS) {
                            dialCall(item.user.telephone);
                        } else if (res.code === Status.POINT_NOT_ENOUGH) {
                            showMessage(R.strings.callNow.text_call_point_not_enough);
                        }
                    }).catch(err => {
                        return err;
                    })
                } else {
                    Alert.alert(
                        'Thông báo',
                        `Khi thực hiện cuộc gọi bạn sẽ bị trừ ${this.state.point_call} điểm`,
                        [
                            { text: 'Trở lại', style: 'destructive' },
                            { text: 'Gọi', onPress: () => { this.onPostCall(item) } },
                        ],
                        { cancelable: false }
                    )
                }
            }
        } else {
            alertSign()
        }
    }
    onPostCall = (item) => {
        postCallNowRecruiment(database.user.id_users, item.id, null, database.tokenCache, item.user.id_users).then(res => {
            if (res.code === Status.SUSSESS) {
                dialCall(item.user.telephone);
                const newUser = { ...database.user, point: database.user.point - this.state.point_call }
                database.user = newUser;
                this.props.onUpdateUser(newUser);
            } else if (res.code === Status.POINT_NOT_ENOUGH) {
                showMessage(R.strings.callNow.text_call_point_not_enough);
            }
        })
    }
}
const styles = StyleSheet.create({
    scStyle: {
        marginHorizontal: 10,
        marginVertical: 10,
        paddingBottom: 30,
    },
    txtHeader: {
        color: R.colors.primaryColor,
        fontSize: 16,
        fontWeight: '500',
    },
})

const mapDispatchToProps = dispatch => {
    return {
        onUpdateUser: (user) => dispatch(onUpdateUser(user)),
    }
}

export default connect(null, mapDispatchToProps)(InfoRecruimentScreen);