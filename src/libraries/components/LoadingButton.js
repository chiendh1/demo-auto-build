import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import AnimateLoadingButton from 'react-native-animate-loading-button';
import R from 'res/R';
import PropTypes from 'prop-types';

const {width} = Dimensions.get('window');

class LoadingButton extends Component {

    static propTypes = {
        containerStyle: PropTypes.object,
        text: PropTypes.string.isRequired,
        textStyle: PropTypes.object,
        onPress: PropTypes.func,
    }
    static defaultProps = {
        backgroundColor: R.colors.primaryColor,
        width: width * 0.78
    }

    constructor(props) {
        super(props);
        this.state = {
        };
    }

    componentDidMount() { 
        this._ismounted = true;
      }
      
      componentWillUnmount() {
         this._ismounted = false;
      }

    render() {
        return (

            <View
                style={this.props.containerStyle}>
                 <AnimateLoadingButton
                ref={c => (this.loadingButton = c)}
                width={this.props.width}
                height={40}
                title={this.props.text}
                titleFontSize={16}
                titleColor="rgb(255,255,255)"
                backgroundColor={this.props.backgroundColor}
                onPress={this.props.onPress}
                borderRadius={100}
            />
            </View>



        );
    }

    show(isShow){
        if(!this._ismounted) return;
        this.loadingButton.showLoading(isShow);
    }
}

const styles = StyleSheet.create({
    containerStyle: {
        width: width*0.78,
        borderRadius: 20,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: R.colors.primaryColor
    },
    textStyle: {
        color: 'white',
        fontSize: 16
    },
})

export default LoadingButton;
