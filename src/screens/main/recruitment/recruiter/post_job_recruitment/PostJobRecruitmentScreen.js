import React, { PureComponent } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image, Switch, Platform } from 'react-native';
import Container from 'libraries/components/Container';
import Header from 'libraries/components/Header';
import R from 'res/R';
import TitleContent from './TitleContent';
import BaseInput from 'libraries/components/BaseInput';
import WageComponent from './WageComponent';
import SliderComponent from 'libraries/components/SliderComponent';
import InputTextContent from './InputTextContent';
import BaseButtonOpacity from 'libraries/components/BaseButtonOpacity';
import UploadImage from 'libraries/components/UploadImage';
import { getExperience, getLevel, postRecruitment, postUploadVideo, putUpdateRecruitment } from 'libraries/networking/apis';
import ModalProgressUpload from 'libraries/components/ModalProgressUpload';
import database from 'libraries/utils/database';
import { showMessage, openAutocompleteModal, validateImage } from 'libraries/utils/utils';
import { Status } from 'libraries/networking/status';
import ImagePicker from 'react-native-image-picker';
import UploadVideo from './UploadVideo';
import constants from 'libraries/utils/constants';
import HGDropdown from 'libraries/components/HGDropdown';
import NavigationService from 'routers/NavigationService';
import Icon from 'react-native-vector-icons/FontAwesome5';
import SelectServiece from './SelectService';
import InputDescription from './InputDescription';
import LoadingButton from 'libraries/components/LoadingButton';
import DateTimePicker from './DateTimePicker';

Array.prototype.insert = function (index, item) {
    this.splice(index, 0, item);
};


export default class PostJobRecruitmentScreen extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            wageActive: true,
            experience: [],
            level: [],
            vacancies: '',
            work_location: R.strings.studentJobRecruitment.text_click_map,
            wage: '',
            experience_required: '',
            support_mode: '',
            time_work: '',
            level_recruitment_id: '',
            url_video: '',
            timeSwitch: true,
            place: '',
            service: '',
            textHeader: '',
            city_name: ''
        };
    }

    componentDidMount() {
        this.getExperience();
        this.getLevel();
        this.getItem();
    }

    getExperience() {
        const { item } = this.props.navigation.state.params;
        getExperience(database.tokenCache).then(response => {
            if (response.code === Status.SUSSESS) {
                if (!item) {
                    this.setState({ experience: response.data.experiences, experience_required: response.data.experiences[0].id });
                } else {
                    this.setState({ experience: response.data.experiences, experience_required: item.experience.id });
                }
            }
        }).catch(error => {
            return error;
        });
    }

    getLevel() {
        const { item } = this.props.navigation.state.params;
        getLevel(database.tokenCache).then(response => {
            if (response.code === Status.SUSSESS) {
                if (!item) {
                    this.setState({ level: response.data.levels, level_recruitment_id: response.data.levels[0].id });
                } else {
                    this.setState({ level: response.data.levels, level_recruitment_id: item.level_recruitment.id })
                }
            }
        }).catch(error => {
            return error;
        });
    }

    getItem() {
        const { item, key } = this.props.navigation.state.params;
        if (key && item) {
            if (key === constants.RECRUITER.STUDENT_RECRUITER) {
                this.setState({
                    textHeader: R.strings.header.hint_edit_new_student
                })
            } else {
                this.setState({
                    textHeader: R.strings.header.hint_edit_new_artisa
                })
            }
        } else if (key && !item) {
            if (key === constants.RECRUITER.STUDENT_RECRUITER) {
                this.setState({
                    textHeader: R.strings.header.hint_student_ecruitment
                })
            } else {
                this.setState({
                    textHeader: R.strings.header.hint_artisan_ecruitment
                })
            }
        }

        if (item) {
            let images = [];

            if (item.images) {
                images = item.images.map(item => {
                    if (!item.toString().includes(constants.BASE_URL)) {
                        uri = `${constants.BASE_URL}${item}`;
                    }
                    return uri;
                })
            }


            this.imageUploadComponent.setImages(images);
            this.textInputVacancies.setValue(item.number_vacancies.toString());
            this.dateTimePicker.setValue(item.expiration_date)
            this.textInputDescription.setValue(item.description)


            this.setState({
                vacancies: item.vacancies,
                work_location: item.work_location_name,
                support_mode: item.support_mode,
                time_work: item.time_work,
                url_video: item.videos ? validateImage(item.videos) : ''
            })
            if (item.wage_min === '0') {
                this.setState({ wageActive: false })
            } else {
                this.slider.setSliderValue(parseInt(item.wage_min), parseInt(item.wage_max));
            }

            if (item.probationary_period === 0) {
                this.setState({
                    timeSwitch: false,
                })
            } else {
                const probationary = item.probationary_period.toString();
                this.textProbationaryPeriod.setValue(probationary)
            }
        }
    }

    _render_slider() {
        if (this.state.wageActive) {
            return (
                <View style={styles.sliderMoney}>
                    <SliderComponent
                        ref={(ref) => this.slider = ref}
                        sliderLength={Platform.OS === 'ios' ? 280 : 260}
                    />
                </View>
            )
        } else {
            return null;
        }
    }

    add_time_sv() {
        const key = this.props.navigation.state.params.key;
        if (key === constants.RECRUITER.STUDENT_RECRUITER) {
            return (
                <View style={styles.viewThoStyle}>
                    <TitleContent text={R.strings.studentJobRecruitment.text_working_time} textStyle={{ marginLeft: null }} />
                    <BaseInput
                        style={[styles.textinputStyle, { width: '100%' }]}
                        placeholder={R.strings.studentJobRecruitment.text_placeholder_time_working}
                        value={this.state.time_work}
                        onChangeText={this.onTimeWork}
                    />
                </View>
            )
        }
    }

    add_rank_tho() {
        const { key, item } = this.props.navigation.state.params;
        if (key === constants.RECRUITER.WORKER_RECRUITER) {
            return (
                <View style={styles.viewThoStyle}>
                    <TitleContent text={R.strings.studentJobRecruitment.text_select_rank} textStyle={{ marginLeft: null, marginBottom: -5, }} />
                    <HGDropdown
                        data={this.state.level}
                        label={''}
                        fontSize={16}
                        onChangeText={this.onChangeStatusgetLevel}
                        value={item ? item.level_recruitment.id : null}
                    />
                </View>
            )
        }
    }
    add_time_tho() {
        const key = this.props.navigation.state.params.key;
        if (key === constants.RECRUITER.WORKER_RECRUITER) {
            return (
                <View style={styles.viewThoStyle}>
                    <View style={styles.contentTimeStyle}>
                        <TitleContent text={R.strings.studentJobRecruitment.text_time_tho} textStyle={{ marginLeft: null }} />
                        <Switch
                            value={this.state.timeSwitch}
                            onValueChange={this.onTimeSwitch}
                            ios_backgroundColor={R.colors.grey400}
                            thumbColor={R.colors.white100}
                            trackColor={{ true: R.colors.orangeColor, false: null }}
                            style={{ transform: [{ scaleX: .8 }, { scaleY: .8 }] }}
                        />
                    </View>
                    {this.state.timeSwitch === true ? <InputTextContent
                        styleInput={{ width: '100%' }}
                        textRight={R.strings.studentJobRecruitment.text_right_time_tho}
                        placeholder={R.strings.studentJobRecruitment.text_time_placeholder_tho}
                        maxLength={2}
                        ref={ref => this.textProbationaryPeriod = ref}

                    /> : <View style={{ width: '100%', borderBottomColor: R.colors.greyColor, borderBottomWidth: 0.8 }}></View>}
                </View>
            )
        }
    }

    add_support_tho() {
        const key = this.props.navigation.state.params.key;
        if (key === constants.RECRUITER.WORKER_RECRUITER) {
            return (
                <View style={styles.viewThoStyle}>
                    <TitleContent text={R.strings.studentJobRecruitment.text_support_tho} textStyle={{ marginLeft: null }} />
                    <BaseInput
                        style={[styles.textinputStyle, { width: '100%' }]}
                        placeholder={R.strings.studentJobRecruitment.text_placeholder_support_tho}
                        value={this.state.support_mode}
                        onChangeText={this.onSupportMode}
                    />
                </View>
            )
        }
    }

    onTimeSwitch = () => {
        if (this.state.timeSwitch === true) {
            this.setState({ timeSwitch: false })
            this.textProbationaryPeriod.setValue('')
        } else {
            this.setState({ timeSwitch: true })
        }
    }

    onVacancies = (vacancies) => {
        this.setState({ vacancies })
    }

    onChangeStatusgetExperience = (value) => {
        this.setState({ experience_required: value.id })
    }
    onSupportMode = (support_mode) => {
        this.setState({ support_mode })
    }
    onTimeWork = (time_work) => {
        this.setState({ time_work })
    }
    onChangeStatusgetLevel = (value) => {
        this.setState({ level_recruitment_id: value.id })
    }

    onService = () => {
        const key = this.props.navigation.state.params.key;
        NavigationService.navigate('ClickServiceScreen', { keyScreen: constants.SERVICES.PostJobRecruitment, keyPost: key, keyDate: constants.SERVICES.getSpecialize });
    }

    render() {
        const { key, item } = this.props.navigation.state.params;
        const { vacancies, work_location, experience } = this.state;
        const service2 = this.props.navigation.state.params.service2;
        return (
            <Container>
                <Header
                    text={this.state.textHeader}
                />
                <ScrollView contentContainerStyle={styles.scStyle}>
                    <TitleContent text={R.strings.studentJobRecruitment.text_vacancies} />
                    <BaseInput
                        style={styles.textinputStyle}
                        placeholder={R.strings.studentJobRecruitment.text_placeholder_vancancies}
                        maxLength={256}
                        onChangeText={this.onVacancies}
                        value={vacancies}
                    />

                    {this.add_rank_tho()}

                    <TitleContent text={R.strings.studentJobRecruitment.text_work_location} />
                    <View style={styles.lociationStyle}>
                        <TouchableOpacity style={styles.btnLociation} onPress={this.onLocationPressed}>
                            <Text style={[styles.textLociationStyle, {
                                color: work_location === R.strings.studentJobRecruitment.text_click_map ? 'grey' : R.colors.grey900,
                            }]} numberOfLines={3}>{work_location}</Text>
                            <Icon name="map-marker-alt" size={20} style={styles.imgLociation} />
                        </TouchableOpacity>
                    </View>

                    <WageComponent
                        onPress={this.onWake}
                        wageActive={this.state.wageActive}
                    />
                    {this._render_slider()}
                    <View style={{ width: '90%', borderBottomColor: R.colors.greyColor, borderBottomWidth: 0.8, marginTop: 20 }}></View>

                    <SelectServiece
                        textLeft='Chọn ngành nghề'
                        textRight={service2 ? service2.name : null || item && item.service && item.service.length > 0 ? item.service[0].name : null}
                        onPress={this.onService}
                    />

                    <TitleContent text={R.strings.studentJobRecruitment.text_number_of_applications} />
                    <InputTextContent
                        ref={ref => this.textInputVacancies = ref}
                        textRight={key === constants.RECRUITER.STUDENT_RECRUITER ? R.strings.studentJobRecruitment.text_sv : R.strings.studentJobRecruitment.text_tho}
                        placeholder={R.strings.studentJobRecruitment.text_number_placeholder}
                    />

                    {this.add_time_tho()}

                    <TitleContent text={R.strings.studentJobRecruitment.text_experience_required} />
                    <View style={styles.DropdownExperience}>
                        <HGDropdown
                            label={''}
                            data={experience}
                            fontSize={16}
                            onChangeText={this.onChangeStatusgetExperience}
                            value={item ? item.experience.id : null}
                        />
                    </View>

                    {this.add_time_sv()}

                    {this.add_support_tho()}


                    <DateTimePicker
                        ref={ref => this.dateTimePicker = ref}
                    />

                    <TitleContent text={R.strings.studentJobRecruitment.text_description_of_work} />

                    <InputDescription
                        ref={ref => this.textInputDescription = ref}
                        multiline={true}
                        placeholder={key === constants.RECRUITER.STUDENT_RECRUITER ? R.strings.studentJobRecruitment.text_description_work_holder : R.strings.studentJobRecruitment.text_description_tho_holder}
                    />

                    <TitleContent text={R.strings.studentJobRecruitment.text_picture_description} />

                    <UploadImage
                        horizontal
                        uploadProgress={this.onUploadProgress}
                        ref={ref => this.imageUploadComponent = ref}
                        style={{ width: '95%' }}
                    />

                    <TitleContent text={R.strings.studentJobRecruitment.text_video_description} />
                    <UploadVideo
                        onDeleteVideo={this.onDeleteVideo}
                        url={this.state.url_video}
                        onPress={this.addVideo}
                    />
                    <LoadingButton
                        ref={c => (this.loadingButton = c)}
                        containerStyle={styles.btnPostNew}
                        text={!item && key ? R.strings.studentJobRecruitment.text_post_news : R.strings.studentJobRecruitment.text_update_new}
                        onPress={this.onPostNew}
                        backgroundColor={R.colors.orangeColor}
                    />

                    {this._render_modal_progress()}
                </ScrollView>
            </Container>
        );
    }

    onUploadProgress = (progress) => {
        this.progressUploadComponent.setProgress(progress);
    }

    onDeleteVideo = () => {
        this.setState({ url_video: '' })
    }

    _render_modal_progress() {
        return (
            <ModalProgressUpload
                ref={ref => this.progressUploadComponent = ref}
                titleUpload={R.strings.upgradeacc.hint_progress_upload}
            />
        )
    }

    onLocationPressed = () => {
        openAutocompleteModal().then(response => {
            this.setState({ place: response.place, work_location: response.place.address, city_name: response.city_name })
        }).catch(error => {
            return error;
        })
    }

    onWake = () => {
        this.setState({ wageActive: !this.state.wageActive })
    }

    addVideo = () => {
        const options = {
            title: 'Mô tả công việc',
            videoQuality: 'low',
            mediaType: 'video',
            durationLimit: 20,
        };
        ImagePicker.launchCamera(options, (response) => {
            this.postUploadVideo1(database.tokenCache, response, this.onUploadProgress)
        });
    }
    postUploadVideo1 = (tokenCache, response, onUploadProgress) => {
        postUploadVideo(tokenCache, response, onUploadProgress)
            .then(res => {
                this.setState({ url_video: res.data.videos[0] });
                this.onUploadProgress(0)
            })
            .catch(error => {
                this.onUploadProgress(0);
                return error;
            });
        this.onUploadProgress(0)

    }


    onPostNew = () => {
        const { key, service2, item, keyScreen } = this.props.navigation.state.params;
        const { vacancies, work_location, experience_required, wageActive,
            support_mode, time_work, level_recruitment_id, url_video, timeSwitch, place
        } = this.state;

        if (vacancies === '') {
            showMessage(R.strings.studentJobRecruitment.validate_vancancies);
            return;
        }
        if (work_location === R.strings.studentJobRecruitment.text_click_map) {
            showMessage(R.strings.studentJobRecruitment.validate_map);
            return;
        }
        if (!service2 && !item) {
            showMessage(R.strings.studentJobRecruitment.validate_service)
            return;
        }
        let number_vacancies = this.textInputVacancies.getValue();
        if (number_vacancies === '') {
            showMessage(R.strings.studentJobRecruitment.validate_number_of_applications);
            return;
        }
        if (number_vacancies < 1) {
            showMessage(R.strings.studentJobRecruitment.validate_number_of_applications_min);
            return;
        }

        if (key === constants.RECRUITER.WORKER_RECRUITER) {
            if (timeSwitch === true) {
                let probationary_period = this.textProbationaryPeriod.getValue();
                if (probationary_period === '') {
                    showMessage(R.strings.studentJobRecruitment.validate_time_tho);
                    return;
                }
                if (parseInt(probationary_period) === 0 || parseInt(probationary_period) > 12) {
                    showMessage(R.strings.studentJobRecruitment.validate_time_number_tho);
                    return;
                }
            }
        }
        let probationary_period = timeSwitch === true && key === constants.RECRUITER.WORKER_RECRUITER ? this.textProbationaryPeriod.getValue() : null;

        if (key === constants.RECRUITER.STUDENT_RECRUITER) {
            if (time_work === '') {
                showMessage(R.strings.studentJobRecruitment.validate_time_sv);
                return;
            }
        }

        if (key === constants.RECRUITER.WORKER_RECRUITER) {
            if (support_mode === '') {
                showMessage(R.strings.studentJobRecruitment.validate_support_tho);
                return;
            }
        }

        let expiration_date = this.dateTimePicker.getValue();
        if (expiration_date === '') {
            showMessage(R.strings.studentJobRecruitment.validate_deadline_time);
            return;
        }

        let description = this.textInputDescription.getValue();

        if (description === '') {
            showMessage(R.strings.studentJobRecruitment.validate_description);
            return;
        }
        if (description.length < 100) {
            showMessage(R.strings.studentJobRecruitment.validate_description_number);
            return;
        }

        let images = this.imageUploadComponent.getImage();

        if (images.length === 0) {
            showMessage(R.strings.studentJobRecruitment.validate_image);
            return;
        }


        let wage_min = this.state.wageActive ? `${this.slider.getMultiSliderValue()[0]}` : 0;
        let wage_max = this.state.wageActive ? `${this.slider.getMultiSliderValue()[1]}` : 0;


        let city_name = this.state.city_name;
        if (!city_name) city_name = "N/A";
        const name_city = place !== '' ? city_name : item.city_name;


        const lociationName = place !== '' ? place.address : item.work_location_name;
        const lociationLat = place !== '' ? `${place.latitude}, ${place.longitude}` : item.work_location_lat_lng;
        const service_id = service2 ? service2.id : item.service[0].id;
        const probationary = timeSwitch === true ? parseInt(probationary_period) : 0;

        this.loadingButton.show(true);

        if (!item) {
            postRecruitment(database.tokenCache, {
                id_user: database.user.id_users,
                vacancies,
                city_name: name_city,
                work_location_name: lociationName,
                work_location_lat_lng: lociationLat,
                service_id,
                wage_min,
                wage_max,
                number_vacancies: parseInt(number_vacancies),
                type: key === constants.RECRUITER.STUDENT_RECRUITER ? 0 : 1,
                experience_id: experience_required,
                support_mode,
                time_work,
                description,
                level_recruitment_id,
                probationary_period: key === constants.RECRUITER.STUDENT_RECRUITER ? 0 : probationary,
                expiration_date,
                url_image: images,
                url_video

            }).then(res => {
                if (res.code === Status.SUSSESS) {
                    showMessage(R.strings.studentJobRecruitment.text_post_news_done);
                    NavigationService.navigate("RecruitmentScreen")
                } else {
                    showMessage(R.strings.studentJobRecruitment.text_post_news_err);
                }
            }).catch(err => {
                showMessage(R.strings.studentJobRecruitment.text_post_news_err);
                return err;
            })
        } else {
            putUpdateRecruitment(database.tokenCache, item.id, {
                vacancies,
                city_name: name_city,
                work_location_name: lociationName,
                work_location_lat_lng: lociationLat,
                service_id,
                wage_min,
                wage_max,
                number_vacancies: parseInt(number_vacancies),
                type: key === constants.RECRUITER.STUDENT_RECRUITER ? 0 : 1,
                experience_id: experience_required,
                support_mode,
                time_work,
                description,
                level_recruitment_id,
                probationary_period: key === constants.RECRUITER.STUDENT_RECRUITER ? 0 : probationary,
                expiration_date,
                url_image: images,
                url_video
            }).then(res => {
                if (res.code === Status.SUSSESS) {
                    showMessage(R.strings.studentJobRecruitment.text_update_news_done);
                    NavigationService.navigate("ListNewsRecruimentScreen", { key: constants.RECRUITER.EDIT_JOB })
                } else {
                    showMessage(R.strings.studentJobRecruitment.text_update_news_err);
                }
            }).catch(err => {
                showMessage(R.strings.studentJobRecruitment.text_update_news_err);
                return err;
            })
        }
    }
}
const styles = StyleSheet.create({
    scStyle: {
        alignItems: 'center',
    },
    textinputStyle: {
        width: '90%',
        borderBottomColor: R.colors.greyColor,
        padding: null,
        paddingBottom: 5,
        paddingTop: 5,
    },
    lociationStyle: {
        borderBottomColor: R.colors.greyColor,
        borderBottomWidth: 0.8,
        width: '90%',
        marginTop: 5,
    },
    textLociationStyle: {
        fontSize: 14,
        paddingBottom: 5,
        marginRight: 5,
        width: '95%'
    },
    btnLociation: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
    },
    imgLociation: {
        marginBottom: 6,
        marginLeft: 2,
        color: R.colors.orangeColor,

    },
    sliderMoney: {
        width: '95%',
        height: 70,
    },
    btnPostNew: {
        backgroundColor: R.colors.orangeColor,
        marginTop: 20,
        marginBottom: 50,
        width: '90%',
        borderRadius: 20,
    },
    DropdownExperience: {
        width: '92%',
        marginTop: -10
    },
    viewThoStyle: {
        width: '90%',
        marginBottom: 10
    },
    contentTimeStyle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '90%',
        marginTop: 10
    }
})
