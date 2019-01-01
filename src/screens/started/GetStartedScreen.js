import React, { PureComponent } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Swiper from 'react-native-swiper';
import R from 'res/R';
import SwiperImage from './SwiperImage';
import ImageHorizontal from './ImageHorizontal';
import ButtonControl from './ButtonControl';
import NavigationService from 'routers/NavigationService';
import Container from 'libraries/components/Container';
import database, { KEY_GET_STARTED_PRESSED } from 'libraries/utils/database';
const { width, height } = Dimensions.get('window');
import firebase from 'react-native-firebase';

import OneSignal from 'react-native-onesignal';

export default class GetStartedScreen extends PureComponent {
    constructor(props) {
        super(props);
    }

    render() {

        return (
            <Container>
                <View style={styles.container}>
                    <View style={{ flex: 6, marginTop: 10 }}>
                        <Swiper
                            autoplay
                            autoplayTimeout={2} showsPagination={false} width={width - 60} height={height / 2}>

                            <SwiperImage
                                imageSwiper={R.images.getStarted1}
                                text={R.strings.start.hint_text_swiper1}
                            />
                            <SwiperImage
                                imageSwiper={R.images.getStarted2}
                                text={R.strings.start.hint_text_swiper2}
                            />
                            <SwiperImage
                                imageSwiper={R.images.getStarted3}
                                text={R.strings.start.hint_text_swiper3}
                            />
                        </Swiper>
                    </View>
                    <View style={styles.viewWrapper}>
                        <ButtonControl
                            style={{ backgroundColor: R.colors.amber1000 }}
                            text={R.strings.start.lable_get_start}
                            onPress={this.onGetStart}
                        />
                        <ImageHorizontal
                            imageLeft={R.images.left_or}
                            text={R.strings.start.hint_text_or}
                            imageRight={R.images.right_or}
                        />
                        <ButtonControl
                            text={R.strings.login.label_sign_up}
                            onPress={this.onSignIn}
                        />
                        <ButtonControl
                            text={R.strings.login.label_login}
                            onPress={this.onSignUp}
                        />
                    </View>
                </View>
            </Container>
        );
    }


    componentDidMount(){
        OneSignal.sendTag('user_id', '');
        firebase.auth().signOut();
    }

    onGetStart = () => {
        database.save(KEY_GET_STARTED_PRESSED, true.toString());
        NavigationService.navigate('HomeScreen');
    }
    onSignIn = () => {
        NavigationService.navigate('SignUpScreen');
    }
    onSignUp = () => {
        NavigationService.navigate('LoginScreen');
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#104a7a',
        alignItems: 'center',
    },
    viewWrapper: {
        flex: 4,
        width: '100%',
        alignItems: 'center'
    },
    offlineContainer: {
        backgroundColor: '#b52424',
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        width,
        position: 'absolute',
        top: 30
    },
    offlineText: {
        color: '#fff'
    }
})
