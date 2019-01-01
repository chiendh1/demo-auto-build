import { onUpdateUser } from './../../../redux/actions/userAction';
import React, { Component } from 'react';
import { View, Text, Dimensions, StyleSheet, Platform, PermissionsAndroid } from 'react-native';
import BaseButtonOpacity from 'libraries/components/BaseButtonOpacity';
import NavigationService from 'routers/NavigationService';
import Icon from 'react-native-vector-icons/FontAwesome5';
import database, { KEY_USER_TOKEN } from 'libraries/utils/database';

import OneSignal from 'react-native-onesignal';
import Container from 'libraries/components/Container';
import constants from 'libraries/utils/constants';
import R from 'res/R';

import { TabView, TabBar, SceneMap } from 'react-native-tab-view';
import RecruiterListScreen from './worker/list/RecruiterListScreen';
import MapJobScreen from './map/MapJobScreen';
import CandidateListScreen from './recruiter/list/CandidateListScreen';
import { connect } from 'react-redux';
import { locationUpdated, reloadSaves } from '../../../redux/actions';

class RecruitmentScreen extends Component {

  static navigationOptions = {
    tabBarLabel: 'Tuyển dụng',
    tabBarIcon: ({ tintColor }) => (
      <Icon
        name='briefcase'
        size={26}
        color={tintColor}
      />
    )
  }



  constructor(props) {
    super(props);
    if (database.user &&
      (database.user.loaitk === constants.upgradeAcc.KTS
        || database.user.loaitk === constants.upgradeAcc.NBS
        || database.user.loaitk === constants.upgradeAcc.NX)) {
      this.stateRecruiter();
    } else {
      this.stateCandidate();
    }

  }

  componentWillReceiveProps(props) {
    if (props.reloadSave === constants.reloadList.UPGRADE_USER) {
      setTimeout(() => {
        this.props.reloadSaves(constants.reloadList.DEFAULT);
      }, 2000);
      if (database.user &&
        (database.user.loaitk === constants.upgradeAcc.KTS
          || database.user.loaitk === constants.upgradeAcc.NBS
          || database.user.loaitk === constants.upgradeAcc.NX)) {
        this.setState({
          index: 0,
          routes: [
            { key: constants.CANDIDATE.STUDENT_CANDIDATE, title: R.strings.recruitment.job_for_student },
            { key: constants.CANDIDATE.WORKER_CANDIDATE, title: R.strings.recruitment.job_for_worker },
            { key: constants.CANDIDATE.MAP_CANDIDATE, title: R.strings.recruitment.map_job }
          ]
        })
      } else {
        this.setState({
          index: 0,
          routes: [
            { key: constants.RECRUITER.STUDENT_RECRUITER, title: R.strings.recruitment.student_find_job },
            { key: constants.RECRUITER.WORKER_RECRUITER, title: R.strings.recruitment.worker_find_job },
            { key: constants.RECRUITER.MAP_RECRUITER, title: R.strings.recruitment.map_job }
          ]
        })
      }
    }
  }

  stateRecruiter() {
    this.state = {
      index: 0,
      routes: [
        { key: constants.RECRUITER.STUDENT_RECRUITER, title: R.strings.recruitment.student_find_job },
        { key: constants.RECRUITER.WORKER_RECRUITER, title: R.strings.recruitment.worker_find_job },
        { key: constants.RECRUITER.MAP_RECRUITER, title: R.strings.recruitment.map_job }
      ]
    };
  }

  stateCandidate() {
    this.state = {
      index: 0,
      routes: [
        { key: constants.CANDIDATE.STUDENT_CANDIDATE, title: R.strings.recruitment.job_for_student },
        { key: constants.CANDIDATE.WORKER_CANDIDATE, title: R.strings.recruitment.job_for_worker },
        { key: constants.CANDIDATE.MAP_CANDIDATE, title: R.strings.recruitment.map_job }
      ]
    };
  }



  onRegionChange(region, lastLat, lastLong) {
    this.props.onLocationChanged(region);
  }


  componentDidMount() {
    if (database.user) {
      this.props.onUpdateUser(database.user);
      OneSignal.sendTag('user_id', database.user.id_users + '');
    }

    // if (Platform.OS === 'android' && Platform.Version >= 23) {
    //   this.requestLocationPermission();
    // } else {
    //   this.watchLocation();
    // }


  }

  // requestLocationPermission = async () => {
  //   try {
  //     let permissions = [PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION]
  //     const granted = await PermissionsAndroid.requestMultiple(permissions)
  //     if (JSON.stringify(granted).toString().includes('denied')) {
  //       
  //     } else {
  // this.watchLocation()
  //     }
  //   } catch (err) {
  //   }
  // }

  // watchLocation() {
  //   navigator.geolocation.getCurrentPosition((position) => {
  //     const region = this.regionFrom(position.coords.latitude, position.coords.longitude, 2000)
  //     this.onRegionChange(region, region.latitude, region.longitude);
  //   }, );
  // }

  // regionFrom(lat, lon, distance) {
  //   distance = distance / 2
  //   const circumference = 40075
  //   const oneDegreeOfLatitudeInMeters = 111.32 * 1000
  //   const angularDistance = distance / circumference

  //   const latitudeDelta = distance / oneDegreeOfLatitudeInMeters
  //   const longitudeDelta = Math.abs(Math.atan2(
  //     Math.sin(angularDistance) * Math.cos(lat),
  //     Math.cos(angularDistance) - Math.sin(lat) * Math.sin(lat)))

  //   return result = {
  //     latitude: lat,
  //     longitude: lon,
  //     latitudeDelta,
  //     longitudeDelta,
  //   }
  // }


  renderScene = ({ route }) => {
    
    switch (route.key) {
      case constants.CANDIDATE.STUDENT_CANDIDATE:
        return <RecruiterListScreen routeKey={route.key} />;

      case constants.CANDIDATE.WORKER_CANDIDATE:
        return <RecruiterListScreen routeKey={route.key} />;

      case constants.CANDIDATE.MAP_CANDIDATE:
        return <MapJobScreen routeKey={route.key} />;

      case constants.RECRUITER.STUDENT_RECRUITER:
        return <CandidateListScreen routeKey={route.key} />;

      case constants.RECRUITER.WORKER_RECRUITER:
        return <CandidateListScreen routeKey={route.key} />;

      case constants.RECRUITER.MAP_RECRUITER:
        return <MapJobScreen routeKey={route.key} />;

      default:
        return null;
    }
  }

  renderTabBar = (props) => <TabBar
    {...props}
    indicatorStyle={styles.indicatorStyle}
    tabStyle={styles.tabStyle}
    labelStyle={styles.tabLabelStyle}
    style={styles.tabStyle}

    getLabelText={this.getLabelText}
  />

  getLabelText = (scene) => {
    return scene.route.title
  }

  render() {
    return (
      <Container>

        <TabView
          navigationState={this.state}
          renderScene={this.renderScene}
          renderTabBar={this.renderTabBar}
          onIndexChange={index => this.setState({ index })}
          initialLayout={styles.inititalLayout}
          useNativeDriver
        />

      </Container>
    );
  }
}

const styles = StyleSheet.create({
  inititalLayout: {
    width: Dimensions.get('window').width,
    height: 0,
  },

  tabLabelStyle: {
    color: 'white',
    fontSize: 13,
  },

  tabStyle: {
    backgroundColor: R.colors.primaryColor,
  },

  indicatorStyle: {
    backgroundColor: R.colors.secondaryColor
  }
});


const mapStateToProps = state => {
  return {
    user: state.userReducer.user,
    reloadSave: state.reloadSaveReducer.reloadSave
  }
}
const mapDispatchToProps = dispatch => {
  return {
    onLocationChanged: (region) => dispatch(locationUpdated(region)),
    onUpdateUser: (user) => dispatch(onUpdateUser(user)),
    reloadSaves: (text) => dispatch(reloadSaves(text))

  };
}

export default connect(mapStateToProps, mapDispatchToProps)(RecruitmentScreen);
