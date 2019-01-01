import React, { PureComponent } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import Container from 'libraries/components/Container';
import Header from 'libraries/components/Header';
import R from 'res/R';
import SelectServiecCompnent from './SelectServiceComponent';
import NavigationService from 'routers/NavigationService';
import BaseButtonOpacity from 'libraries/components/BaseButtonOpacity';
import ModalSignInDone from './ModalSignInDone';
import SliderComponent from 'libraries/components/SliderComponent';
import { putUpdateInfo } from 'libraries/networking/apis';
import database from 'libraries/utils/database';
import { showMessage } from 'libraries/utils/utils';
import constants from 'libraries/utils/constants';
import { Status } from 'libraries/networking/status';
import { connect } from 'react-redux';
import { onFetchUser } from '../../../redux/actions';
import Icon from 'react-native-vector-icons/Ionicons';
class SelectServiceScreen extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            isVisible: false,
            hide: true,
        };
    }


    componentDidMount() {
        this.getValueSlider();
    }

    getValueSlider() {
        this.slider.setSteep(1000000, 1000000, 100000000);
        this.slider.setSliderValue(1000000, 100000000);
    }

    componentDidUpdate() {
        if (!this.state.hide) {
            this.slider2.setSteep(1000000, 1000000, 100000000);
            this.slider2.setSliderValue(1000000, 100000000);
        }
    }

    render() {
        const { service1 } = this.props.navigation.state.params;
        return (
            <Container>
                <View style={styles.container}>
                    <Header
                        text={R.strings.header.hint_select_serviec}
                    />
                    <ScrollView contentContainerStyle={styles.scStyle}>
                        {this._render_modal()}
                        <View style={styles.contentStyle}>
                            <View style={styles.viewHeader}>
                                <Text style={styles.txtHeader}>{R.strings.selectService.header_select_service}</Text>
                            </View>
                            <View style={styles.sliderStyle}>
                                <View style={styles.styleSlider}>
                                    <SelectServiecCompnent
                                        textLeft={this.state.hide === true ? R.strings.selectService.hint_service_0 : R.strings.selectService.hint_service_1}
                                        textRight={service1 ? service1.name : ""}
                                        onPress={this.onService1}
                                    />
                                    <SliderComponent
                                        ref={(ref) => this.slider = ref}
                                        sliderLength={Platform.OS === 'ios' ? 280 : 250}
                                    />
                                </View>
                                <View style={styles.viewSlider2Style}>
                                    {this._render_service_2()}
                                </View>
                            </View>
                        </View>

                        <View style={styles.viewBtn}>
                            <BaseButtonOpacity
                                onPress={this.onDone}
                                text={R.strings.selectService.btn_done}
                                containerStyle={styles.btnStyle}
                            />
                        </View>
                    </ScrollView>
                </View>
            </Container>
        )
    }
    _render_service_2() {
        const { service2 } = this.props.navigation.state.params;
        if (!this.state.hide) {
            return (
                <View style={styles.styleSlider}>
                    <View style={styles.viewCloseService2}>
                        <TouchableOpacity style={styles.btnCloseService2} onPress={this.onCloseService}>
                            <Icon name="ios-close" size={35} color={R.colors.grey700} />
                        </TouchableOpacity>
                    </View>
                    <SelectServiecCompnent
                        textLeft={R.strings.selectService.hint_service_2}
                        textRight={service2 ? service2.name : ''}
                        onPress={this.onService2}
                    />
                    <SliderComponent
                        ref={(ref) => this.slider2 = ref}
                        sliderLength={Platform.OS === 'ios' ? 280 : 250}
                    />
                </View>
            )
        } else {
            return (
                <View style={styles.viewAddSer}>
                    <TouchableOpacity style={styles.addService} onPress={this.onAddservice}>
                        <Text style={styles.textAddSer}>{R.strings.selectService.hint_add_service}</Text>
                    </TouchableOpacity>
                </View>
            )
        }
    }


    _render_modal() {
        return (
            <ModalSignInDone
                isVisible={this.state.isVisible}
                onSee={this.onSee}
                onHave={this.onHave}
            />
        )
    }

    onAddservice = () => {
        this.setState({ hide: false })
    }

    onCloseService = () => {
        this.props.navigation.setParams({ service2: {} });
        this.setState({ hide: true })
    }


    onSee = () => {
        this.setState({ isVisible: false }), NavigationService.navigate("DetailStarScreen", { key: constants.upgradeAcc.DONE })
    }
    onHave = () => {
        this.setState({ isVisible: false }), NavigationService.navigate("MyHGScreen")
    }
    onService1 = () => {
        const { service2 } = this.props.navigation.state.params;
        NavigationService.navigate('ClickServiceScreen', { key: R.strings.selectService.hint_service_1, id: service2 ? service2.id : null, keyScreen: constants.SERVICES.SelectService1 })
    }
    onService2 = () => {
        const { service1 } = this.props.navigation.state.params;
        NavigationService.navigate('ClickServiceScreen', { key: R.strings.selectService.hint_service_2, id: service1 ? service1.id : null, keyScreen: constants.SERVICES.SelectService2 })
    }
    onDone = () => {
        const { name, images, identityCard, name_city, address, lat_lng, service1, service2, type, specialize_id } = this.props.navigation.state.params;
        if (!service1) {
            showMessage(R.strings.validate.msg_service_1)
            return;
        }
        if (!this.state.hide) {
            if (!service2) {
                showMessage(R.strings.validate.msg_service_2);
                return;
            }
            if (!service2.id) {
                showMessage(R.strings.validate.msg_service_2);
                return;
            }
        }
        const service11 = {
            id_service: service1.id,
            price_min: this.slider.getMultiSliderValue()[0],
            price_max: this.slider.getMultiSliderValue()[1],
        }

        let services = [service11];
        if (!this.state.hide) {
            if (service2) {
                const service22 = {
                    id_service: service2 ? service2.id : null,
                    price_min: this.slider2.getMultiSliderValue()[0],
                    price_max: this.slider2.getMultiSliderValue()[1],
                }
                services.push(service22);
            }
        }

        putUpdateInfo(database.user.id_users, database.tokenCache, type, name, address, name_city, lat_lng, services, images, identityCard, specialize_id)
            .then((res) => {
                if (res.code === Status.SUSSESS) {
                    this.setState({ isVisible: true });
                    return;
                } else {
                    showMessage(R.strings.upgradeacc.text_upgrade_err);
                    return;
                }
            }).catch(error => {
                return error;
            })
    }
}


const mapDispatchToProps = dispatch => {
    return {
        onFetchUser: () => dispatch(onFetchUser(database.user.id_users, database.tokenCache)),
    }
}
export default connect(null, mapDispatchToProps)(SelectServiceScreen);
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9f9f9',
        justifyContent: 'space-between'
    },
    contentStyle: {
        flex: 1,
    },
    viewHeader: {
        alignItems: 'center',
    },
    txtHeader: {
        textAlign: 'center',
        color: R.colors.orangeColor,
        fontSize: 16,
        width: '85%',
        fontWeight: Platform.OS === 'ios' ? '500' : '300',
        marginTop: 10,
        marginBottom: 10,
    },
    scStyle: {
        flex: 1,
        justifyContent: 'space-between',
        flexDirection: 'column',
    },
    viewAddSer: {
        alignItems: 'center'
    },
    viewBtn: {
        alignItems: 'center',
        marginBottom: 70,
        marginTop: 70
    },
    btnStyle: {
        backgroundColor: R.colors.orangeColor
    },
    sliderStyle: {
        marginTop: 5,
        marginBottom: 5,
        flex: 1,
    },
    styleSlider: {
        flex: 1,
        backgroundColor: R.colors.white100,
        paddingBottom: -20,
        width: '100%'
    },
    viewSlider2Style: {
        flex: 1,
        marginTop: 10,
        alignItems: 'center',
    },
    addService: {
        borderColor: R.colors.grey700,
        borderWidth: 0.5,
        width: 200,
        borderRadius: 20,
        borderStyle: "dashed",
        marginTop: 10,
        marginBottom: 5,
        alignItems: 'center',
    },
    textAddSer: {
        textAlign: 'center',
        fontSize: 18,
        color: R.colors.orangeColor,
        paddingTop: 4,
        paddingBottom: 4,
    },
    viewCloseService2: {
        alignContent: 'flex-end',
        alignItems: 'flex-end',
        marginBottom: -10,
        marginTop: -2,
        paddingBottom: 4,
    },
    btnCloseService2: {
        alignItems: 'flex-end',
        alignContent: 'flex-end',
        paddingRight: 20,
        paddingLeft: 20,
    }
})