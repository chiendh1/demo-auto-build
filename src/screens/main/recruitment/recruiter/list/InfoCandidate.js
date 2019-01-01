import React, { PureComponent } from 'react';
import { View, Text, Dimensions } from 'react-native';
import R from 'res/R';
import Icon from 'react-native-vector-icons/FontAwesome5';
import PropTypes from 'prop-types';
import NumberFormat from 'react-number-format';

const {width} = Dimensions.get('window');

class InfoCandidate extends PureComponent {
    
    static propTypes = {
        style: PropTypes.object,
        iconName: PropTypes.string,
        text: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    }

    render() {
        return (
            <View style={[{ alignItems: 'center',  width: width/4-10}, this.props.style]}>
                <Icon name={this.props.iconName} size={13} color={R.colors.secondaryColor} />
                {
                    this.props.isSalary ? 
                    <NumberFormat
                        value={this.props.text}
                        displayType={'text'}
                        thousandSeparator="." decimalSeparator=","
                        renderText={
                            value => <Text style={{ fontSize: 11, marginTop: 3 }}>{value}đ</Text>
                        }
                    />
                    : 
                    <Text style={{ fontSize: 11, marginTop: 3, textAlign: 'center' }}>{this.props.text}</Text>
                }
                
            </View>
        );
    }
}

export default InfoCandidate;
