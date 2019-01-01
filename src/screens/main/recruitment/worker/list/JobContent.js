import React, { PureComponent } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import R from 'res/R';
import Icon from 'react-native-vector-icons/FontAwesome5';
import constants from 'libraries/utils/constants';
import NumberFormat from 'react-number-format';
import openMap from 'react-native-open-maps';

class JobContent extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        const { item } = this.props;
        return (
            <View style={styles.contentContainer}>
                <Text style={styles.titleStyle}>{item.vacancies}</Text>
                <View style={styles.tagContainerStyle}>
                    <View style={styles.sizeIcon}>
                        <Icon name='user-tag' size={12} color={R.colors.secondaryColor} />
                    </View>
                    <Text style={styles.tagStyle}>
                        {item.service && item.service.length > 0 ? item.service[0].name : ''}
                    </Text>
                </View>


                {item.km ? <View style={styles.tagContainerStyle}>
                    <View style={styles.sizeIcon}>
                        <Icon name='map-marker-alt' size={12} color={R.colors.secondaryColor} />
                    </View>

                    <TouchableOpacity
                        onPress={this.onLocationPressed}
                    >
                        <Text style={[styles.salaryStyle, {
                            textDecorationLine: 'underline',
                            color: R.colors.primaryColor,
                        }]}>{R.strings.recruiterList.distance_from_you} {item.km} km</Text>
                    </TouchableOpacity>

                </View> : null}


                <View style={styles.tagContainerStyle}>
                    <View style={styles.sizeIcon}>
                        <Icon name='user-friends' size={12} color={R.colors.secondaryColor} />
                    </View>
                    <Text style={styles.salaryStyle}>{R.strings.recruiterList.text_need_to_recruit} {item.number_vacancies}</Text>
                </View>

                <View style={styles.tagContainerStyle}>
                    <View style={styles.sizeIcon}>
                        <Icon name='hand-holding-usd' size={12} color={R.colors.secondaryColor} />
                    </View>
                    {item.wage_max && item.wage_max !== "0" ?
                        <Text style={styles.salaryStyle}>{R.strings.recruiterList.text_wage} <NumberFormat
                            value={item.wage_min}
                            displayType={'text'}
                            thousandSeparator="." decimalSeparator=","
                            renderText={
                                value => <Text style={styles.salaryStyle}>{value}đ</Text>
                            }
                        /> - <NumberFormat
                                value={item.wage_max}
                                displayType={'text'}
                                thousandSeparator="." decimalSeparator=","
                                renderText={
                                    value => <Text style={styles.salaryStyle}>{value}đ</Text>
                                }
                            /></Text> : <Text style={styles.salaryStyle}>{R.strings.recruiterList.text_wage_agree}</Text>}
                </View>

                <View style={styles.tagContentStyle}>
                    <View style={styles.sizeIcon}>
                        <Icon name='edit' size={12} color={R.colors.secondaryColor} />
                    </View>
                    <Text
                        numberOfLines={4}
                        style={[styles.contentStyle, { marginRight: 2 }]}>{R.strings.recruiterList.text_content} {item.description}
                    </Text>
                </View>

            </View>
        );
    }

    onLocationPressed = () => {
        const { item } = this.props;
        if (item.work_location_lat_lng) {
            const coordinates = item.work_location_lat_lng.split(',');
            openMap({ latitude: Number(coordinates[0]), longitude: Number(coordinates[1]) });
        }
    }
}

const styles = StyleSheet.create({
    titleStyle: {
        color: R.colors.primaryColor,
        fontSize: 15,
        marginBottom: 5,
    },

    tagContainerStyle: {
        alignItems: 'center',
        flexDirection: 'row',
        marginBottom: 5,
    },

    tagContentStyle: {
        flexDirection: 'row',
        marginBottom: 5,
        width: '100%'
    },

    contentStyle: {
        fontSize: 12,
        paddingLeft: 5,
    },

    tagStyle: {
        color: R.colors.secondaryColor,
        fontSize: 12,
        marginLeft: 5
    },

    salaryStyle: {
        fontSize: 12,
        marginLeft: 5,
    },

    contentContainer: {
        marginLeft: 10,
        marginRight: 10,
        flex: 1,
    },
    sizeIcon: {
        width: 15,
        height: 15
    }
});

export default JobContent;
