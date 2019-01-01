import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, Dimensions } from 'react-native';
import Container from 'libraries/components/Container';
import Header from 'libraries/components/Header';
import R from 'res/R';
import NavigationService from 'routers/NavigationService';
import InfoProfile from './InfoProfile';
import StarRating from 'react-native-star-rating';
import BaseInput from 'libraries/components/BaseInput';
import BaseButtonOpacity from 'libraries/components/BaseButtonOpacity';
import { postComment, getCommentDetail } from 'libraries/networking/apis';
import database from 'libraries/utils/database';
import { Status } from 'libraries/networking/status';
import { showMessage } from 'libraries/utils/utils';
import TabDismissKeyboard from 'libraries/components/TabDismissKeyboard';
import LoadingButton from 'libraries/components/LoadingButton';

const { width } = Dimensions.get('window');

export default class FeedBackScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            starCount: null,
            comment: '',
            user_send: null,
        };
    }
    onStarRatingPress(rating) {
        this.setState({
            starCount: rating
        });
    }
    onComment = (comment) => {
        this.setState({ comment })
    }

    componentDidMount() {
        this.getFeedback();
    }

    getFeedback = () => {
        const { profile } = this.props.navigation.state.params;
        if (profile) {
            getCommentDetail(profile.id, database.tokenCache).then(res => {
                this.setState({ user_send: res.data.comment_detail })

            }).catch(error => {
                return error;
            })
        }

    }

    render() {
        const item = this.props.navigation.state.params.user;
        const { user_send } = this.state;
        return (
            <Container>
                <TabDismissKeyboard>
                    <View style={styles.wrapper}>
                        <View style={styles.headerStyle}>
                            <Image source={R.images.bg_person} style={styles.backgroundImage} resizeMode="cover" />
                            <Header
                                text={item ? item.user.name : null || user_send ? user_send.user.name : null}
                                onLeftPressed={() => NavigationService.pop()}
                                style={{ backgroundColor: null }}
                                centerItem={styles.centerItem}
                            />
                            <InfoProfile
                                item={item || user_send}
                            />
                        </View>

                        {user_send ? null :
                            <View style={{ alignItems: 'center', marginTop: 30 }}>
                                <StarRating
                                    disabled={false}
                                    maxStars={5}
                                    starSize={30}
                                    containerStyle={styles.starStyle}
                                    emptyStarColor={R.colors.orangeColor}
                                    rating={this.state.starCount}
                                    selectedStar={(rating) => this.onStarRatingPress(rating)}
                                    fullStarColor={R.colors.orangeColor}
                                />
                                <Text style={styles.textStyle}>{R.strings.feedback.text_feed_back}</Text>
                            </View>
                        }

                        {user_send ?
                            <View style={{ flex: 1, alignItems: 'center' }}>
                                <Text style={styles.evaluateStyle}>Đánh giá</Text>
                                <StarRating
                                    disabled={true}
                                    maxStars={5}
                                    rating={user_send ? user_send.rate : null}
                                    starSize={30}
                                    containerStyle={styles.starFeedback}
                                    fullStarColor={R.colors.secondaryColor}
                                />
                                <Text style={styles.contentStyle}>{user_send.contents.toUpperCase()}!</Text>

                            </View>
                            :
                            <View style={{ alignItems: 'center' }}>
                                <BaseInput
                                    style={styles.baseInput}
                                    placeholder={R.strings.feedback.text_placeholder}
                                    placeholderTextColor='#999999'
                                    underlineColorAndroid="transparent"
                                    multiline={true}
                                    onChangeText={this.onComment}
                                    textAlignVertical={'top'}
                                />
                            </View>
                        }

                        {user_send ? null :
                            <View style={styles.buttonStyle}>
                                <LoadingButton
                                    ref={c => (this.loadingButton = c)}
                                    width={width - 60}
                                    backgroundColor={R.colors.orangeColor}
                                    text={R.strings.feedback.label_send_feedback}
                                    containerStyle={styles.button}
                                    onPress={() => this.onFeedBack(item)}
                                />
                            </View>
                        }
                    </View>
                </TabDismissKeyboard>
            </Container>
        );
    }

    onFeedBack = (item) => {
        if (this.state.starCount === null) {
            showMessage(R.strings.feedback.msg_star_empty)
            return;
        }
        if (this.state.comment.length === 0) {
            showMessage(R.strings.feedback.msg_commentr_empty)
            return;
        }

        this.loadingButton.show(true);
        try {
            postComment(database.tokenCache,
                {
                    contents: this.state.comment,
                    rate: this.state.starCount,
                    user_send: item.user_id,
                    user_receive: item.user_receive,
                    profile_id: item.profile_id,
                    recruitment_id: item.recruitment_id,
                }).then(response => {
                    this.loadingButton.show(false);
                    if (response.code === Status.SUSSESS) {
                        NavigationService.pop();
                        showMessage(R.strings.feedback.msg_send_feedback_success);
                    }
                })

        } catch (error) {
            return error;
        }
    }
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
    },
    headerStyle: {
        height: 'auto',
        backgroundColor: R.colors.blue800,
    },
    backgroundImage: {
        width: '100%',
        opacity: 0.4,
        height: '100%',
        position: 'absolute',
        top: 0
    },
    centerItem: {
        alignItems: 'flex-start',
        paddingLeft: 69
    },
    viewFeedback: {
        width: '100%',
        flexDirection: 'row',
        paddingVertical: 25
    },
    starStyle: {
        width: width - 130,
        paddingBottom: 5
    },
    baseInput: {
        fontSize: 13,
        borderWidth: 0.5,
        borderColor: '#CCCCCC',
        borderRadius: 3,
        minHeight: 150,
        width: '94%',
        marginVertical: 35,
        paddingVertical: 10,
        paddingHorizontal: 10,
    },
    buttonStyle: {
        width: '100%',
        height: '20%',
        alignItems: 'center',
        justifyContent: 'flex-end',
        marginBottom: 30
    },
    button: {
        width: '90%',
        paddingBottom: 2,
        borderRadius: 20,
    },
    starFeedback: {
        width: width/2 + 30,
        marginTop: 2,
        paddingTop: 15
    },
    textStyle: {
        color: '#999999', 
        fontSize: 12, 
        paddingTop: 7
    },
    evaluateStyle: {
        fontSize: 18, 
        marginTop: 40, 
        color: '#666666'
    },
     contentStyle: {
        fontSize: 16, 
        color: '#666666', 
        textAlign: 'center', 
        paddingTop: 10, 
        marginHorizontal: 15, 
        lineHeight: 25
     }
})
