import React, { Component } from 'react';
import { View, Text, StyleSheet, Dimensions, Image } from 'react-native';
import R from 'res/R';
import Icon from 'react-native-vector-icons/FontAwesome5';
import StarRating from 'react-native-star-rating';
import { validateImage } from 'libraries/utils/utils';

const { width, height } = Dimensions.get('window');

export default class DetailInfoProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        const { profile } = this.props;

        let source = R.images.ic_image;
        if (profile.user && profile.user.avatar) {
            source = {
                uri: validateImage(profile.user.avatar)
            }
        }

        return (
            <View style={styles.personStyle}>
                <View style={styles.viewPerson}>
                    <View style={styles.viewCircle}>
                        <Image source={source} style={styles.imagePerson} />
                    </View>
                    <StarRating
                        disabled={true}
                        maxStars={5}
                        rating={profile.user ? profile.user.rate_feedback : null}
                        starSize={12}
                        containerStyle={{ width: 70, marginTop: 2 }}
                        fullStarColor={R.colors.secondaryColor}
                    />
                </View>
                <View style={styles.infoPerson}>
                    <Text style={styles.textName}>{profile.user ? profile.user.name : null}</Text>
                    {/* <View style={styles.viewEnvelop}>
                        <Icon name='envelope' size={15} style={styles.colorIcon} />
                        <Text style={styles.textStyle}>{R.strings.detailProfile.text_email}{item.user ? item.user.email : null}</Text>
                    </View> */}
                    <View style={styles.viewTelephone}>
                        <Icon name='phone-volume' size={15} style={styles.colorIcon} />
                        <Text style={styles.textStyle}>{R.strings.detailProfile.text_phone} {profile.user ? profile.user.telephone.replace(profile.user.telephone.substring(7, 10), "***") : null}</Text>
                    </View>
                    <View style={styles.viewAddress}>
                        <Icon name='map-marker-alt' size={15} style={[styles.colorIcon, { paddingTop: 3 }]} />
                        <Text style={styles.textStyle} >{R.strings.detailProfile.text_address} {profile.user ? profile.user.address : null}</Text>
                    </View>
                </View>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    personStyle: {
        width: width - 20,
        borderWidth: 0.5,
        borderColor: R.colors.grey500,
        borderStyle: 'dashed',
        marginHorizontal: 10,
        marginTop: 10,
        borderRadius: 3,
        flexDirection: 'row',
        paddingVertical: 15
    },
    viewPerson: {
        width: 90,
        justifyContent: 'center',
        alignItems: 'center',
    },
    viewCircle: {
        width: 70, 
        height: 70,
        borderRadius: 35,
        borderWidth: 0.5,
        borderColor: R.colors.grey500
    },
    imagePerson: {
        width: 69, 
        height: 69,
        borderRadius: 69 / 2
    },
    infoPerson: {
        justifyContent: 'center'
    },
    textName: {
        fontSize: 18,
        color: R.colors.primaryColor
    },
    viewEnvelop: {
        flexDirection: 'row',
        paddingTop: 10
    },
    viewTelephone: {
        flexDirection: 'row',
        paddingTop: 5
    },
    textStyle: {
        paddingLeft: 10,
        fontSize: 12
    },
    viewAddress: {
        width: width / 2 + 20,
        flexDirection: 'row',
        paddingTop: 5
    },
    colorIcon: {
        color: R.colors.orangeColor
    }
})