import React, { PureComponent } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import PropTypes from 'prop-types';
import R from 'res/R';

class WorkerPortfolioItem extends PureComponent {


    static propTypes = {
        iconName: PropTypes.string,
        title: PropTypes.string,
        desc1: PropTypes.string,
        desc2: PropTypes.string,
    }

    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        return (
            <TouchableOpacity
                onPress={this.onPortfolioPressed}
                style={styles.container}>
                <View style={styles.contentContainerStyle}>
                    <Icon name={this.props.iconName} size={14} color={R.colors.secondaryColor} style={{marginTop: 3}}/>
                    <View style={styles.contentStyle}>
                        <Text style={styles.labelTitleStyle}>{this.props.title}</Text>
                        <Text style={styles.textDescStyle}>{this.props.desc1}</Text>
                        <Text style={styles.textDescStyle}>{this.props.desc2}</Text>
                    </View>

                </View>


            </TouchableOpacity>
        );
    }

    onPortfolioPressed = () => {
        this.props.onPortfolioPressed()
    }
}

const styles = StyleSheet.create({
    container: {
        padding: 10,
        backgroundColor: 'white',
    },

    contentContainerStyle: {
        flexDirection: 'row'
    },

    labelTitleStyle: {
        color: 'black',
        fontSize: 15,
        marginBottom: 5,

    },

    textDescStyle: {
        fontSize: 13,

    },

    contentStyle: {
        marginLeft: 10
    }
});

export default WorkerPortfolioItem;
