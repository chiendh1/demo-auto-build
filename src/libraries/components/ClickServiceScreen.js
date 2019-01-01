import React, { Component } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import Container from 'libraries/components/Container';
import Header from 'libraries/components/Header';
import R from 'res/R';
import { getService, getSpecialize } from 'libraries/networking/apis';
import SeacherServiceComponent from './SeacherServiceComponent';
import { createFilter } from 'react-native-search-filter';
import NavigationService from 'routers/NavigationService';
import constants from 'libraries/utils/constants';

const KEYS_TO_FILTERS = ['name'];

class ClickServiceScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            serviceSeacher: '',
            textHeader: ''
        };
    }
    componentDidMount() {
        this.getService();
        this.getTextHeader();
    }

    getTextHeader() {
        const { key, keyScreen } = this.props.navigation.state.params;
        if (key === R.strings.selectService.hint_service_1) {
            this.setState({ textHeader: R.strings.selectService.hint_service_1 })
        } else if (key === R.strings.selectService.hint_service_2) {
            this.setState({ textHeader: R.strings.selectService.hint_service_2 })
        } else if (keyScreen === constants.SERVICES.PostJobRecruitment) {
            this.setState({ textHeader: R.strings.selectService.hint_career })
        } else if (keyScreen === constants.SERVICES.WorkerStudent || constants.SERVICES.UpgradeAcc || constants.SERVICES.WorkerAdvanced) {
            this.setState({ textHeader: R.strings.selectService.hint_specialize })
        } else if (keyScreen === constants.SERVICES.SearchFilter) {
            this.setState({ textHeader: R.strings.selectService.hint_service_0 })
        }

    }

    getService() {
        const key = this.props.navigation.state.params;

        if (key.key === R.strings.selectService.hint_service_1 || key.key === R.strings.selectService.hint_service_2) {
            getService().then(res => {
                this.setState({ data: res.data.service });
                if (key.key === R.strings.selectService.hint_service_2 && key.id !== null) {
                    let data = this.state.data.filter(item => item.id !== key.id);
                    this.setState({ data })
                }
                if (key.key === R.strings.selectService.hint_service_1 && key.id !== null) {
                    let data = this.state.data.filter(item => item.id !== key.id);
                    this.setState({ data })
                }
            }).catch(error => {
                return error;
            })
        } else {
            getSpecialize().then(res => {
                this.setState({ data: res.specialize });
                if (key.keyScreen === constants.SERVICES.SearchFilter) {
                    let data2 = key.data;
                    data2 = data2.map(item => item.id);
                    let data = this.state.data.filter(item => !data2.includes(item.id));
                    this.setState({ data });
                }
            }).catch(err => {
                return err;
            })
        }

    }

    searchService = (text) => {
        this.setState({
            serviceSeacher: text
        })
    }

    _renderListService() {
        const filteredService = this.state.data.filter(createFilter(this.state.serviceSeacher, KEYS_TO_FILTERS))
        if (filteredService.length > 0) {
            return filteredService.map(item => {
                return (
                    <View style={styles.container} key={item.id}>
                        <TouchableOpacity style={styles.btnService} onPress={() => this.onSelectService(item)}>
                            <Text style={styles.textService}>{item.name}</Text>
                        </TouchableOpacity>
                    </View>
                )
            })
        }
        return (
            <View style={styles.viewStyle}>
                <Text style={styles.textStyle}>{R.strings.selectService.hint_no_service}</Text>
            </View>
        )

    }

    render() {
        return (
            <Container>
                <Header
                    text={this.state.textHeader}
                />
                <SeacherServiceComponent
                    onChangeText={(text) => { this.searchService(text) }}
                />
                <ScrollView>
                    {this._renderListService()}
                </ScrollView>
            </Container>
        );
    }
    onSelectService = (item) => {
        const { keyScreen, keyPost } = this.props.navigation.state.params;
        if (keyScreen === constants.SERVICES.SelectService1 || keyScreen === constants.SERVICES.SelectService2) {
            NavigationService.navigate("SelectServiceScreen", this.getNameService(item))
        } else if (keyScreen === constants.SERVICES.WorkerStudent) {
            NavigationService.navigate("CreateStudentPortfolioScreen", this.getNameService(item))
        } else if (keyScreen === constants.SERVICES.WorkerAdvanced) {
            NavigationService.navigate("WorkerAdvancedPortfolioScreen", this.getNameService(item))
        } else if (keyScreen === constants.SERVICES.PostJobRecruitment) {
            NavigationService.navigate("PostJobRecruitmentScreen", { ...this.getNameService(item), key: keyPost });
        } else if (keyScreen === constants.SERVICES.SearchFilter) {
            NavigationService.navigate("SearchFilterScreen", { ...this.getNameService(item) });
        } else if (keyScreen === constants.SERVICES.UpgradeAcc) {
            NavigationService.navigate("UpgradeAccountScreen", { ...this.getNameService(item) })
        } else if (keyScreen === constants.SERVICES.EditProfile) {
            NavigationService.navigate("EditProfileScreen", { ...this.getNameService(item) })
        }
    }

    getNameService(name) {
        const key = this.props.navigation.state.params.key;
        if (key === R.strings.selectService.hint_service_1) {
            return { service1: name }
        } else {
            return { service2: name }
        }
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        marginLeft: 20,
        marginRight: 20,
        borderBottomWidth: 0.5,
        borderBottomColor: R.colors.grey500,
    },
    btnService: {
        paddingBottom: 10,
        paddingTop: 10,
    },
    textService: {
        fontSize: 16
    },
    viewStyle: {
        alignItems: 'center'
    },
    textStyle: {
        fontSize: 16,
    }
})




export default ClickServiceScreen;