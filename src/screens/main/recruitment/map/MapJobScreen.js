import React, { PureComponent } from 'react';
import { View, Text, Dimensions, PermissionsAndroid, Platform } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { connect } from 'react-redux';
import constants from 'libraries/utils/constants';
import database from 'libraries/utils/database';
import { getProfilesForMap, getRecruiterForMap } from 'libraries/networking/apis';
import R from 'res/R';
import { Status } from 'libraries/networking/status';
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';
import NavigationService from 'routers/NavigationService';

class MapJobScreen extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      region: {
        latitude: 21.0228161,
        longitude: 105.8019441,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      },
      markers: [],
      data: [],
    };
  }


  componentDidMount() {

    if (Platform.OS === 'android') {
      this.requestLocationPermission();
    } else {
      this.watchLocation();
    }




  }

  getMarkers = (region) => {
    const { routeKey } = this.props;
    switch (routeKey) {

      case constants.RECRUITER.MAP_RECRUITER:
        //Map hồ sơ
        this.getMapCandidate(region)
        break;

      case constants.CANDIDATE.MAP_CANDIDATE:
        //Map việc làm  
        this.getMapRecruiter(region)
        break
    }
  }

  requestLocationPermission = async () => {
    try {
      let permissions = [PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION]
      const granted = await PermissionsAndroid.requestMultiple(permissions)
      if (JSON.stringify(granted).toString().includes('denied')) {

      } else {
        RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({ interval: 10000, fastInterval: 5000 })
          .then(data => {
            // The user has accepted to enable the location services
            // data can be :
            //  - "already-enabled" if the location services has been already enabled
            //  - "enabled" if user has clicked on OK button in the popup
            this.watchLocation()
          }).catch(err => {
            // The user has not accepted to enable the location services or something went wrong during the process
            // "err" : { "code" : "ERR00|ERR01|ERR02", "message" : "message"}
            // codes : 
            //  - ERR00 : The user has clicked on Cancel button in the popup
            //  - ERR01 : If the Settings change are unavailable
            //  - ERR02 : If the popup has failed to open
          });

      }
    } catch (err) {
    }
  }

  watchLocation() {
    navigator.geolocation.getCurrentPosition((position) => {
      const region = this.regionFrom(position.coords.latitude, position.coords.longitude, 2000)
      this.setState({ region })

      this.getMarkers(region);
    });
  }

  regionFrom(lat, lon, distance) {
    distance = distance / 2
    const circumference = 40075
    const oneDegreeOfLatitudeInMeters = 111.32 * 1000
    const angularDistance = distance / circumference

    const latitudeDelta = distance / oneDegreeOfLatitudeInMeters
    const longitudeDelta = Math.abs(Math.atan2(
      Math.sin(angularDistance) * Math.cos(lat),
      Math.cos(angularDistance) - Math.sin(lat) * Math.sin(lat)))

    return result = {
      latitude: lat,
      longitude: lon,
      latitudeDelta,
      longitudeDelta,
    }
  }

  getMapCandidate(region) {
    const lat_lng = `${region.latitude},${region.longitude}`
    getProfilesForMap(database.tokenCache, lat_lng)
      .then(response => {
        if (response.code === Status.SUSSESS) {
          this.setState({
            data: response.data.profiles
          })
          let markers = []
          response.data.profiles.forEach(candidate => {
            if (candidate.lat_lng_desired) {

              const coordinates = candidate.lat_lng_desired.split(',');
              if (coordinates && coordinates.length === 2) {
                markers.push({
                  latitude: Number(coordinates[0]),
                  longitude: Number(coordinates[1])
                })
              }
            }
          });
          this.setState({ markers })
        }
      })
  }

  getMapRecruiter(region) {
    const lat_lng = `${region.latitude},${region.longitude}`
    getRecruiterForMap(database.user.id_users, lat_lng)
      .then(response => {
        if (response.code === Status.SUSSESS) {
          this.setState({
            data: response.data.recruitments
          })

          let markers = []
          response.data.recruitments.forEach(recruiter => {
            if (recruiter.work_location_lat_lng) {

              const coordinates = recruiter.work_location_lat_lng.split(',');
              if (coordinates && coordinates.length === 2) {
                markers.push({
                  latitude: Number(coordinates[0]),
                  longitude: Number(coordinates[1])
                })
              }
            }
          });
          this.setState({ markers })
        }
      })
  }

  // shouldComponentUpdate(nextProps, nextState){
  //   if(nextProps.region === this.props.region){
  //     return false;
  //   }
  //   return true;
  // }
  // shouldComponentUpdate(nextProps, nextState) {
  //   console.log(nextProps);
  //   return true
  // }


  render() {
    return (
      <MapView
        style={{ flex: 1 }}
        showsUserLocation={true}
        showsMyLocationButton={true}
        region={this.state.region}
      >
        {
          this.state.markers.map((marker, index) => <Marker
            key={index.toString()}
            coordinate={marker}
            image={R.images.ic_candidate_marker}
            onPress={() => { this.onMarkerPressed(index, marker) }}
          />)
        }
      </MapView>
    );
  }

  onMarkerPressed = (index) => {
    const { routeKey } = this.props;
    switch (routeKey) {

      case constants.RECRUITER.MAP_RECRUITER:
        //Map hồ sơ
        // alert("Hồ sơ")
        NavigationService.navigate("DetailProfile", { item: this.state.data[index] })
        break;

      case constants.CANDIDATE.MAP_CANDIDATE:
        //Map việc làm  
        // alert("Tin tuyển dụng")
        NavigationService.navigate("InfoRecruimentScreen", { item: this.state.data[index] })
        break
    }
  }
}

// const mapStateToProps = state => {
//   return {
//     region: state.locationReducer.region
//   }
// }

export default connect(null, null)(MapJobScreen);
