import React, { Component } from 'react';
import { View, Text, StyleSheet, Platform, Dimensions, TouchableOpacity, FlatList, ScrollView } from 'react-native';
import Container from 'libraries/components/Container';
import Header from 'libraries/components/Header';
import R from 'res/R';
import SliderComponent, { MIN_VALUE, MAX_VALUE } from 'libraries/components/SliderComponent';
import AddressDropdown from 'screens/main/upgradeaccount/AddressDropdown';
import SwitchChoose from '../worker/create_portfolio/worker/switchChoose';
import NavigationService from 'routers/NavigationService';
import constants from 'libraries/utils/constants';
import Icon from 'react-native-vector-icons/Ionicons';
import BaseButtonOpacity from 'libraries/components/BaseButtonOpacity';
import { getTypeProfile } from 'libraries/networking/apis';
import database from 'libraries/utils/database';
import { Status } from 'libraries/networking/status';
import { showMessage } from 'libraries/utils/utils';

const { width } = Dimensions.get('window');


Array.prototype.insert = function (index, item) {
    this.splice(index, 0, item);
};

export default class SearchFilterScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            provincer: '',
            data: [],
            activeWage: true,
            activeLociation: false,
            activeService: false,
            page: 0,
        };
    }

    componentWillReceiveProps(props) {

        if (!this.props.navigation.state.params || props.navigation.state.params.service2 !== this.props.navigation.state.params.service2) {
            let data = this.state.data;
            data.push(props.navigation.state.params.service2);
            this.setState({ data })
        }

    }

    componentDidMount() {
        this.switchSlider.setSwitchValue(true)
    }

    _render_slider() {
        if (this.state.activeWage === true) {
            return (
                <SliderComponent
                    ref={(ref) => this.slider = ref}
                    sliderLength={Platform.OS === 'ios' ? 280 : 250}
                />
            )
        }
    }
    _render_address() {
        if (this.state.activeLociation === true) {
            return (
                <View style={styles.viewAddress}>
                    <AddressDropdown
                        hideDistrict={true}
                        hideWard={true}
                        provincer={(value) => this.setState({ provincer: value })}
                    />
                </View>
            )
        }
    }

    _render_service() {
        if (this.state.activeService === true) {
            return (
                <View style={{ alignItems: 'center' }}>
                    <TouchableOpacity onPress={this.onService} style={styles.btnSelectService}>
                        <Text style={styles.textSelectService}>{R.strings.searchFilter.text_select_service}</Text>
                    </TouchableOpacity>
                </View>

            )
        }
    }

    render() {
        return (
            <Container>
                <Header
                    text={R.strings.header.hint_search_filter}
                />
                <ScrollView style={styles.containerStyle}>
                    <View style={[styles.viewSlider, { height: this.state.activeWage === true ? 150 : 'auto' }]}>
                        <SwitchChoose
                            text={R.strings.searchFilter.text_wage}
                            textStyle={styles.textHeaderSlider}
                            styleContainer={styles.switchStyle}
                            ref={ref => this.switchSlider = ref}
                            onChange={(value) => { this.onSlider(value) }}
                        />
                        {this._render_slider()}
                    </View>
                    <View style={styles.locationStyle}>
                        <SwitchChoose
                            ref={ref => this.locationSwitch = ref}
                            text={R.strings.searchFilter.text_address}
                            textStyle={styles.textHeaderSlider}
                            styleContainer={styles.switchStyle}
                            onChange={(value) => { this.onLociation(value) }}
                        />
                        {this._render_address()}
                    </View>
                    <View style={styles.tagView}>
                        <SwitchChoose
                            ref={ref => this.serviceSwitch = ref}
                            text={R.strings.searchFilter.text_career}
                            textStyle={styles.textHeaderSlider}
                            styleContainer={styles.switchStyle}
                            onChange={(value) => { this.onTagView(value) }}
                        />
                        {this._render_service()}
                        {this._renderFlatList()}
                    </View>
                    <View style={styles.viewbtnStyle}>
                        <BaseButtonOpacity
                            name='redo'
                            text={R.strings.searchFilter.text_reset}
                            containerStyle={styles.btnLeftStyle}
                            textStyle={{ color: R.colors.orangeColor }}
                            color={R.colors.orangeColor}
                            onPress={this.onReset}
                        />
                        <BaseButtonOpacity
                            name='check'
                            text={R.strings.searchFilter.text_done}
                            containerStyle={styles.btnRightStyle}
                            color={R.colors.white100}
                            onPress={this.onDone}
                        />
                    </View>
                </ScrollView>
            </Container>
        );
    }

    _renderFlatList() {
        if (this.state.activeService === true) {
            const { data } = this.state;
            if (data.length > 0) {
                return <FlatList
                    data={data}
                    keyExtractor={(item, index) => index.toString()}
                    extraData={this.state}
                    renderItem={this._renderItem}
                />
            }
            return null;
        }
    }

    _renderItem = ({ item, index }) => {
        return (
            <View style={styles.viewService} key={index}>
                <Text style={styles.textService}>{R.strings.searchFilter.text_hint_service} {index + 1}: {item.name}</Text>
                <TouchableOpacity onPress={() => { this.onDelService(item) }}>
                    <Icon name='ios-close' size={28} />
                </TouchableOpacity>
            </View>
        )
    }
    onService = () => {
        NavigationService.navigate('ClickServiceScreen', { keyScreen: constants.SERVICES.SearchFilter, data: this.state.data });
    }
    onDelService = (index) => {
        let data = this.state.data;
        data.splice(index, 1)
        this.setState({ data })
    }

    onSlider = (value) => {
        if (this.state.activeWage === true) {
            this.setState({ activeWage: value })
        } else {
            this.setState({ activeWage: value })
        }
    }

    onLociation = (value) => {
        if (this.state.activeLociation === true) {
            this.setState({ activeLociation: value })
        } else {
            this.setState({ activeLociation: value })
        }
    }
    onTagView = (value) => {
        if (this.state.activeService === true) {
            this.setState({ activeService: value })
        } else {
            this.setState({ activeService: value, data: [] })
        }
    }
    onReset = (value) => {
        if (this.slider) this.slider.setSliderValue(MIN_VALUE, MAX_VALUE);
        if (this.switchSlider) this.switchSlider.setSwitchValue(true)
        if (this.serviceSwitch) this.serviceSwitch.setSwitchValue(false)
        if (this.locationSwitch) this.locationSwitch.setSwitchValue(false)
        this.setState({
            provincer: '',
            data: [],
            activeWage: true,
            activeLociation: false,
            activeService: false,
        })
    }

    onDone = () => {
        let { provincer, activeLociation, activeService, activeWage, data } = this.state;

        if (!activeLociation && !activeService && !activeWage) {
            showMessage(R.strings.searchFilter.msg_select_at_least)
            return
        }

        let service_id = data.map(item => item.id).toString();

        let salary = null;
        if (activeWage) {
            salary = {
                salary_min: this.slider.getMultiSliderValue()[0],
                salary_max: this.slider.getMultiSliderValue()[1]
            }
        }
        let cityName = null;
        if (activeLociation) {
            cityName = provincer.indexOf("Thành phố ") === 0 ? provincer.replace("Thành phố ", "") : provincer.replace("Tỉnh ", "");
        }
        const filterData = {
            service_id,
            cityName,
            salary
        }
        NavigationService.navigate('ListProfileSearch', { filterData, routeKey: constants.RECRUITER.ALL })
    }

}
const styles = StyleSheet.create({
    containerStyle: {
        flex: 1,
        backgroundColor: R.colors.spaceColor
    },
    viewSlider: {
        backgroundColor: R.colors.white100,
        marginTop: 12,
        marginBottom: 12
    },
    switchStyle: {
        borderBottomWidth: null,
        borderColor: null,
    },
    textHeaderSlider: {
        color: R.colors.grey900,
        fontWeight: '500',
        fontSize: 16,
        paddingLeft: 10,
        marginBottom: Platform.OS === 'ios' ? 5 : null,
        marginTop: -5
    },
    locationStyle: {
        backgroundColor: R.colors.white100,
        width: '100%',
        height: 'auto',
    },
    viewAddress: {
        paddingLeft: 10,
        alignItems: 'center',
        width: width,
        flexDirection: 'row',
        flex: 1,
    },
    tagView: {
        backgroundColor: R.colors.white100,
        marginTop: 10,
        paddingBottom: 10,
    },
    viewService: {
        flex: 1,
        alignItems: 'center',
        flexDirection: 'row',
        marginHorizontal: 20,
        justifyContent: 'space-between',
        marginVertical: 3,
        borderBottomWidth: 0.6,
        borderBottomColor: R.colors.greyColor,
    },
    textService: {
        fontSize: 16,
    },
    viewbtnStyle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 50,
        paddingHorizontal: '10%',
        paddingVertical: 20,
    },
    btnLeftStyle: {
        width: '45%',
        borderColor: R.colors.orangeColor,
        borderWidth: 0.8,
        backgroundColor: null
    },
    btnRightStyle: {
        width: '45%',
        backgroundColor: R.colors.orangeColor
    },
    textSelectService: {
        marginVertical: 8,
        fontSize: 14,
        fontWeight: Platform.OS === 'ios' ? '500' : '400',
    },
    btnSelectService: {
        alignItems: 'center',
        borderColor: R.colors.greyColor,
        borderWidth: 0.8,
        paddingHorizontal: 10,
        width: '30%',
        borderRadius: 20,
        borderStyle: 'dotted'
    }
})