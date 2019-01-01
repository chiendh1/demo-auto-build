import React, { Component } from 'react';
import { View, Text, Dimensions, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import NumberFormat from 'react-number-format';

const {width} = Dimensions.get('window');

export default class ContentProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        return (
            <View style={styles.wrapper}>
                <Icon name="circle" size={7} style={styles.icon} />
                <Text style={styles.lableStyle}>{this.props.lable}</Text>

                {
                    this.props.isSalary ? 
                    <NumberFormat
                        value={this.props.text}
                        displayType={'text'}
                        thousandSeparator="." decimalSeparator=","
                        renderText={
                            value => <Text style={styles.moneyStyle}>{value}đ</Text>
                        }
                    />
                    : 
                    <Text style={styles.textStyle}>{this.props.text}</Text>
                }
                
            </View>
        );
    }
}


const styles = StyleSheet.create({
    wrapper: {
        flexWrap: 'wrap', 
        flexDirection: 'row', 
        marginHorizontal: 10,
    },
    icon: {
        color: '#999999', 
        paddingTop: 7
    },
    moneyStyle: {
        fontSize: 13, 
        paddingLeft: 7, 
        color: '#111111'
    },
    lableStyle: {
        paddingLeft: 7, 
        color: '#999999'
    },
    textStyle: {
        paddingLeft: 15, 
        color: '#111111' , 
        fontSize: 13
    }
})