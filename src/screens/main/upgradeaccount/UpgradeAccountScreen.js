import { Status } from './../../../libraries/networking/status';
import React, { Component } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Container from 'libraries/components/Container';
import R from 'res/R';
import BaseInput from 'libraries/components/BaseInput';
import TitleContent from './TitleContent';
import UploadImageCMND from './UploadImageCMND';
import BaseButtonOpacity from 'libraries/components/BaseButtonOpacity';
import TabDismissKeyboard from 'libraries/components/TabDismissKeyboard';
import { showMessage, validateName, openAutocompleteModal } from 'libraries/utils/utils';
import Header from 'libraries/components/Header';
import { getImg } from 'libraries/components/GetImageAbum';
import NavigationService from 'routers/NavigationService';
import { postUploadImage } from 'libraries/networking/apis';
import database from 'libraries/utils/database';
import ModalProgressUpload from 'libraries/components/ModalProgressUpload';
import constants from 'libraries/utils/constants';
import Icon from 'react-native-vector-icons/FontAwesome5';
import UploadImage from 'libraries/components/UploadImage';
import SelectServiece from '../recruitment/recruiter/post_job_recruitment/SelectService';

Array.prototype.insert = function (index, item) {
    this.splice(index, 0, item);
};

export default class UpgradeAccountScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sourceImgCMND1: null,
            sourceImgCMND2: null,
            name: database.user.name,
            identityCard: '',
            progress: 0,
            work_location: R.strings.studentJobRecruitment.text_click_map,
            place: '',
            city_name: ''
        };
    }

    componentDidMount() {
        console.log(database.user)
    }

    onFullname = (name) => {
        this.setState({ name })
    }
    onCMND = (identityCard) => {
        this.setState({ identityCard })
    }
    onService = () => {
        NavigationService.navigate('ClickServiceScreen', { keyScreen: constants.SERVICES.UpgradeAcc });
    }
    render() {
        const { work_location } = this.state;
        const service2 = this.props.navigation.state.params.service2;

        return (
            <Container>
                <Header
                    text={R.strings.header.hint_upgrade_acc}
                />
                <TabDismissKeyboard>
                    <ScrollView style={styles.container}>
                        <TitleContent
                            text={R.strings.upgradeacc.hint_text_username}
                        />
                        <View style={styles.headerStyle}>
                            <BaseInput
                                placeholder={R.strings.upgradeacc.hint_text_username}
                                style={styles.inputStyle}
                                onChangeText={this.onFullname}
                                value={this.state.name}
                                maxLength={32}
                            />
                        </View>

                        <TitleContent
                            text={R.strings.upgradeacc.hint_title_address}
                        />
                        <View style={styles.lociationStyle}>
                            <TouchableOpacity style={styles.btnLociation} onPress={this.onLocationPressed}>
                                <Text style={[styles.textLociationStyle, {
                                    color: work_location === R.strings.studentJobRecruitment.text_click_map ? 'grey' : R.colors.grey900,
                                }]} numberOfLines={3}>{work_location}</Text>
                                <Icon name="map-marker-alt" size={20} style={styles.imgLociation} />
                            </TouchableOpacity>
                        </View>

                        <TitleContent
                            text={R.strings.upgradeacc.hint_text_input_cmnd}
                        />
                        <View style={styles.viewAlign}>
                            <BaseInput
                                placeholder={R.strings.upgradeacc.hint_text_input_cmnd}
                                style={styles.inputStyle}
                                keyboardType="number-pad"
                                onChangeText={this.onCMND}
                                value={this.state.identityCard}
                                maxLength={15}
                            />
                        </View>
                        <View style={{ alignItems: 'center' }}>
                            <SelectServiece
                                textLeft='Chọn chuyên môn'
                                textRight={service2 ? service2.name : null || database.user.specialize ? database.user.specialize.name : null}
                                onPress={this.onService}
                            />
                        </View>


                        <TitleContent
                            text={R.strings.upgradeacc.hint_title_img_cmnd}
                        />
                        <View style={styles.viewAlign}>
                            <UploadImageCMND
                                onImgCMND1={this.onImgCMND1}
                                onImgCMND2={this.onImgCMND2}
                                ondelIMG1={this.ondelIMG1}
                                ondelIMG2={this.ondelIMG2}
                                source1={this.state.sourceImgCMND1}
                                source2={this.state.sourceImgCMND2}
                            />
                        </View>
                        {this._renderTitle()}
                        <View style={styles.viewAlign}>
                            {this._renderImageSV()}
                        </View>
                        <View style={styles.viewAlign}>
                            <BaseButtonOpacity
                                containerStyle={styles.btnStyle}
                                text={R.strings.upgradeacc.hint_text_btn_done}
                                onPress={this.onCickbtn}
                            />
                        </View>

                        {this._render_modal_progress()}
                        {this._render_modal_progressSV()}
                    </ScrollView>
                </TabDismissKeyboard>
            </Container>
        );
    }
    onUploadProgress = (progress) => {
        this.progressUploadComponent.setProgress(progress);
    }


    _render_modal_progressSV() {
        return (
            <ModalProgressUpload
                ref={ref => this.progressUploadComponent = ref}
                titleUpload={R.strings.upgradeacc.hint_progress_upload}
            />
        )
    }


    _render_modal_progress() {
        return (
            <ModalProgressUpload
                titleUpload={R.strings.upgradeacc.hint_progress_upload}
                ref={ref => this.progressSV = ref}
            />
        )
    }

    uploadProgress = (progress) => {
        this.progressSV.setProgress(progress);
    }


    onLocationPressed = () => {
        openAutocompleteModal().then(response => {
            this.setState({ place: response.place, work_location: response.place.address, city_name: response.city_name })
        }).catch(error => {
            return error;
        })
    }



    _renderTitle() {
        const key = this.props.navigation.state.params.key;
        if (key === constants.upgradeAcc.KTS || key === constants.upgradeAcc.SV) {
            return <TitleContent text={R.strings.upgradeacc.hint_title_img_sv} />
        } else if (key === constants.upgradeAcc.NX || key === constants.upgradeAcc.NBS) {
            return <TitleContent text={R.strings.upgradeacc.hitn_title_img_khohang} />
        }
        return null;
    }

    _renderImageSV() {
        const key = this.props.navigation.state.params.key;
        if (key !== constants.upgradeAcc.THO) {
            return <UploadImage
                horizontal
                uploadProgress={this.onUploadProgress}
                ref={ref => this.imageUploadComponent = ref}
                style={{ width: '95%', marginLeft: 5 }}
            />
        } else {
            return null;
        }
    }

    onImgCMND1 = async () => {
        const source = await getImg();
        postUploadImage(database.tokenCache, source, this.uploadProgress).then(res => {
            if (res.code === Status.SUSSESS) {

                const uri = res.data.images[0]
                this.setState({ sourceImgCMND1: { uri } });
                this.uploadProgress(0);

            } else {
                this.uploadProgress(0);
                showMessage(R.strings.validate.msg_upload_image_error);
            }
        }).catch(err => {
            this.uploadProgress(0);
            showMessage(R.strings.validate.msg_upload_image_error);
        });
    }
    onImgCMND2 = async () => {
        const source = await getImg();
        postUploadImage(database.tokenCache, source, this.uploadProgress).then(res => {
            if (res.code === Status.SUSSESS) {
                const uri = res.data.images[0]
                this.setState({ sourceImgCMND2: { uri } });
                this.uploadProgress(0);
            } else {
                this.uploadProgress(0);
                showMessage(R.strings.validate.msg_upload_image_error);
            }
        }).catch(err => {
            this.uploadProgress(0);
            showMessage(R.strings.validate.msg_upload_image_error);
        });
    }
    ondelIMG1 = () => {
        this.setState({ sourceImgCMND1: null })
    }
    ondelIMG2 = () => {
        this.setState({ sourceImgCMND2: null })
    }
    onCickbtn = () => {
        const type = this.props.navigation.state.params.key;
        const { name, identityCard, sourceImgCMND1, sourceImgCMND2, place, work_location } = this.state;
        name.trimLeft().trimRight();
        if (!validateName(name)) {
            return;
        }
        if (work_location === R.strings.studentJobRecruitment.text_click_map) {
            showMessage(R.strings.validate.msg_provinces_space);
            return;
        }
        if (identityCard === '') {
            showMessage(R.strings.validate.msg_cmnd);
            return;
        }
        if (identityCard.length < 9) {
            showMessage(R.strings.validate.msg_text_cmnd);
            return;
        }

        const service2 = this.props.navigation.state.params.service2;
        if (!service2 && !database.user.specialize) {
            showMessage(R.strings.studentJobRecruitment.validate_service1)
            return;
        }

        if (sourceImgCMND1 === null && sourceImgCMND2 === null) {
            showMessage(R.strings.validate.msg_img_cmnd);
            return;
        }
        if (sourceImgCMND1 === null || sourceImgCMND2 === null) {
            showMessage(R.strings.validate.msg_img_2_cmnd);
            return;
        }
        let imagesSV = null;
        let uri = [];
        if (this.imageUploadComponent) {
            imagesSV = this.imageUploadComponent.getImage();
            if (type !== constants.upgradeAcc.THO) {
                if (imagesSV.length === 0) {
                    if (type === constants.upgradeAcc.KTS || type === constants.upgradeAcc.SV) {
                        showMessage(R.strings.validate.msg_img_sv);
                        return;
                    }
                    if (type === constants.upgradeAcc.NX || type === constants.upgradeAcc.NBS) {
                        showMessage(R.strings.validate.msg_img_nx);
                        return;
                    }
                    return;
                }
            }

            uri = imagesSV.map((item) => ({ "type": "additionImages", "url": item }));


        }


        let city_name = this.state.city_name;
        if (!city_name) city_name = "N/A";
        const name_city = city_name;
        const address = place.address;
        const lat_lng = `${place.latitude}, ${place.longitude}`;

        const frontCMND = sourceImgCMND1 ? { "type": "frontCMND", "url": sourceImgCMND1.uri } : null;
        const backCMND = sourceImgCMND2 ? { "type": "backCMND", "url": sourceImgCMND2.uri } : null;
        const images = [frontCMND, backCMND, ...uri];
        const specialize_id = service2 ? service2.id : database.user.specialize.id;

        NavigationService.navigate('SelectServiceScreen', { name, identityCard, type, images, name_city, address, lat_lng, specialize_id });
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: R.colors.white100,
        paddingVertical: 5
    },
    viewAlign: {
        alignItems: 'center',
    },
    headerStyle: {
        alignItems: 'center',
    },
    textHeader: {
        color: R.colors.orangeColor,
        fontSize: 17,
        marginTop: 20,
    },
    inputStyle: {
        marginTop: 10,
        borderBottomColor: R.colors.greyColor,
        width: "90%",
        padding: 0,
        paddingBottom: 5
    },
    btnStyle: {
        width: '90%',
        backgroundColor: R.colors.orangeColor,
        marginBottom: 50,
        marginTop: 50
    },
    textLociationStyle: {
        fontSize: 14,
        paddingBottom: 5,
        marginRight: 5,
        width: '95%',
        marginLeft: 2
    },
    btnLociation: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10
    },
    imgLociation: {
        marginBottom: 6,
        marginLeft: 2,
        color: R.colors.orangeColor,
    },
    lociationStyle: {
        borderBottomColor: R.colors.greyColor,
        borderBottomWidth: 0.8,
        alignItems: 'center',
        marginHorizontal: '5%',
    },
})