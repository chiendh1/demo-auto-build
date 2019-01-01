import React, { PureComponent } from 'react';
import { View, Text, StyleSheet, Dimensions, Image, ScrollView, Share, Alert } from 'react-native';
import Container from 'libraries/components/Container';
import Header from 'libraries/components/Header';
import R from 'res/R';
import NavigationService from 'routers/NavigationService';
import BaseButtonOpacity from 'libraries/components/BaseButtonOpacity';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { getProfileDetail, postProfileSave, postCallNowRecruiment, getConfig } from 'libraries/networking/apis';
import database from 'libraries/utils/database';
import { Status } from 'libraries/networking/status';
import ContentProfile from './ContentProfile';
import { dialCall, showMessage } from 'libraries/utils/utils';
import constants from 'libraries/utils/constants';
import Moment from 'moment';
import DetailInfoProfile from './DetailInfoProfile';
import { alertSign } from 'libraries/components/AlertLogin';
import ListImageDetail from './listImageDetail';
import { connect } from 'react-redux';
import { onUpdateUser } from '../../../../../redux/actions';


const { width, height } = Dimensions.get('window');

class DetailProfile extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            profile: {},
            user: {},
            result: '',
            point_call: '',
        };
    }

    componentDidMount() {

        this.getConfig();
        this.onProfileDetail();
    }
    getConfig = () => {
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

    onProfileDetail = () => {
        const { item } = this.props.navigation.state.params;
        getProfileDetail(item.id, database.tokenCache).then(response => {
            console.log(response);
            if (response.code === Status.SUSSESS) {
                this.setState({ profile: response.data.profiles })
            }
        }).catch(error => {
            return error;
        })
    }


    onSaveProfile = (item) => () => {
        if (database.tokenCache) {
            const save = item.save_status === constants.saveProfile.save ? constants.saveProfile.remove : constants.saveProfile.save
            postProfileSave(database.user.id_users, item.id, save, database.tokenCache).then(response => {
                if (response.code === Status.SUSSESS) {

                    const action = {
                        title: R.strings.main.hint_text_detail_mess,
                        color: R.colors.orangeColor,
                        onPress: () => NavigationService.navigate('SaveProfileScreen'),
                    }
                    save === constants.saveProfile.save ?
                        showMessage(R.strings.Candidate.msg_save_profile_success, action) :
                        showMessage(R.strings.Candidate.msg_remove_profile_success)


                    let profile = { ...item }
                    profile.save_status = save;

                    this.setState({ profile })
                }
            }).catch(error => {
                save === constants.saveProfile.save ?
                    showMessage(R.strings.Candidate.msg_save_profile_failure) :
                    showMessage(R.strings.Candidate.msg_remove_profile_failure)
                return error;
            })
        } else {
            alertSign();
        }
    }

    render() {
        const { profile } = this.state;
        let updated_at = Moment(profile.updated_at).format('DD-MM-YYYY');
        return (
            <Container>
                <Header
                    text={R.strings.detailProfile.text_header}
                    onLeftPressed={this.onLeftPressed}
                />
                <ScrollView>
                    <View style={styles.wrapper}>
                        <Text style={styles.textPosotion}>{profile ? profile.position : null}</Text>
                        <View style={database.user && profile.user && profile.user.id_users === database.user.id_users ? styles.actionContainer1 : styles.actionContainer}>
                            {database.user && profile.user && profile.user.id_users === database.user.id_users ? null :
                                <BaseButtonOpacity
                                    color={R.colors.primaryColor}
                                    name={profile.save_status === constants.saveProfile.save ? 'trash-alt' : 'save'}
                                    containerStyle={styles.containerStyle}
                                    text={profile.save_status === constants.saveProfile.save ? R.strings.recruitment.worker.remove_portfolio : R.strings.recruitment.worker.save_portfolio}
                                    textStyle={styles.textButtonStyle}
                                    onPress={this.onSaveProfile(profile)}
                                />
                            }
                            <BaseButtonOpacity
                                color={R.colors.primaryColor}
                                name='share-alt'
                                containerStyle={styles.containerStyle}
                                text={R.strings.recruitment.worker.share}
                                textStyle={styles.textButtonStyle}
                                onPress={this.onShared(profile)}
                            />
                            <View style={database.user && profile.user && profile.user.id_users === database.user.id_users ? styles.updateStyle1 : styles.updateStyle}>
                                <Icon name='clock' size={13} color={R.colors.primaryColor} />
                                <Text style={styles.textButtonStyle}>{`${R.strings.detailProfile.label_updated_day} ${updated_at}`}</Text>
                            </View>
                        </View>

                        <DetailInfoProfile profile={profile} />

                        <View style={styles.viewStyle}>
                            <ContentProfile
                                lable={R.strings.detailProfile.label_desired_position}
                                text={profile ? profile.position : null}
                            />
                            {profile.current_level ?
                                <ContentProfile
                                    lable={R.strings.detailProfile.label_current_level}
                                    text={profile.current_level ? profile.current_level.name : null}
                                /> : null
                            }
                            {profile.desired_level ?
                                <ContentProfile
                                    lable={R.strings.detailProfile.label_desired_level}
                                    text={profile.desired_level ? profile.desired_level.name : null}
                                /> : null
                            }
                            <ContentProfile
                                lable={R.strings.detailProfile.label_service}
                                text={profile.service ? profile.service[0].name : null}
                            />
                            {profile.address_current ?
                                <ContentProfile
                                    lable={R.strings.detailProfile.label_curent_place}
                                    text={profile.address_current || ""}
                                /> : null
                            }
                            <ContentProfile
                                lable={R.strings.detailProfile.label_desired_place}
                                text={profile.address_desired || ""}
                            />
                            <ContentProfile
                                lable={R.strings.detailProfile.label_years_of_experience}
                                text={!profile.experience ? null : profile.experience.name}
                            />
                            <ContentProfile
                                isSalary
                                lable={R.strings.detailProfile.label_desired_salary}
                                text={profile.desired_salary || ""}
                            />

                            {profile.ability_overtime ?
                                <ContentProfile
                                    lable={R.strings.detailProfile.label_ability_overtime}
                                    text={profile.ability_overtime ? profile.ability_overtime.name : null || ""}
                                /> : null
                            }

                            {profile.ability_manage ?
                                <ContentProfile
                                    lable={R.strings.detailProfile.label_team_manage}
                                    text={profile.ability_manage === 0 ? 'Không' : 'Có' || ""}
                                /> : null
                            }
                            {profile.ability_workfar ?
                                <ContentProfile
                                    lable={R.strings.detailProfile.label_on_site}
                                    text={profile.ability_workfar === 0 ? 'Không' : 'Có' || ""}
                                /> : null
                            }

                            {profile.skill ?
                                <ContentProfile
                                    lable={R.strings.detailProfile.label_kill}
                                    text={profile.skill || ""}
                                /> : null
                            }
                        </View>
                        <View style={{ width: '100%', marginBottom: 30 }}>
                            {profile.image_product ?
                                <View style={{ marginHorizontal: 10 }}>
                                    <Text style={styles.textImage}>{R.strings.createAdvancedProfile.text_image_product}</Text>
                                    <ListImageDetail
                                        image={profile.image_product}
                                    />
                                </View> : null
                            }
                            {profile.image_forte ?
                                <View style={{ marginHorizontal: 10 }}>
                                    <Text style={styles.textImage}>{R.strings.createAdvancedProfile.text_image_product_favorite}</Text>
                                    <ListImageDetail
                                        image={profile.image_forte}
                                    />
                                </View> : null
                            }
                            {profile.image_drawing ?
                                <View style={{ marginHorizontal: 10 }}>
                                    <Text style={styles.textImage}>{R.strings.createAdvancedProfile.text_image_product_technical_drawings}</Text>
                                    <ListImageDetail
                                        image={profile.image_drawing}
                                    />
                                </View> : null
                            }
                        </View>

                        {database.user && profile.user && profile.user.id_users === database.user.id_users ? null :
                            <View style={styles.viewButton}>
                                <View style={styles.viewBotton}>
                                    <BaseButtonOpacity
                                        containerStyle={styles.buttonStyle}
                                        text={R.strings.detailProfile.label_button}
                                        textStyle={styles.textStyle}
                                        onPress={this.onPersonPage(profile)}
                                    />
                                    <BaseButtonOpacity
                                        containerStyle={styles.buttonRightStyle}
                                        text={R.strings.recruitment.worker.call_now}
                                        textStyle={styles.textRightStyle}
                                        name='phone-volume'
                                        color={R.colors.white100}
                                        size={16}
                                        onPress={this.onCallPressed(profile)}
                                    />
                                </View>
                            </View>
                        }
                    </View>
                </ScrollView>
            </Container>
        );
    }
    onPersonPage = (profile) => () => {
        NavigationService.navigate('PersonalPage', { profile })
    }

    onCallPressed = (profile) => () => {
        if (this.state.point_call === constants.config.POINT_NULL) {
            postCallNowRecruiment(database.user.id_users, null, profile.id, database.tokenCache, profile.user.id_users).then(res => {
                if (res.code === Status.SUSSESS) {
                    dialCall(profile.user.telephone);
                } else if (res.code === Status.POINT_NOT_ENOUGH) {
                    showMessage(R.strings.callNow.text_call_point_not_enough);
                }
            }).catch(err => {
                console.log(err)
            })
        }
        else {
            if (database.tokenCache) {
                Alert.alert(
                    'Thông báo',
                    `Khi thực hiện cuộc gọi bạn sẽ bị trừ ${this.state.point_call} điểm`,
                    [
                        { text: 'Trở lại', style: 'destructive' },
                        { text: 'Gọi', onPress: () => { this.onPostCall(profile) } },
                    ],
                    { cancelable: false }
                )
            } else {
                alertSign();
            }
        }

    }

    onPostCall = (profile) => {
        postCallNowRecruiment(database.user.id_users, null, profile.id, database.tokenCache, profile.user.id_users).then(res => {
            if (res.code === Status.SUSSESS) {
                dialCall(profile.user.telephone);
                const newUser = { ...database.user, point: database.user.point - this.state.point_call }
                database.user = newUser;
                this.props.onUpdateUser(newUser);

            } else if (res.code === Status.POINT_NOT_ENOUGH) {
                showMessage(R.strings.callNow.text_call_point_not_enough);
            }
        }).catch(error => {
            return error;
        })
    }

    onLeftPressed = () => {
        if (this.props.navigation.state.params.onRefreshLocalList) {
            this.props.navigation.state.params.onRefreshLocalList(this.state.profile, this.props.navigation.state.params.index)
        }
        NavigationService.pop();
    }


    onShared = (profile) => () => {
        Share.share({
            message: 'Họ tên: ' + profile.user.name + '\n'
                + 'Địa chỉ:' + profile.user.address + '\n'
                + 'Số điện thoại:' + profile.user.telephone.replace(profile.user.telephone.substring(7, 10), "***") + '\n'
                + 'Vị trí:' + profile.position + '\n'
                + 'Tải LimberNow tại đây:' + 'https://play.google.com/store/apps/details?id=vn.noithathg',
        }).then(this.showResult)
    }

    showResult = result => {
        this.setState({ result: result })
    }
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        backgroundColor: R.colors.white100,

    },
    actionContainer1: {
        flexDirection: 'row',
        marginTop: 15,
        marginLeft: 10
    },
    actionContainer: {
        flexDirection: 'row',
        marginTop: 15,
        justifyContent: 'space-between',
        marginHorizontal: 10,
    },
    containerStyle: {
        height: 30,
        borderWidth: 0.8,
        borderRadius: 5,
        paddingVertical: 3,
        backgroundColor: 'white',
        width: width / 5 + 20,
    },
    textPosotion: {
        marginHorizontal: 10,
        color: R.colors.primaryColor,
        fontSize: 18,
        paddingTop: 15,
    },
    updateStyle: {
        height: 30,
        borderWidth: 0.8,
        borderRadius: 5,
        backgroundColor: 'white',
        width: width / 2 - 40,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    updateStyle1: {
        height: 30,
        borderWidth: 0.8,
        borderRadius: 5,
        backgroundColor: 'white',
        width: width / 2 - 40,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 15
    },
    textButtonStyle: {
        fontSize: 12,
        color: R.colors.primaryColor,
        paddingLeft: 3,
        paddingBottom: 2
    },

    viewStyle: {
        width: width - 20,
        borderWidth: 0.5,
        borderColor: R.colors.grey500,
        borderStyle: 'dashed',
        marginHorizontal: 10,
        marginTop: 10,
        borderRadius: 3,
        justifyContent: 'center',
        paddingVertical: 10
    },
    viewBotton: {
        flexDirection: 'row',
        marginHorizontal: 15,
        alignItems: 'center',
        marginBottom: 20
    },
    buttonStyle: {
        backgroundColor: null,
        borderColor: R.colors.orangeColor,
        borderWidth: 0.5,
        width: width / 2 + 20,
    },
    buttonRightStyle: {
        backgroundColor: R.colors.orangeColor,
        borderWidth: 0.5,
        borderColor: R.colors.orangeColor,
        width: width / 3,
        marginLeft: 10,
    },
    textStyle: {
        color: R.colors.orangeColor
    },
    textRightStyle: {
        color: R.colors.white100
    },
    textImage: {
        paddingTop: 10,
        fontSize: 13,
        color: '#111111',
        paddingBottom: 5
    },
    viewButton: {
        height: height / 5,
        justifyContent: 'flex-end'
    }
})


const mapDispatchToProps = dispatch => {
    return {
        onUpdateUser: (user) => dispatch(onUpdateUser(user)),
    }
}

export default connect(null, mapDispatchToProps)(DetailProfile);