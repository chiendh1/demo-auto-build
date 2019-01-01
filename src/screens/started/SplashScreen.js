import { Status } from 'libraries/networking/status';
import React, { PureComponent } from 'react';
import { Dimensions, Platform, PermissionsAndroid } from 'react-native';
import NavigationService from 'routers/NavigationService';
import Container from 'libraries/components/Container';
import Logo from 'screens/login/Logo';
import database, { KEY_USER_TOKEN, KEY_GET_STARTED_PRESSED, KEY_USER } from 'libraries/utils/database';
import { onFetchUser, locationUpdated } from '../../redux/actions';
import { connect } from 'react-redux';
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';

const { height } = Dimensions.get('window');

class SplashScreen extends PureComponent {
    static navigationOptions = {
        header: null,
    }
    constructor(props) {
        super(props)
    }

    async componentDidUpdate() {
        let isGetStartedPressed = await database.get(KEY_GET_STARTED_PRESSED)
        if (this.props.user) {
            NavigationService.reset('HomeScreen')
        } else {
            if (isGetStartedPressed === true.toString()) {
                return (NavigationService.reset('HomeScreen'))
            } else {
                return (NavigationService.reset("GetStartedScreen"))
            }
        }
    }

    requestLocationPermission = async () => {
        try {
            let permissions = [PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION]
            const granted = await PermissionsAndroid.requestMultiple(permissions)

            if (JSON.stringify(granted).toString().includes('denied')) {
                this.navigate()
            } else {
                this.timeout = setTimeout(() => {
                    this.navigate()
                }, 10000)

                RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({ interval: 10000, fastInterval: 5000 })
                .then(data => {
                    // The user has accepted to enable the location services
                    // data can be :
                    //  - "already-enabled" if the location services has been already enabled
                    //  - "enabled" if user has clicked on OK button in the popup
                    this.watchLocation()
                }).catch(err => {
                    this.navigate()
                    // The user has not accepted to enable the location services or something went wrong during the process
                    // "err" : { "code" : "ERR00|ERR01|ERR02", "message" : "message"}
                    // codes : 
                    //  - ERR00 : The user has clicked on Cancel button in the popup
                    //  - ERR01 : If the Settings change are unavailable
                    //  - ERR02 : If the popup has failed to open
                });
            }
        } catch (err) {
            this.navigate()
        }
    }

    watchLocation() {
        navigator.geolocation.getCurrentPosition((position) => {
            const region = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
            }
            this.props.onLocationChanged(region)
            this.navigate()
        }, error => {
            this.navigate()
        });
    }


    componentDidMount() {

        if (Platform.OS === 'android') {
            this.requestLocationPermission();
        } else {
            this.watchLocation();
        }
    }

    navigate() {
        setTimeout(async () => {
            let isGetStartedPressed = await database.get(KEY_GET_STARTED_PRESSED)
            let token = await database.get(KEY_USER_TOKEN);

            try {
                if (token) {
                    database.tokenCache = token;
                    let userStr = await database.get(KEY_USER);
                    if (userStr) {
                        let user = JSON.parse(userStr);
                        database.user = user;
                        this.props.onFetchUser(database.user.id_users, database.tokenCache);
                    } else {
                        if (isGetStartedPressed === true.toString()) {
                            return (NavigationService.reset('HomeScreen'))
                        } else {
                            return (NavigationService.reset("GetStartedScreen"))
                        }
                    }

                } else {
                    if (isGetStartedPressed === true.toString()) {
                        return (NavigationService.reset('HomeScreen'))
                    } else {
                        return (NavigationService.reset("GetStartedScreen"))
                    }
                }
            } catch (error) {
                if (isGetStartedPressed === true.toString()) {
                    return (NavigationService.reset('HomeScreen'))
                } else {
                    return (NavigationService.reset("GetStartedScreen"))
                }
            }

        }, 1000);
    }

    componentWillUnmount(){
        if(this.timeout) clearTimeout(this.timeout);
    }
    render() {
        return (
            <Container style={{ backgroundColor: 'white' }}>
                <Logo style={{ marginTop: height / 3 }} />
            </Container>
        );
    }
}

const mapStateToProps = state => {
    return {
        isUpdated: state.userReducer.isUpdated,
        user: state.userReducer.user
    }
}
const mapDispatchToProps = dispatch => {
    return {
        onLocationChanged: (region) => dispatch(locationUpdated(region)),
        onFetchUser: (id_users, token) => dispatch(onFetchUser(id_users, token))
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(SplashScreen);