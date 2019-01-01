import React, { Component } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import Header from 'libraries/components/Header';
import BaseInput from 'libraries/components/BaseInput';
import HGDropdown from 'libraries/components/HGDropdown';
import Container from 'libraries/components/Container';
import R from 'res/R';
import { getLevel, getExperience, editProfileOfMe, postProfile } from 'libraries/networking/apis';
import database from 'libraries/utils/database';
import { Status } from 'libraries/networking/status';
import PlaceLocation from 'libraries/components/PlaceLocation';
import TextInputContent from 'libraries/components/TextInputContent';
import constants from 'libraries/utils/constants';
import NavigationService from 'routers/NavigationService';
import Icon from 'react-native-vector-icons/Ionicons';
import { showMessage, openAutocompleteModal } from 'libraries/utils/utils';
import LoadingButton from 'libraries/components/LoadingButton';


class CreateStudentPortfolioScreen extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            level: [],
            career: [],
            experience: [],
            position: '',
            current_level_id: '',
            desired_level_id: '',
            place: '',
            level_recruitment_id: '',
            desired_salary: '',
            city_name: '',
            lat_lng: null,
            textHeader: '',
            textButton: ''
        };
    }
    componentDidMount() {
        this._ismounted = true;
        this.getData();

    }

    componentWillUnmount() {
        this._ismounted = false;
     }
    async getData() {
        try {
            let levels = await getLevel(database.tokenCache);
            if (levels.code === Status.SUSSESS) {
                if( !this._ismounted) return;
                this.setState(prev => ({
                    ...prev,
                    level: levels.data.levels,
                    desired_level_id: levels.data.levels[0].id,
                    current_level_id: levels.data.levels[0].id,
                }))
            }

        } catch (error) {
            return error;
        }

        try {
            let experience = await getExperience(database.tokenCache);
            if (experience.code === Status.SUSSESS) {
                if( !this._ismounted) return;
                this.setState(prev => ({
                    ...prev,
                    experience: experience.data.experiences,
                    level_recruitment_id: experience.data.experiences[0].id,
                }))
            }
        } catch (error) {
            return error;
        }


        const { item, key } = this.props.navigation.state.params;

        if (key === constants.CANDIDATE.STUDENT_CANDIDATE) {
            this.setState({ textHeader: R.strings.createStudentPortfolio.label_edit_portfolio })

        } else {
            this.setState({ textHeader: R.strings.createStudentPortfolio.label_create_portfolio })
        }

        if (key === constants.CANDIDATE.STUDENT_CANDIDATE) {
            this.setState({ textButton: R.strings.createStudentPortfolio.edit_portfolio })

        } else {
            this.setState({ textButton: R.strings.createStudentPortfolio.post_portfolio })
        }

        if (item) {
            this.setState(prev => ({
                position: item.position,
                current_level_id: item.current_level.id,
                desired_level_id: item.desired_level.id,
                place: item.address_desired,
                level_recruitment_id: item.experience.id,
                desired_salary: item.desired_salary,
                lat_lng: item.lat_lng_desired,
                city_name: item.city_desired
            }))
        }

    }
    onPosition = (position) => {
        this.setState({ position })
    }
    onPositionCurrent = (value) => {
        this.setState({ current_level_id: value.id })
    }
    onDesiredLevel = (value) => {
        this.setState({ desired_level_id: value.id });
    }
    onExperenced = (value) => {
        this.setState({ level_recruitment_id: value.id });
    }
    onSalaryExpected = (desired_salary) => {
        if(desired_salary == '') desired_salary = '0';
        this.setState({ desired_salary: parseInt(desired_salary.replace(/,/g, '')).toLocaleString() })
    }
    onService = () => {
        NavigationService.navigate('ClickServiceScreen', { keyScreen: constants.SERVICES.WorkerStudent });
    }
    render() {
        const { service2, item } = this.props.navigation.state.params;
        const service = service2 ? service2 : (item ? item.service[0] : null);
        return (
            <Container>
                <Header
                    text={this.state.textHeader}
                />

                <ScrollView style={styles.contentContainer}>

                    <Text style={styles.labelStyle}>{R.strings.createStudentPortfolio.position_expected}</Text>
                    <BaseInput
                        style={styles.inputStyle}
                        value={this.state.position}
                        onChangeText={this.onPosition}
                    />

                    <Text style={styles.textStyle}>{R.strings.createStudentPortfolio.current_position}</Text>
                    <HGDropdown
                        onChangeText={this.onPositionCurrent}
                        label={''}
                        value={this.state.current_level_id}
                        data={this.state.level}
                    />

                    <Text style={[styles.textStyle, { marginTop: 5 }]}>{R.strings.createStudentPortfolio.level_expected}</Text>
                    <HGDropdown
                        onChangeText={this.onDesiredLevel}
                        label={''}
                        value={this.state.desired_level_id}
                        data={this.state.level}
                    />

                    <TouchableOpacity
                        onPress={this.onService}
                    >
                        <View style={styles.spacialView}>
                            <View style={styles.viewCaare}>
                                <Text style={styles.labelCaarer}>{R.strings.createStudentPortfolio.career_expected}</Text>
                                <Icon name="ios-arrow-forward" size={16} style={{ paddingTop: 2 }} />
                            </View>
                            <Text style={styles.serviceStyle}>{service ? service.name : null}</Text>
                        </View>
                    </TouchableOpacity>

                    <PlaceLocation
                        style={{marginLeft: 5}}
                        text={R.strings.createStudentPortfolio.working_location}
                        place={this.state.place ? this.state.place : <Text style={{ color: R.colors.grey500, fontSize: 14 }}>{R.strings.createBasicProfile.text_place_holder}</Text>}
                        onLocationPressed={this.onLocationPressed}
                    />

                    <Text style={styles.textStyle}>{R.strings.createStudentPortfolio.working_experenced}</Text>
                    <HGDropdown
                        onChangeText={this.onExperenced}
                        value={this.state.level_recruitment_id}
                        label={''}
                        data={this.state.experience}
                    />

                    <Text style={styles.salaryStyle}>{R.strings.createStudentPortfolio.salary_expected}</Text>




                    <TextInputContent
                        onChangeText={this.onSalaryExpected}
                        placeholder={R.strings.createStudentPortfolio.text_placeholder_disared_salary}
                        value={this.state.desired_salary.toString()}
                        maxLength={9}
                    />

                    <LoadingButton
                        ref={c => (this.loadingButton = c)}
                        containerStyle={styles.buttonStyle}
                        backgroundColor={R.colors.orangeColor}
                        text={this.state.textButton}
                        onPress={this.onProfile}
                    />

                </ScrollView>
            </Container>
        );
    }

    editProfile = () => {
        const { item, service2 } = this.props.navigation.state.params;
        const {
            position,
            current_level_id,
            desired_level_id,
            place,
            level_recruitment_id,
            desired_salary,
            city_name,
            lat_lng
        } = this.state;
        const service = service2 ? service2 : (item ? item.service[0] : null);
        let desired_workplace = {
            lat_lng,
            address_name: place,
            city_name
        }
        editProfileOfMe(database.tokenCache, {
            id: item.id,
            position: position,
            current_level_id: current_level_id,
            desired_level_id: desired_level_id,
            service_id: [service.id.toString()],
            desired_workplace,
            experience_id: level_recruitment_id,
            desired_salary: desired_salary,
        }).then(response => {
            
            if (response.code === Status.SUSSESS) {
                showMessage(R.strings.selectWorkerPortfolio.msg_edit_profile_success);

                if (this.props.navigation.state.params._ListProfile)
                    this.props.navigation.state.params._ListProfile();

                NavigationService.pop();
            } else {
                this.loadingButton.show(false);
            }
        })

    }

    onProfile = () => {
        if (this.state.position.length === 0) {
            showMessage(R.strings.createStudentPortfolio.msg_empty_position);
            return;
        }

        const { service2, item } = this.props.navigation.state.params;
        const service = service2 ? service2 : (item ? item.service[0] : null);
        if (!service) {
            showMessage(R.strings.createStudentPortfolio.msg_empty_desired_trades);
            return
        }

        if (!this.state.place) {
            showMessage(R.strings.createStudentPortfolio.msg_empty_place);
            return;
        }
        if (this.state.desired_salary.length === 0) {
            showMessage(R.strings.createStudentPortfolio.msg_empty_desired_salary);
            return;
        }
        if (this.state.desired_salary > 2000000) {
            showMessage(R.strings.createStudentPortfolio.msg_not_desired_salary);
            return;
        }


        let { level_recruitment_id, desired_salary, position, current_level_id, desired_level_id, lat_lng, place } = this.state;

        let services = [service.id.toString()];

        let city_name = this.state.city_name;
        if (!city_name) city_name = "N/A";
        let desired_workplace = {
            lat_lng,
            address_name: place,
            city_name
        }
        this.loadingButton.show(true);
        if (item) {
            this.editProfile();
        } else {
            postProfile(
                database.tokenCache,
                {
                    user_id: database.user.id_users,
                    type: constants.ProfileType.Student,
                    position: position,
                    current_level_id: current_level_id,
                    desired_level_id: desired_level_id,
                    service_id: services,
                    desired_workplace: desired_workplace,
                    experience_id: level_recruitment_id,
                    desired_salary: desired_salary.replace(/,/g, ''),

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


    onLocationPressed = () => {

        openAutocompleteModal().then(response => {
            this.setState({ place: response.place.address, lat_lng: `${response.place.latitude},${response.place.longitude}`, city_name: response.city_name })
        }).catch(error => {
            return error;
        })
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },

    contentContainer: {
        paddingHorizontal: 10,
    },

    buttonStyle: {
        width: '100%',
        marginVertical: 50,
    },

    labelStyle: {
        fontSize: 16,
        color: '#111111',
        marginTop: 13,
        marginLeft: 5
    },
    labelCaarer: {
        fontSize: 16,
        color: '#111111',
    },

    inputStyle: {
        width: '97%',
        height: 35,
        fontSize: 16,
        borderBottomWidth: 0.5,
        borderBottomColor: '#CCCCCC',
        marginHorizontal: 5,
        paddingVertical: 3,
        padding: 0,
        marginBottom: 0
    },
    containerStyle: {
        marginTop: 10
    },
    spacialView: {
        borderBottomWidth: 0.5,
        borderBottomColor: '#CCCCCC',
        marginHorizontal: 5,
        marginTop: 5,
    },
    textStyle: {
        marginBottom: -12,
        fontSize: 16,
        color: '#111111',
        marginTop: 15,
        marginLeft: 5
    },
    viewCaare: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    serviceStyle: {
        fontSize: 16,
        color: R.colors.orangeColor,
        paddingVertical: 5
    },
    salaryStyle: {
        fontSize: 16,
        color: '#111111',
        marginLeft: 5,
        marginTop: 5
    },

});

export default CreateStudentPortfolioScreen;
