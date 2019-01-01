import React, { PureComponent } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Share } from 'react-native';
import StarRating from 'react-native-star-rating';
import R from 'res/R';
import RecruitmentListAction from '../../RecruitmentListAction';
import InfoCandidate from './InfoCandidate';
import Moment from 'moment';


class CandidateItem extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            result: '',
        };
    }
  
    render() {
        const { item, index } = this.props;
        let updated_at = Moment(item.updated_at).format('DD-MM-YYYY');
        return (
            <View style={styles.container}>

                <TouchableOpacity
                    onPress={this.props.onPress}
                >
                    <Text style={styles.jobTitleStyle}>{item.position}</Text>

                    <View style={styles.infoContainer}>
                        <View style={{ flex: 1}}>
                            <Text style={styles.labelNameStyle}>{item.user ? item.user.name : null}</Text>
                            <StarRating
                                disabled={true}
                                maxStars={5}
                                rating={item.user ? item.user.rate_feedback  : 0}
                                starSize={12}
                                containerStyle={{ width: 70, marginTop: 2 }}
                                fullStarColor={R.colors.secondaryColor}
                            />

                            <Text style={styles.labelTimeUpdatedAt}>{updated_at}</Text>
                        </View>

                        <InfoCandidate
                            isSalary
                            iconName='hand-holding-usd'
                            text={item.desired_salary}
                        />

                        <InfoCandidate
                            style={{ marginHorizontal: 5 }}
                            iconName='clock'
                            text={!item.experience ? null : item.experience.name}
                        />

                        <InfoCandidate
                            iconName='map-marker-alt'
                            text={item.city_desired}
                        />

                    </View>


                    <RecruitmentListAction
                        actionLeftPressed={this.props.onSaveProfile(item, index)}
                        name={item.save_status ? 'trash-alt' : 'save'}
                        textActionLeft={ item.save_status ? R.strings.recruitment.worker.remove_portfolio : R.strings.recruitment.worker.save_portfolio}
                        actionBetweenPressed={this.onShared(item)}
                        actionRightPressed={this.props.onCallPressed(item)}
                    />
                </TouchableOpacity>


            </View>
        );
    }
    
    onShared = (item) => () => {
        Share.share({
            message: 'Họ tên: ' + item.user.name + '\n' 
                    + 'Địa chỉ:' + item.user.address + '\n' 
                    + 'Số điện thoại:' + item.user.telephone.replace(item.user.telephone.substring(7, 10), "***") + '\n' 
                    + 'Vị trí:' + item.position + '\n'
                    + 'Tải LimberNow tại đây:' + 'https://play.google.com/store/apps/details?id=vn.noithathg',
        }).then(this.showResult)
    }

    showResult = result => {
        this.setState({ result: result })
    }

   
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: R.colors.white100,
        marginBottom: 10,
        paddingHorizontal: 10,
        paddingVertical: 10,
    },

    jobTitleStyle: {
        color: R.colors.primaryColor,
        fontSize: 15,
        marginBottom: 5
    },

    infoContainer: {
        flexDirection: 'row'
    },

    labelNameStyle: {
        fontSize: 12,
        marginBottom: 2
    },

    labelTimeUpdatedAt: {
        fontSize: 11,
        color: 'grey',
        marginTop: 3
    }

});


export default CandidateItem;