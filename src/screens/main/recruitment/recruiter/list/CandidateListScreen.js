import React, { PureComponent } from 'react';
import { View, Text, FlatList, Alert, StyleSheet } from 'react-native';
import ImageButton from 'libraries/components/ImageButton';
import R from 'res/R';
import FABButton from 'libraries/components/FABButton';
import SearchJob from '../../SearchJob';
import CandidateItem from './CandidateItem';
import constants from 'libraries/utils/constants';
import NavigationService from 'routers/NavigationService';
import { getTypeProfile, postProfileSave, fetchAPI, APIS, getConfig, postCallNowRecruiment } from 'libraries/networking/apis';
import database from 'libraries/utils/database';
import { Status } from 'libraries/networking/status';
import DoYouKnow from 'libraries/components/DoYouKnow';
import BottomLoadingIndicator from 'libraries/components/BottomLoadingIndicator';
import { showMessage, dialCall } from 'libraries/utils/utils';
import _ from 'lodash';
import { connect } from 'react-redux';
import { reloadSaves, onUpdateUser } from '../../../../../redux/actions';

class CandidateListScreen extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      listProfile: [],
      showTitle: true,
      loading: true,
      page: 0,
      keyword: '',
      cityNameInMax: null,
      point_call: 0,
    };

    this.doSearch = _.debounce(this.doSearch, 300);
  }

  componentDidMount() {
    this.getProfile(0);
    this.getConfig();
    if (!this.props.filterData) {
      this.getCityNameInMax();
    }
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

  onCallPressed = (item) => () => {
    if (database.tokenCache) {
      if (this.state.point_call === constants.config.POINT_NULL) {
        postCallNowRecruiment(database.user.id_users, null, item.id, database.tokenCache, item.user.id_users).then(res => {
          if (res.code === Status.SUSSESS) {
            dialCall(item.user.telephone);
          } else if (res.code === Status.POINT_NOT_ENOUGH) {
            showMessage(R.strings.callNow.text_call_point_not_enough);
          }
        }).catch(err => {
          return err
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
    } else {
      alertSign();
    }
  }

  onPostCall = (item) => {
    postCallNowRecruiment(database.user.id_users, null, item.id, database.tokenCache, item.user.id_users).then(res => {
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

  componentWillReceiveProps(props) {
    if (props.reloadSave === constants.reloadList.SAVE_PROFILE) {
      this.getProfile(0);
      this.props.reloadSaves(constants.reloadList.DEFAULT);
    }
  }

  getCityNameInMax = () => {
    fetchAPI(APIS.CONCENTRATE_PROFILE, null, true)
      .then(response => {
        if (response.code === Status.SUSSESS) {
          this.setState({ cityNameInMax: response.data.concentrate_profile })
        }
      })
      .catch(error => {

      })
  }


  getProfile(page) {
    let type = constants.ProfileType.Student;
    const { routeKey } = this.props;
    switch (routeKey) {
      case constants.RECRUITER.STUDENT_RECRUITER:
        type = constants.ProfileType.Student;
        break;
      case constants.RECRUITER.WORKER_RECRUITER:
        type = constants.ProfileType.Worker_Basic;
        break

      case constants.RECRUITER.ALL:
        type = constants.ProfileType.ALL;
        break;

      default:
        break;
    }

    getTypeProfile(database.tokenCache,
      {
        type,
        page,
        search: this.state.keyword,
        address_name: this.props.filterData ? this.props.filterData.cityName : null,
        service_id: this.props.filterData ? this.props.filterData.service_id : null,
        salary_max: this.props.filterData ? this.props.filterData.salary && this.props.filterData.salary.salary_max : null,
        salary_min: this.props.filterData ? this.props.filterData.salary && this.props.filterData.salary.salary_min : null,
      }).then(response => {
        if (response.code === Status.SUSSESS) {
          if (this.state.page === 0) {
            this.setState({ listProfile: response.data.profiles, loading: false })
          } else {
            this.setState({ listProfile: [...this.state.listProfile, ...response.data.profiles], loading: false })
          }

        }
      }).catch(error => {
        this.setState({ loading: false })
        return error;
      })
  }

  _keyExtractor = (item, index) => item.id.toString();

  _renderItem = ({ item, index }) => (
    <CandidateItem
      item={item}
      index={index}
      onCallPressed={this.onCallPressed}
      onSaveProfile={this.onSaveProfile}
      onPress={() => this.onDetailProfile(item, index)}
    />
  );

  onSaveProfile = (item, index) => () => {
    const save = item.save_status === constants.saveProfile.save ? constants.saveProfile.remove : constants.saveProfile.save

    postProfileSave(database.user.id_users, item.id, save, database.tokenCache).then(response => {
      if (response.code === Status.SUSSESS) {
        const action = {
          title: R.strings.main.hint_text_detail_mess,
          color: R.colors.orangeColor,
          onPress: () => NavigationService.navigate("SaveProfileScreen"),
        }

        save === constants.saveProfile.save ?
          showMessage(R.strings.Candidate.msg_save_profile_success, action) :
          showMessage(R.strings.Candidate.msg_remove_profile_success)

        let profile = { ...item }
        profile.save_status = save;

        let newList = [...this.state.listProfile]
        newList.splice(index, 1, profile);
        this.setState({ listProfile: newList })
      }
    }).catch(error => {
      save === constants.saveProfile.save ?
        showMessage(R.strings.Candidate.msg_save_profile_failure) :
        showMessage(R.strings.Candidate.msg_remove_profile_failure)
      return error;
    })
  }


  onDetailProfile = (item, index) => {
    NavigationService.navigate('DetailProfile', { item, index, onRefreshLocalList: this.onRefreshLocalList });
  }

  onRefreshLocalList = (item, index) => {
    if (item !== this.state.listProfile[index]) {
      let newList = [...this.state.listProfile]
      newList.splice(index, 1, item);
      this.setState({ listProfile: newList })
    }

  }

  onClose = () => {
    this.setState({ showTitle: false })
  }

  _renderDoyouKnow() {
    if (this.state.showTitle && !this.props.filterData && this.state.cityNameInMax) {
      return (
        <View style={{ height: 125, marginBottom: 5 }}>
          <DoYouKnow
            type='profiles'
            onClose={this.onClose}
            cityNameInMax={this.state.cityNameInMax}
            onDetailCityMaxPressed={this.onDetailCityMaxPressed}
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

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: R.colors.grey100 }}>
        <View style={styles.viewSearch}>
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
            onChangeText={this.onSearchCandidate}
            placeholder={R.strings.recruitment.worker.find_a_job}
          />
        </View>

        {this._renderDoyouKnow()}

        <FlatList
          onRefresh={this.onRefreshList}
          refreshing={this.state.loading}
          onEndReached={this.onEndReached}
          onEndReachedThreshold={0.5}
          ListFooterComponent={this.renderFooterComponent}
          data={this.state.listProfile}
          keyExtractor={this._keyExtractor}
          renderItem={this._renderItem}
        />
        {
          !this.props.filterData ?
            <FABButton
              onPress={this.onAddRecruitmentNews}
            />
            : null
        }

        {
          this.state.listProfile && this.state.listProfile.length === 0 && !this.state.loading ?
            <Text style={{ position: 'absolute', top: 100 }}>{R.strings.Candidate.hint_empty_result_search}</Text> :
            null
        }

      </View>
    );
  }

  renderFooterComponent = () => {
    if (this.state.listProfile.length < 20 * (this.state.page + 1)) return null;
    return <BottomLoadingIndicator />
  }

  onSearchCandidate = text => {
    this.setState({ keyword: text })
    this.doSearch();

  }

  doSearch = () => {
    this.setState({ page: 0, loading: true })
    this.getProfile(0)
  }

  onRefreshList = () => {
    this.setState({ loading: true, page: 0 });
    this.getProfile(0);
  }

  onEndReached = () => {
    if (this.state.listProfile.length < 20) return;
    this.setState({
      page: this.state.page + 1
    }, () => {
      this.getProfile(this.state.page);
    });
  }

  onAddRecruitmentNews = () => {
    const { routeKey } = this.props;
    switch (routeKey) {
      case constants.RECRUITER.STUDENT_RECRUITER:
        NavigationService.navigate("PostJobRecruitmentScreen", { key: constants.RECRUITER.STUDENT_RECRUITER });
        break;
      case constants.RECRUITER.WORKER_RECRUITER:
        NavigationService.navigate("PostJobRecruitmentScreen", { key: constants.RECRUITER.WORKER_RECRUITER });
        break
      default:
        break;
    }
  }
  onFilter = () => {
    NavigationService.navigate("SearchFilterScreen");
  }
}

const styles = StyleSheet.create({
  viewSearch: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
    backgroundColor: R.colors.white100
  }
})

const mapStateToProps = state => {
  return {
    reloadSave: state.reloadSaveReducer.reloadSave
  }
}
const mapDispatchToProps = dispatch => {
  return {
    reloadSaves: (text) => dispatch(reloadSaves(text)),

    onUpdateUser: (user) => dispatch(onUpdateUser(user)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CandidateListScreen);
