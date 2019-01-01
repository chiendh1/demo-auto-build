import React, { PureComponent } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import Container from 'libraries/components/Container';
import Header from 'libraries/components/Header';
import NavigationService from 'routers/NavigationService';
import BaseInput from 'libraries/components/BaseInput';
import HGDropdown from 'libraries/components/HGDropdown';
import BaseButtonOpacity from 'libraries/components/BaseButtonOpacity';
import R from 'res/R';
import Icon from 'react-native-vector-icons/Ionicons';
import SkillPerson from './SkillPerson';
import SwitchChoose from './switchChoose';
import TextInputContent from 'libraries/components/TextInputContent';
import constants from 'libraries/utils/constants';
import { getExperience, getOvertime } from 'libraries/networking/apis';
import database from 'libraries/utils/database';
import { Status } from 'libraries/networking/status';
import PlaceLocation from 'libraries/components/PlaceLocation';
import UploadImage from 'libraries/components/UploadImage';
import { editProfileOfMe, postProfile } from 'libraries/networking/apis';
import ModalProgressUpload from 'libraries/components/ModalProgressUpload';
import { showMessage, openAutocompleteModal } from 'libraries/utils/utils';
import LoadingButton from 'libraries/components/LoadingButton';

Array.prototype.insert = function (index, item) {
    this.splice(index, 0, item);
};

const { width } = Dimensions.get('window');

class WorkerAdvancedPortfolioScreen extends PureComponent {
    state = {
        text: '',
        experience: [],
        type: this.props.navigation.state.params.type,
        place: '',
        place1: '',
        city_name: '',
        city_name1: '',
        lat_lng: '',
        lat_lng1: '',
        level_recruitment_id: '',
        current_salary: '',
        position: '',
        desired_salary: '',
        skill: '',
        overtime: [],
        ability_overtime: '',
        image_product: [],
        image_forte: [],
        image_drawing: [],
        ability_manage: '',
        ability_workfar: '',
        textHeader: '',
        textButton: ''

    }
    componentDidMount() {
        this.createProfileWork();
    }

    async createProfileWork() {
        try {
            let experiences = await getExperience(database.tokenCache);
            if (experiences.code === Status.SUSSESS) {
                this.setState(prev => ({
                    ...prev,
                    experience: experiences.data.experiences,
                    level_recruitment_id: experiences.data.experiences[0].id
                }))
            }
        } catch (error) {
            return error;
        }
        try {
            let overtime = await getOvertime(database.tokenCache);
            if (overtime.code === Status.SUSSESS) {
                this.setState(prev => ({
                    ...prev,
                    overtime: overtime.overtime,
                    ability_overtime: overtime.overtime[0].id
                }))
            }
        } catch (error) {
            return error;
        }

        const { item, key } = this.props.navigation.state.params;
        const { type } = this.state;

        if (key === constants.CANDIDATE.WORKER_CANDIDATE) {
            this.setState({ textHeader: type === 'basic' ? R.strings.createBasicProfile.edit_portfolio_basic : R.strings.createBasicProfile.edit_portfolio_advanced })
        } else {
            this.setState({ textHeader: type === 'basic' ? R.strings.createBasicProfile.post_portfolio_basic : R.strings.createBasicProfile.post_portfolio_advanced })
        }

        if (key === constants.CANDIDATE.WORKER_CANDIDATE) {
            this.setState({ textButton: R.strings.createStudentPortfolio.edit_portfolio })
        } else {
            this.setState({ textButton: R.strings.createStudentPortfolio.post_portfolio })
        }

        if (item) {
            this.setState(prev => ({
                ...prev,
                position: item.position,
                level_recruitment_id: item.experience ? item.experience.id : null,
                current_salary: item.current_salary,
                desired_salary: item.desired_salary,
                place: item.address_current,
                lat_lng: item.lat_lng_current,
                city_name: item.city_current,
                place1: item.address_desired,
                lat_lng1: item.lat_lng_desired,
                city_name1: item.city_desired,
                skill: item.skill,
                ability_overtime: item.ability_overtime ? item.ability_overtime.id : null

            }))
            if (item.image_product) {
                this.imageUploadProductComponent.setImages(item.image_product.map(item => `${constants.BASE_URL}${item}`));
            }
            if (item.image_drawing) {
                this.imageUploadDrawingComponent.setImages(item.image_drawing.map(item => `${constants.BASE_URL}${item}`));
            }
            if (item.image_forte) {
                this.imageUploadFavoriteComponent.setImages(item.image_forte.map(item => `${constants.BASE_URL}${item}`));
            }
            if (item.ability_manage) {
                this.abilityManagement.setSwitchValue(item.ability_manage === 1 ? true : false)
            }
            if (item.ability_workfar) {
                this.abilityOnsite.setSwitchValue(item.ability_workfar === 1 ? true : false)
            }

        }
    }


    onService = () => {
        NavigationService.navigate('ClickServiceScreen', { keyScreen: constants.SERVICES.WorkerAdvanced });
    }

    onPosition = (position) => {
        this.setState({ position })
    }
    onExperience = (value) => {
        this.setState({ level_recruitment_id: value.id })
    }
    onOvertime = (value) => {
        this.setState({ ability_overtime: value.id })
    }
    onCurrentSalary = (current_salary) => {
        if (current_salary == '') current_salary = '0';
        this.setState({ current_salary: parseInt(current_salary.replace(/,/g, '')).toLocaleString() })
    }
    onDesiredSalary = (desired_salary) => {
        if (desired_salary == '') desired_salary = '0';
        this.setState({ desired_salary: parseInt(desired_salary.replace(/,/g, '')).toLocaleString() })
    }
    onSkill = (skill) => {
        this.setState({ skill })
    }
    _renderImage() {
        const { type } = this.state;
        if (type === 'advanced') {
            return (
                <View style={{ width: '100%' }}>

                    <Text style={styles.textImage}>{R.strings.createAdvancedProfile.text_image_product}</Text>
                    <UploadImage
                        horizontal
                        uploadProgress={this.onUploadProgress}
                        type={'product'}
                        ref={ref => this.imageUploadProductComponent = ref}
                    />

                    <Text style={styles.textImage}>{R.strings.createAdvancedProfile.text_image_product_favorite}</Text>

                    <UploadImage
                        horizontal
                        uploadProgress={this.onUploadProgress}
                        type={'favorite'}
                        ref={ref => this.imageUploadFavoriteComponent = ref}
                    />

                    <Text style={styles.textImage}>{R.strings.createAdvancedProfile.text_image_product_technical_drawings}</Text>

                    <UploadImage
                        horizontal
                        uploadProgress={this.onUploadProgress}
                        type={'drawing'}
                        ref={ref => this.imageUploadDrawingComponent = ref}
                    />
                </View>
            )
        }
        return null;
    }

    onUploadProgress = (progress) => {
        this.progressUploadComponent.setProgress(progress);
    }

    _renderAbility() {
        const { type } = this.state;
        if (type === 'advanced') {
            return (
                <View >
                    <Text style={styles.textExStyle}>{R.strings.createAdvancedProfile.ability_to_increase_shifts}</Text>
                    <HGDropdown
                        onChangeText={this.onOvertime}
                        label={''}
                        data={this.state.overtime}
                        value={this.state.ability_overtime}
                        containerStyle={{ marginHorizontal: 0, height: 40 }}
                    />

                    <SwitchChoose
                        ref={ref => this.abilityManagement = ref}
                        text={R.strings.createAdvancedProfile.text_ability_manager}
                        value={this.state.ability_manage}
                    />
                    <SwitchChoose
                        ref={ref => this.abilityOnsite = ref}
                        text={R.strings.createAdvancedProfile.text_ability_work_far}
                        value={this.state.ability_workfar}
                    />

                </View>
            )
        }
        return null;
    }

    onLeftPressed = () => {
        NavigationService.pop()
    }

    render() {
        const { service2, item } = this.props.navigation.state.params;
        const service = service2 ? service2 : (item ? item.service[0] : null);
        const { type } = this.state;
        const { key } = this.props.navigation.state.params;
        return (
            <Container>
                <Header
                    text={this.state.textHeader}
                    onLeftPressed={this.onLeftPressed}
                />
                <ScrollView >
                    <View style={styles.contentContainer}>

                        <Text style={styles.labelStyle}>{R.strings.createStudentPortfolio.position_expected}</Text>
                        <BaseInput
                            style={styles.inputStyle}
                            value={this.state.position}
                            onChangeText={this.onPosition}
                        />

                        <TouchableOpacity
                            onPress={this.onService}
                        >
                            <View style={styles.spacialView}>
                                <Text style={styles.labelService}>{R.strings.createBasicProfile.your_expertise}</Text>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Text style={styles.textService}>{service ? service.name : null}</Text>
                                    <Icon name="ios-arrow-forward" size={16} />
                                </View>
                            </View>
                        </TouchableOpacity>

                        <Text style={styles.textExStyle}>{R.strings.createStudentPortfolio.working_experenced}</Text>
                        <HGDropdown
                            onChangeText={this.onExperience}
                            containerStyle={{ marginHorizontal: 0 }}
                            label={''}
                            data={this.state.experience}
                            value={this.state.level_recruitment_id}
                        />

                        <Text style={styles.salaryStyle}>{R.strings.createBasicProfile.salary_position}</Text>
                        <TextInputContent
                            onChangeText={this.onCurrentSalary}
                            placeholder={R.strings.createStudentPortfolio.text_placeholder_disared_salary}
                            value={this.state.current_salary ? this.state.current_salary.toString() : ''}
                            maxLength={9}
                        />

                        <Text style={[styles.salaryStyle, { paddingTop: 10 }]}>{R.strings.createStudentPortfolio.salary_expected}</Text>
                        <TextInputContent
                            onChangeText={this.onDesiredSalary}
                            placeholder={R.strings.createStudentPortfolio.text_placeholder_disared_salary}
                            value={this.state.desired_salary.toString()}
                            maxLength={9}
                        />

                        {type === 'advanced' ? <PlaceLocation text={R.strings.createBasicProfile.curent_workplace}
                            place={this.state.place ? this.state.place : <Text style={styles.textPlace}>{R.strings.createBasicProfile.text_place_holder}</Text>}
                            onLocationPressed={this.onLocationPressed('curent')} /> : null}

                        <PlaceLocation
                            text={R.strings.createBasicProfile.working_location}
                            place={this.state.place1 ? this.state.place1 : <Text style={styles.textPlace}>{R.strings.createBasicProfile.text_place_holder}</Text>}
                            onLocationPressed={this.onLocationPressed('location')}
                        />

                        {this._renderImage()}

                        <SkillPerson
                            placeholder={R.strings.createAdvancedProfile.text_example}
                            value={this.state.skill}
                            onChangeText={this.onSkill}
                        />

                        {this._renderAbility()}

                        <View style={styles.viewBotton}>
                            {key === constants.CANDIDATE.WORKER_CANDIDATE ? null :
                                <BaseButtonOpacity
                                    containerStyle={styles.buttonLeftStyle}
                                    text={type === 'basic' ? R.strings.createBasicProfile.post_portfolio_advanced : R.strings.createBasicProfile.post_portfolio_basic}
                                    textStyle={styles.textStyleLeft}
                                    onPress={this.onCreateProfile}
                                />
                            }
                            {key === constants.CANDIDATE.WORKER_CANDIDATE ?
                                <LoadingButton
                                    ref={c => (this.loadingButton = c)}
                                    containerStyle={styles.buttonRightStyle1}
                                    width={width - 60}
                                    backgroundColor={R.colors.orangeColor}
                                    text={this.state.textButton}
                                    textStyle={styles.textStyleRight}
                                    onPress={this.onPostProfile}
                                /> :
                                <LoadingButton
                                    ref={c => (this.loadingButton = c)}
                                    containerStyle={styles.buttonRightStyle}
                                    width={width / 2 - 20}
                                    backgroundColor={R.colors.orangeColor}
                                    text={this.state.textButton}
                                    textStyle={styles.textStyleRight}
                                    onPress={this.onPostProfile}
                                />
                            }
                        </View>
                    </View>
                    {this._render_modal_progress()}
                </ScrollView>
            </Container>
        );
    }
    onCreateProfile = () => {
        const type = this.state.type === 'basic' ? 'advanced' : 'basic';
        this.setState({ type })
    }


    editProfile = () => {
        const { item, service2 } = this.props.navigation.state.params;
        const service = service2 ? service2 : (item ? item.service[0] : null);
        let ability_manage = null;
        let ability_workfar = null;

        const {
            type,
            position,
            level_recruitment_id,
            current_salary,
            desired_salary,
            place,
            place1,
            city_name,
            city_name1,
            lat_lng,
            lat_lng1,
            skill,
            ability_overtime,
            image_product,
            image_forte,
            image_drawing
        } = this.state;
        if (type === 'advanced') {
            ability_manage = this.abilityManagement.getSwitchValue();
            ability_workfar = this.abilityOnsite.getSwitchValue();
        }
        let current_workplace = {
            lat_lng,
            address_name: place,
            city_name
        }

        let desired_workplace = {
            lat_lng: lat_lng1,
            address_name: place1,
            city_name: city_name1
        }
        editProfileOfMe(database.tokenCache, {
            id: item.id,
            position: position,
            experience_id: level_recruitment_id,
            current_salary: current_salary,
            desired_salary: desired_salary,
            current_workplace,
            desired_workplace,
            service_id: service.id,
            image_product: image_product,
            image_forte: image_forte,
            image_drawing: image_drawing,
            skill: skill,
            ability_overtime_id: ability_overtime,
            ability_manage: ability_manage,
            ability_workfar: ability_workfar
        }).then(response => {

            if (response.code === Status.SUSSESS) {
                showMessage(R.strings.selectWorkerPortfolio.msg_edit_profile_success);

                if (this.props.navigation.state.params._ListProfile)
                    this.props.navigation.state.params._ListProfile();

                NavigationService.pop();
            }else{
                this.loadingButton.show(false);
            }
        }).catch(error => {
            return error;
        })
    }

    onPostProfile = () => {
        let { type, level_recruitment_id, current_salary, position, desired_salary, skill, ability_overtime, place, place1, lat_lng, lat_lng1, city_name, city_name1 } = this.state;
        if (position.length === 0) {
            showMessage(R.strings.createStudentPortfolio.msg_empty_position);
            return;
        }
        const { service2, item } = this.props.navigation.state.params;
        const service = service2 ? service2 : (item ? item.service[0] : null);
        if (!service) {
            showMessage(R.strings.createStudentPortfolio.msg_empty_specialize);
            return
        }
        // if (current_salary.length === 0) {
        //     showMessage(R.strings.createStudentPortfolio.msg_empty_current_salary);
        //     return;
        // }
        // if (current_salary.length > 7) {
        //     showMessage(R.strings.createStudentPortfolio.msg_empty_current_salary_length);
        //     return;
        // }
        // if (current_salary > 2000000) {
        //     showMessage(R.strings.createStudentPortfolio.msg_not_current_salary);
        //     return;
        // }

        if (desired_salary.length === 0) {
            showMessage(R.strings.createStudentPortfolio.msg_empty_desired_salary);
            return;
        }
        // if (desired_salary.length > 7) {
        //     showMessage(R.strings.createStudentPortfolio.msg_empty_desired_salary_length);
        //     return;
        // }
        if (desired_salary > 2000000) {
            showMessage(R.strings.createStudentPortfolio.msg_not_desired_salary);
            return;
        }
        let current_workplace = null;
        if (type === 'advanced') {
            if (!place) {
                showMessage(R.strings.createStudentPortfolio.msg_empty_place);
                return;
            }
            if (!city_name) city_name = "N/A";
            current_workplace = {
                lat_lng,
                address_name: place,
                city_name
            }
        }
        if (!place1) {
            showMessage(R.strings.createStudentPortfolio.msg_empty_place1);
            return;
        }
        let productImages = null;
        let favoriteImages = null;
        let drawingImages = null;

        if (type === 'advanced') {

            productImages = this.imageUploadProductComponent.getImage()
            favoriteImages = this.imageUploadFavoriteComponent.getImage()
            drawingImages = this.imageUploadDrawingComponent.getImage()

            // if (productImages.length === 0) {
            //     showMessage(R.strings.createStudentPortfolio.msg_image_product);
            //     return;
            // }
            // if (favoriteImages.length === 0) {
            //     showMessage(R.strings.createStudentPortfolio.msg_image_favorite);
            //     return;
            // }
            // if (drawingImages.length === 0) {
            //     showMessage(R.strings.createStudentPortfolio.msg_image_drawing);
            //     return;
            // }
        }
        // if (this.state.skill.length === 0) {
        //     showMessage(R.strings.createStudentPortfolio.msg_skill);
        //     return;
        // }
        // if (this.state.skill.length < 100) {
        //     showMessage(R.strings.createStudentPortfolio.msg_skill_length);
        //     return;
        // }

        let services = [service.id.toString()];

        let ability_manage = null;
        let ability_workfar = null;
        if (type === 'advanced') {
            ability_manage = this.abilityManagement.getSwitchValue();
            ability_workfar = this.abilityOnsite.getSwitchValue();
        }
        if (!city_name1) city_name = "N/A";
        let desired_workplace = {
            lat_lng: lat_lng1,
            address_name: place1,
            city_name: city_name1
        }

        this.loadingButton.show(true);
        if (item) {
            this.editProfile();
        } else {
            postProfile(
                database.tokenCache,
                {
                    user_id: database.user.id_users,
                    service_id: services,
                    type: type === 'basic' ? constants.ProfileType.Worker_Basic : constants.ProfileType.Worker_Advanced,
                    position: position,
                    current_workplace: current_workplace,
                    desired_workplace: desired_workplace,
                    experience_id: level_recruitment_id,
                    ability_overtime_id: type === 'advanced' ? ability_overtime : null,
                    desired_salary: desired_salary.replace(/,/g, ''),
                    current_salary: current_salary.replace(/,/g, ''),
                    skill: skill,
                    ability_manage,
                    ability_workfar,
                    image_product: productImages,
                    image_forte: favoriteImages,
                    image_drawing: drawingImages,
                }).then(response => {

                    if (response.code === Status.SUSSESS) {
                        NavigationService.pop();
                        showMessage(R.strings.selectWorkerPortfolio.msg_create_profile_success)
                    } else {
                        this.loadingButton.show(false);
                    }
                }).catch(error => {
                    return error;
                })
        }

    }

    onLocationPressed = (type) => () => {
        openAutocompleteModal().then(response => {
            if (type === 'curent') {
                this.setState({ place: response.place.address, lat_lng: `${response.place.latitude},${response.place.longitude}`, city_name: response.city_name })
            } else {
                this.setState({ place1: response.place.address, lat_lng1: `${response.place.latitude},${response.place.longitude}`, city_name1: response.city_name })
            }

        }).catch(error => {
            return error;
        })
    }

    _render_modal_progress() {
        return (
            <ModalProgressUpload
                ref={ref => this.progressUploadComponent = ref}
                titleUpload={R.strings.upgradeacc.hint_progress_upload}
            />
        )
    }


}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },

    contentContainer: {
        flex: 1,
        paddingHorizontal: 10,
        paddingBottom: 15
    },

    buttonLeftStyle: {
        width: '49%',
        marginTop: 20,
        backgroundColor: R.colors.white100,
        borderWidth: 1,
        borderColor: R.colors.orangeColor
    },
    buttonRightStyle: {
        marginTop: 20,
        borderRadius: 20,
    },
    buttonRightStyle1: {
        width: '100%',
        marginTop: 20,
        borderRadius: 20,
    },
    textStyleLeft: {
        fontSize: 16,
        color: R.colors.orangeColor,
        paddingRight: 7,
        paddingBottom: 4,
    },
    textStyleRight: {
        fontSize: 16,
        color: R.colors.white100,
        paddingRight: 7,
        paddingBottom: 4,
    },
    textExStyle: {
        marginBottom: -12,
        width: '100%',
        fontSize: 16,
        color: '#111111',
        marginTop: 10,
    },
    labelStyle: {
        fontSize: 16,
        color: '#111111',
        marginLeft: 5,
        marginTop: 10,
    },
    labelService: {
        fontSize: 16,
        color: '#111111',
    },
    inputStyle: {
        height: 30,
        width: '100%',
        paddingVertical: 3,
        padding: 0,
        marginBottom: 0,
        borderBottomColor: '#CCCCCC'
    },
    spacialView: {
        width: '100%',
        paddingVertical: 20,
        flexDirection: 'row',
        borderBottomWidth: 0.5,
        borderBottomColor: '#CCCCCC',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    textImage: {
        paddingTop: 10,
        fontSize: 16,
        color: '#111111',
    },
    salaryStyle: {
        fontSize: 16,
        color: '#111111',
        paddingTop: 2,
    },
    textPlace: {
        color: 'grey',
        fontSize: 14
    },
    viewBotton: {
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        paddingHorizontal: 5
    },
    textService: {
        fontSize: 13, 
        color: R.colors.orangeColor, 
        paddingRight: 10
    }
});
export default WorkerAdvancedPortfolioScreen;
