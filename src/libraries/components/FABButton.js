import React, { PureComponent } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Keyboard, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import ImageButton from './ImageButton';
import PropTypes from 'prop-types';
import R from 'res/R';

class FABButton extends PureComponent {

    static propTypes = {
        onPress: PropTypes.func,
        containerStyle: PropTypes.object,
    }


    constructor(props) {
        super(props)

        if (Platform.OS === 'android') {
            this.keyboardWillShow = this.keyboardWillShow.bind(this)
            this.keyboardWillHide = this.keyboardWillHide.bind(this)
        }
        this.state = {
            isVisible: true
        }
    }

    componentWillMount() {
        if (Platform.OS === 'android') {
            this.keyboardWillShowSub = Keyboard.addListener('keyboardDidShow', this.keyboardWillShow)
            this.keyboardWillHideSub = Keyboard.addListener('keyboardDidHide', this.keyboardWillHide)
        }
        
    }

    componentWillUnmount() {
        if (Platform.OS === 'android') {
            this.keyboardWillShowSub.remove()
            this.keyboardWillHideSub.remove()
        }
    }

    keyboardWillShow = event => {
        this.setState({
            isVisible: false
        })
    }

    keyboardWillHide = event => {
        this.setState({
            isVisible: true
        })
    }

    render() {

        return this.state.isVisible || Platform.OS === 'ios' ?
            <ImageButton
                containerStyle={styles.container}
                onPress={this.props.onPress}
                iconName='md-add'
                iconColor='white'
                iconSize={18}
            />
            :
            null
    }
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 15,
        right: 15,
        backgroundColor: R.colors.primaryColor,
        width: 50, height: 50,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center'
    }
});

export default FABButton;
