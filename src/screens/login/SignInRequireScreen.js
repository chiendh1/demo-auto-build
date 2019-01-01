import React, { Component } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import Container from 'libraries/components/Container';
import R from 'res/R';
import BaseButtonOpacity from 'libraries/components/BaseButtonOpacity';
import NavigationService from 'routers/NavigationService';

class SignInRequireScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        return (
            <Container containerStyle={styles.container}>
                <Image
                    source={R.images.ic_signin}
                    style={styles.imageStyle}
                    resizeMode='center'
                />

                <Text style={styles.textStyle}>{R.strings.requireSignIn.text_havent_login}</Text>

                <BaseButtonOpacity
                onPress={this.onSignInPressed}
                    text={R.strings.requireSignIn.sign_in}
                />
            </Container>
        );
    }

    onSignInPressed = () => {
        NavigationService.navigate('LoginScreen')
    }
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center'
    },

    textStyle: {
        fontSize: 16,
        color: 'black',
        marginVertical: 20
    },
    imageStyle: {
        width: '70%',
       height: '40%'
    }
});

export default SignInRequireScreen;
