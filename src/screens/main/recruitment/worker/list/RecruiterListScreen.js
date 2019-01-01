import React, { PureComponent } from 'react';
import { View, Text, FlatList, Alert } from 'react-native';
import JobItem from './JobItem';
import R from 'res/R';
import ImageButton from 'libraries/components/ImageButton';
import SearchJob from '../../SearchJob';
import FABButton from 'libraries/components/FABButton';
import NavigationService from 'routers/NavigationService';
import SelectWorkerPortfolio from '../create_portfolio/worker/SelectWorkerPortfolio';
import constants from 'libraries/utils/constants';
import DoYouKnow from 'libraries/components/DoYouKnow';
import database from 'libraries/utils/database';
import { alertSign } from 'libraries/components/AlertLogin';
import { getListRecruiment, postJobSave, fetchAPI, APIS, getConfig, postCallNowRecruiment, getProfileOfMe } from 'libraries/networking/apis';
import { Status } from 'libraries/networking/status';
import BottomLoadingIndicator from 'libraries/components/BottomLoadingIndicator';
import { connect } from 'react-redux';
import { showMessage, dialCall } from 'libraries/utils/utils';
import _ from 'lodash';
import { reloadSaves, onUpdateUser } from '../../../../../redux/actions';
import ModalMissingProfile from './ModalMissingProfile';

class RecruiterListScreen extends PureComponent {
    type = -1;
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            showTitle: true,
            loading: true,
            keyword: '',
            page: 0,
            cityNameInMax: null,
            point_call: 0,
            isVisible: false
        };

        this.doSearch = _.debounce(this.doSearch, 300);
    }
    componentDidMount() {
        this.getListRecruiments(0);
        if (!this.props.filterData) {
            this.getCityNameInMax();
        }

        this.getConfig();

        this._ListProfileOfMe();
    }

    _ListProfileOfMe = () => {
        getProfileOfMe(database.user.id_users, database.tokenCache).then(response => {
            if (response.code === Status.SUSSESS) {
                let items = response.data.profile;

                if (!items || items.length === 0) return;

                for (let item of items) {
                    if (item.type === 1 || item.type === 2) {

                        if (item.type === 1) {
                            if (!item.skill || !item.current_salary) {
                                this.timer = setTimeout(() => {
                                    this.setState({
                                        isVisible: true
                                    })
                                }, 3000)
                            } else {
                                return null;
                            }

                        } else if (!item.skill || !item.address_current || !item.image_drawing || !item.image_forte || !item.image_product || !item.current_salary) {
                            this.timer = setTimeout(() => {
                                this.setState({
                                    isVisible: true
                                })
                            }, 3000)
                        } else {
                            return null;
                        }
                        return;
                    }
                }



            }
        }).catch(error => {
            return error;
        })
    }

    _renderModalMissingProfile = () => <ModalMissingProfile
        isVisible={this.state.isVisible}
        onClose={this.onCloseModal}
        onProfileOfMe={this.onProfileOfMe}
    />

    onProfileOfMe = () => {
        NavigationService.navigate('ListProfileScreen');
        this.setState({ isVisible: false })
    }

    onCloseModal = () => {
        this.setState({ isVisible: false })
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

    componentWillReceiveProps(props) {
        if (props.reloadSave === constants.reloadList.SAVE_JOB) {
            this.onRefreshList();
            setTimeout(() => {
                this.props.reloadSaves(constants.reloadList.DEFAULT);
            }, 2000);
        }
    }

    getCityNameInMax = () => {
        fetchAPI(APIS.CONCENTRATE_RECRUITMENT)
            .then(response => {
                if (response.code === Status.SUSSESS) {
                    this.setState({ cityNameInMax: response.data.concentrate_recruitment })
                }
            })
            .catch(error => {

            })
    }

    getListRecruiments(page) {
        const { routeKey } = this.props;
        switch (routeKey) {
            case constants.CANDIDATE.STUDENT_CANDIDATE:
                this.type = constants.ProfileType.Student
                break;
            case constants.CANDIDATE.WORKER_CANDIDATE:
                this.type = constants.ProfileType.Worker_Basic
                break
            case constants.RECRUITER.ALL:
                this.type = constants.ProfileType.ALL;
                break;
            default:
                break;
        }
        const cityName = this.props.filterData ? this.props.filterData.cityName : null
        const service_id = this.props.filterData ? this.props.filterData.service_id : null
        const salary_max = this.props.filterData ? this.props.filterData.salary && this.props.filterData.salary.salary_max : null
        const salary_min = this.props.filterData ? this.props.filterData.salary && this.props.filterData.salary.salary_min : null

        getListRecruiment(
            this.type,
            database.user.id_users,
            page,
            this.state.keyword,
            this.props.region,
            service_id,
            salary_max,
            salary_min,
            cityName
        ).then(res => {
            if (res.code === Status.SUSSESS) {


                if (this.state.page === 0) {
                    this.setState({ data: res.data.recruitments, loading: false });
                } else {
                    let datas = _.uniq([...this.state.data, ...res.data.recruitments]);
                    this.setState({ data: datas, loading: false });
                }
            } else {
                this.setState({ loading: false });
            }
        }).catch(err => {
            this.setState({ loading: false });
        })
    }

    onRefreshList = () => {
        this.setState({ loading: true, page: 0 })
        this.getListRecruiments(0);
    }

    doSearch = () => {
        this.setState({ page: 0, loading: true });
        this.getListRecruiments(0);
    }

    onEndReached = () => {
        if (this.state.data.length < 20) return;
        this.setState({
            page: this.state.page + 1
        }, () => {
            this.getListRecruiments(this.state.page);
        });
    }

    _keyExtractor = (item, index) => item.id.toString();

    _renderItem = ({ item, index }) => (
        <JobItem
            onPress={this.onPress}
            onCallPressed={this.onCallPressed}
            onSavePressed={this.onSavePressed}
            item={item}
            index={index}
        />
    );

    onCallPressed = (item) => {
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
            alertSign();
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
        }).catch(error => {
            return error;
        })
    }

    onPress = (item, index) => () => {
        NavigationService.navigate("InfoRecruimentScreen", { item, index, onRefreshLocalList: this.onRefreshLocalList })
    }

    onRefreshLocalList = (item, index) => {
        if (item !== this.state.data[index]) {
            let newList = [...this.state.data]
            newList.splice(index, 1, item);
            this.setState({ data: newList })
        }

    }


    onSavePressed = (item, index) => () => {
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

                        let newList = [...this.state.data]
                        newList.splice(index, 1, job);
                        this.setState({ data: newList })

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

    onClose = () => {
        this.setState({ showTitle: false })
    }
    _renderDoyouKnow() {
        if (this.state.showTitle && !this.props.filterData && this.state.cityNameInMax) {
            return (
                <View style={{ height: 125, marginTop: 5, }}>
                    <DoYouKnow
                        onDetailCityMaxPressed={this.onDetailCityMaxPressed}
                        type='recruitment'
                        onClose={this.onClose}
                        cityNameInMax={this.state.cityNameInMax}
                    />
                </View>


            )
        }
        return null;
    }

    onDetailCityMaxPressed = () => {
        const filterData = {
            cityName: this.state.cityNameInMax
        }

        NavigationService.navigate('ListProfileSearch', { filterData, routeKey: constants.RECRUITER.ALL, type: 'cityInMax' })
    }

    _render_no_filter() {
        if (this.state.data.length === 0 && this.state.loading === false) {
            return (
                <View style={{ alignItems: 'center', marginTop: 30 }}>
                    <Text style={{ fontSize: 16 }}>{R.strings.selectService.hint_no_service}</Text>
                </View>
            )
        }
    }
    componentWillUnmount() {
        if (this.timer) {
            clearTimeout(this.timer);
        }
    }

    render() {
        return (
            <View style={{ flex: 1, backgroundColor: R.colors.grey100 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: R.colors.white100, }}>
                    {
                        !this.props.filterData ?
                            <ImageButton
                                containerStyle={{ marginHorizontal: 10, }}
                                iconName='ios-funnel'
                                iconSize={25}
                                iconColor={R.colors.secondaryColor}
                                onPress={this.onFilter}
                            />
                            : null
                    }

                    <SearchJob
                        value={this.state.keyword}
                        onChangeText={this.onSearchJob}
                        placeholder={R.strings.recruitment.worker.find_a_job}
                    />
                </View>

                {this._renderDoyouKnow()}

                {this._render_no_filter()}

                <FlatList
                    data={this.state.data}
                    showsVerticalScrollIndicator={false}
                    keyExtractor={this._keyExtractor}
                    renderItem={this._renderItem}
                    onRefresh={this.onRefreshList}
                    refreshing={this.state.loading}
                    onEndReached={this.onEndReached}
                    onEndReachedThreshold={0.5}
                    ListFooterComponent={this.renderFooterComponent}
                />

                {
                    !this.props.filterData ?
                        <FABButton
                            onPress={this.onCreatePortfolioStudent}
                        />
                        : null
                }

                <SelectWorkerPortfolio
                    ref={ref => this.selectWorkerModal = ref}
                    onClosePressed={this.onClosePressed}
                    onPortfolioPressed={this.onPortfolioPressed}
                />
                {this._renderModalMissingProfile()}
                {/* <LoadingPage vidible={this.state.loading} /> */}
            </View>
        );
    }

    renderFooterComponent = () => {
        if (this.state.data.length < 20 * (this.state.page + 1)) return null;
        return <BottomLoadingIndicator />
    }

    onFilter = () => {
        NavigationService.navigate("SearchFilterScreen");
    }

    onSearchJob = (text) => {
        this.setState({ keyword: text })
        this.doSearch();

    }


    onClosePressed = () => {
        this.selectWorkerModal.setVisible(false);
    }

    onPortfolioPressed = (type) => {
        this.selectWorkerModal.setVisible(false);
        NavigationService.navigate('WorkerAdvancedPortfolioScreen', { type });
    }

    onCreatePortfolioStudent = (type) => {
        const { routeKey } = this.props;
        if (database.tokenCache) {
            if (database.user.loaitk === constants.upgradeAcc.GUEST) {
                const action = {
                    title: R.strings.main.hint_text_upgrade_mess,
                    color: R.colors.orangeColor,
                    onPress: () => NavigationService.navigate("MyHGScreen"),
                }
                showMessage(R.strings.upgradeacc.text_you_update_acc, action);
            } else {
                switch (routeKey) {
                    case constants.CANDIDATE.STUDENT_CANDIDATE:
                        NavigationService.navigate('CreateStudentPortfolioScreen', { type });
                        break;
                    case constants.CANDIDATE.WORKER_CANDIDATE:
                        this.selectWorkerModal.setVisible(true);
                        break
                    default:
                        break;
                }
            }
        } else {
            alertSign();
        }

    }
}

const mapStateToProps = state => {
    return {
        region: state.locationReducer.region,
        reloadSave: state.reloadSaveReducer.reloadSave
    }
}
const mapDispatchToProps = dispatch => {
    return {
        reloadSaves: (text) => dispatch(reloadSaves(text)),
        onUpdateUser: (user) => dispatch(onUpdateUser(user)),
    }
};
export default connect(mapStateToProps, mapDispatchToProps)(RecruiterListScreen);
