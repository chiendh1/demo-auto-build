import React, { PureComponent } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import StarRating from 'react-native-star-rating';
import R from 'res/R';
import FastImage from 'react-native-fast-image'
import { validateImage } from 'libraries/utils/utils';

class RecruiterInfo extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        const { item } = this.props;
        return (
            <View>

                <FastImage
                    style={styles.imageStyle}
                    source={item.images && item.images.length>0 ? {
                        uri: validateImage(item.images[0])
                    } : R.images.backgroungHG}
                    resizeMode={FastImage.resizeMode.cover}
                />


                <Text style={styles.recruiterNameStyle}>{item.user.name}</Text>

                <StarRating
                    disabled={true}
                    maxStars={5}
                    rating={item.user.rate_feedback}
                    starSize={12}
                    containerStyle={{ width: 70, marginTop: 2 }}
                    fullStarColor={R.colors.secondaryColor}
                />

                <Text style={[styles.recruiterNameStyle, { color: 'grey' }]}>{item.user.count_comment !==0 ? item.user.count_comment : 'Không có'} đánh giá</Text>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    imageStyle: {
        width: 115,
        height: 80,
    },

    recruiterNameStyle: {
        fontSize: 12,
        marginTop: 5,
    },

});

export default RecruiterInfo;
