/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { View, YellowBox } from 'react-native';
import MainNavigation from 'routers/MainNavigation';
import NavigationService from 'routers/NavigationService';
import { Provider } from 'react-redux';
import configureStore from './src/redux/stores/configureStore';
import NoInternetScreen from 'screens/network/NoInternetScreen';
import RootView from 'screens/RootView';

const store = configureStore();

export default class App extends Component {

    constructor(props){
        super(props);

        YellowBox.ignoreWarnings(['Error: No user']);
    }

    render() {
        return (
            <Provider store={store}>
                <RootView>
                    <MainNavigation
                        ref={navigatorRef => {
                            NavigationService.setTopLevelNavigator(navigatorRef);
                        }}
                    />
                    <NoInternetScreen />
                </RootView>
            </Provider>
        );
    }
}