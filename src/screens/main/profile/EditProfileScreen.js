import React, { Component } from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView } from 'react-native';
import Container from 'libraries/components/Container';
import Header from 'libraries/components/Header';
import R from 'res/R';
import NavigationService from 'routers/NavigationService';
import BaseInput from 'libraries/components/BaseInput';
import HGDropdown from 'libraries/components/HGDropdown';
import PlaceLocation from 'libraries/components/PlaceLocation';
import { openAutocompleteModal, showMessage } from 'libraries/utils/utils';
import database from 'libraries/utils/database';
import { putUpdateUser } from 'libraries/networking/apis';
import { connect } from 'react-redux';
import { onUpdateUser } from '../../../redux/actions';
import { Status } from 'libraries/networking/status';
import LoadingButton from 'libraries/components/LoadingButton';
import SelectServiece from '../recruitment/recruiter/post_job_recruitment/SelectService';
import constants from 'libraries/utils/constants';

const { height } = Dimensions.get('window');

class EditProfileScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            email: '',
            gender: [
                {
                    id: 0,
                    name: 'Nam'
                },
                {
                    id: 1,
                    name: 'Nữ'
                },
                {
                    id: 2,
                    name: 'Khác'
                },
            ],
            gender_id: null,
            place: '',
            city_name: '',
            lat_lng: null,
            specialize: null,
        };
    }

    onLeftPressed = () => {

        NavigationService.pop()
    }

    onFullName = (name) => {
        this.setState({ name })
    }
    onEmail = (email) => {
        this.setState({ email })
    }
    onGender = (value) => {
        this.setState({ gender_id: value.id })
    }

    componentDidMount() {
        this.getProfile();
    }

    getProfile = () => {
        this.setState({
            name: database.user.name,
            email: database.user.email,
            place: database.user.address,
            city_name: database.user.city_name,
            lat_lng: database.user.lat_lng,
            gender_id: database.user.gender,
            specialize: database.user.specialize,
        })
    }

    render() {
        const { service2 } = this.props.navigation.state.params;
        return (
            <Container>
                <Header
                    text={R.strings.detailStar.text_header_edit_profile}
                    onLeftPressed={this.onLeftPressed}
                />
                <ScrollView>
                    <View style={{ flex: 1 }}>
                        <View style={styles.viewName}>
                            <Text style={styles.textStyle}>{R.strings.editProfile.hint_fullname}</Text>
                            <BaseInput
                                placeholder="Nhập họ và tên"
                                value={this.state.name}
                                onChangeText={this.onFullName}
                                style={styles.textInput}
                            />
                        </View>

                        <View style={styles.viewPhone}>
                            <Text style={styles.textStyle}>{R.strings.editProfile.hint_phone}</Text>
                            <Text style={styles.textPhone}>{database.user.telephone}</Text>
                        </View>


                        <View style={styles.viewName}>
                            <Text style={styles.textStyle}>{R.strings.editProfile.hint_email}</Text>
                            <BaseInput
                                placeholder="Nhập email"
                                keyboardType="email-address"
                                value={this.state.email}
                                onChangeText={this.onEmail}
                                style={styles.textInput}
                            />
                        </View>

                        <View style={styles.viewGender}>
                            <Text style={styles.textGender}>{R.strings.editProfile.hint_gender}</Text>
                            <HGDropdown
                                onChangeText={this.onGender}
                                value={this.state.gender_id}
                                label={''}
                                data={this.state.gender}

                            />
                        </View>
                        <View style={styles.viewLocation}>
                            <PlaceLocation
                                text='Địa chỉ'
                                style={{ paddingTop: 8 }}
                                labelStyle={{ paddingBottom: 5 }}
                                place={this.state.place ? this.state.place :
                                    <Text style={{ color: R.colors.grey500, fontSize: 14 }}>{R.strings.createBasicProfile.text_place_holder}</Text>
                                }
                                onLocationPressed={this.onLocationPressed}
                            />
                        </View>

                        <View style={{ alignItems: 'center' }}>
                            <SelectServiece
                                textLeft='Chọn chuyên môn'
                                textRight={service2 ? service2.name : null || database.user.specialize ? database.user.specialize.name : null}
                                onPress={this.onService}
                            />
                        </View>

                        <View style={styles.viewBottom}>
                            <LoadingButton
                                text='Lưu'
                                containerStyle={{ width: '100%', borderRadius: 20 }}
                                onPress={this.onSave}
                                ref={c => (this.loadingButton = c)}
                                backgroundColor={R.colors.orangeColor}
                            />

                        </View>
                    </View>
                </ScrollView>
            </Container>
        );
    }

    onService = () => {
        NavigationService.navigate('ClickServiceScreen', { keyScreen: constants.SERVICES.EditProfile });
    }
    onLocationPressed = () => {

        openAutocompleteModal().then(response => {
            this.setState({ place: response.place.address, lat_lng: `${response.place.latitude},${response.place.longitude}`, city_name: response.city_name })
        }).catch(error => {
            return error;
        })
    }

    onSave = () => {
        const { name, email, gender_id, city_name, lat_lng, place } = this.state;
        if (name && name.trim().length === 0) {
            showMessage(R.strings.validate.msg_empty_fullname);
            return;
        }
        if (!email || email.trim().length === 0) {
            showMessage(R.strings.updateUser.msg_email_not_empty);
            return;
        }
        if (gender_id === null) {
            showMessage(R.strings.updateUser.msg_gender_not_empty);
            return;
        }
        if (!place || place.trim().length === 0) {
            showMessage(R.strings.updateUser.msg_place_not_empty);
            return;
        }
        const service2 = this.props.navigation.state.params.service2;
        if (!service2 && !database.user.specialize) {
            showMessage(R.strings.studentJobRecruitment.validate_service1)
            return;
        }
        const specialize_id = service2 ? service2.id : database.user.specialize.id;

        this.loadingButton.show(true);
        putUpdateUser(database.tokenCache, {
            id_users: database.user.id_users,
            name: name,
            email: email,
            gender: gender_id,
            city_name: city_name,
            lat_lng: lat_lng,
            address: place,
            specialize_id,

        }).then(data => {
            if (data.code === Status.SUSSESS) {
                const newUser = data.user.user;
                database.user = newUser;
                this.props.onUpdateUser(newUser);

                showMessage(R.strings.updateUser.msg_update_user_success)
                NavigationService.pop();
            } else {
                this.loadingButton.show(false);
            }
        })
    }
}


const styles = StyleSheet.create({
    viewName: {
        width: '100%',
        marginHorizontal: 10,
        paddingTop: 12
    },
    viewPhone: {
        borderBottomWidth: 0.5,
        borderColor: '#CCCCCC',
        marginHorizontal: 10,
        paddingTop: 13
    },
    viewGender: {
        marginHorizontal: 5,
        height: 50,
        paddingTop: 12
    },
    viewLocation: {
        marginHorizontal: 10,
        paddingTop: 15
    },
    textStyle: {
        fontSize: 16,
        color: '#111111'
    },
    textGender: {
        fontSize: 16,
        color: '#111111',
        marginBottom: -7,
        paddingLeft: 5
    },
    textInput: {
        height: 37,
        width: '94%',
        paddingVertical: 3,
        padding: 0,
        marginBottom: 0,
        borderBottomColor: '#CCCCCC'
    },
    textPhone: {
        paddingBottom: 5,
        paddingTop: 10
    },
    viewBottom: {
        width: '100%',
        alignItems: 'center',
        height: height / 4,
        justifyContent: 'flex-end',
        marginBottom: 50
    }
})

const mapDispatchToProps = dispatch => {
    return {
        onUpdateUser: (user) => dispatch(onUpdateUser(user)),
    }
}

export default connect(null, mapDispatchToProps)(EditProfileScreen);