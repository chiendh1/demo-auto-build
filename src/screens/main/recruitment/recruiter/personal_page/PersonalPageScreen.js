import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import Container from 'libraries/components/Container';
import Header from 'libraries/components/Header';
import R from 'res/R';
import NavigationService from 'routers/NavigationService';
import ImagePagePerson from './ImagePagePerson';
import StarRating from 'react-native-star-rating';
import ListProfile from './ListProfile';
import { getProfileOfMe, getRecruiment, getComment } from 'libraries/networking/apis';
import database from 'libraries/utils/database';
import { Status } from 'libraries/networking/status';
import ListFeedBack from './ListFeedback';

export default class PersonalPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            item: {},
            itemList: [],
            feedback: [],
            loading: true
        };
    }

    componentWillMount() {
        const { profile, recruiment } = this.props.navigation.state.params;
        if (profile) {
            this.setState({
                item: profile
            })
            getProfileOfMe(profile.user.id_users, database.tokenCache).then(response => {
                if (response.code === Status.SUSSESS) {
                    this.setState({ itemList: response.data.profile, loading: false });
                }
            }).catch(error => {
                this.setState({ loading: false })
                return error;
            })

            getComment(profile.user.id_users).then(response => {
                if (response.code === Status.SUSSESS) {
                    this.setState({ feedback: response.data.comment, loading: false });
                }
            }).catch(error => {
                this.setState({ loading: false })
                return error;
            })
        }
        if (recruiment) {
            this.setState({
                item: recruiment
            })
            getRecruiment(recruiment.user.id_users).then(res => {
                if (res.code === Status.SUSSESS) {
                    this.setState({ itemList: res.data.recruitment, loading: false })
                }
            }).catch(err => {
                this.setState({ loading: false })
                return error;
            })

            getComment(recruiment.user.id_users).then(response => {
                if (response.code === Status.SUSSESS) {
                    this.setState({ feedback: response.data.comment, loading: false });
                }
            }).catch(error => {
                this.setState({ loading: false })
                return error;
            })
        }

    }

    onLeftPressed = () => NavigationService.pop();

    render() {
        let { item } = this.state;
        const { profile, recruiment } = this.props.navigation.state.params;
        return (
            <Container>
                <View style={styles.headerStyle}>
                    <Image source={R.images.bg_person} style={styles.backgroundImage} resizeMode="cover" />
                    <Header
                        text={item.name ? item.name : item.user.name}
                        onLeftPressed={this.onLeftPressed}
                        style={{ backgroundColor: null }}
                        centerItem={{ alignItems: 'flex-start', paddingLeft: 69 }}
                    />
                    <ImagePagePerson item={item} />
                </View>
                <ScrollView>
                    {/* <View style={{ width: '100%', marginHorizontal: 15, marginTop: 15 }}>
                        <View style={{ width: '95%' }}>
                            <Text style={{ fontSize: 14, color: R.colors.orangeColor }}>Dự án đã tham gia</Text>
                        </View>
                        <View style={{ width: '87%', flexDirection: 'row', borderTopWidth: 0.5, marginLeft: 15, marginTop: 8, borderColor: R.colors.greyColor }}>
                            <Icon name="circle" size={8} style={{ paddingTop: 14 }} />
                            <Text style={{ paddingTop: 8, paddingLeft: 10, width: '95%' }}>Thi công kệ tủ bếp nhà Anh Thắng - KĐT Mỗ Lão - Hà Đông - Hà Nội</Text>
                        </View>
                    </View>
 */}
                    <View style={styles.viewListProfile}>
                        <View style={{ width: '95%', marginBottom: 5 }}>
                            <Text style={styles.textStyle}>{R.strings.personPage.text_list_profile} ({this.state.itemList.length})</Text>
                        </View>
                        <ListProfile
                            onDetailProfilePressed={this.onDetailProfilePressed}
                            listProfile={this.state.itemList}
                            onRefresh={this.onRefresh}
                            loading={this.state.loading}
                        />
                    </View>


                    <View style={styles.viewListFeedback}>
                        <View style={styles.viewStar}>
                            <Text style={[styles.textStyle, { paddingBottom: 9 }]}>{R.strings.personPage.text_feedback} ({this.state.feedback.length})</Text>
                            <StarRating
                                disabled={true}
                                maxStars={5}
                                rating={profile ? profile.user.rate_feedback : null || recruiment ? recruiment.user.rate_feedback : null}
                                starSize={15}
                                containerStyle={{ width: 85, marginTop: 6 }}
                                fullStarColor={R.colors.secondaryColor}
                            />
                        </View>
                        <ListFeedBack
                            feedback={this.state.feedback}
                            onRefresh={this.onRefresh}
                            loading={this.state.loading}
                        />
                    </View>
                </ScrollView>
            </Container>
        );
    }

    onDetailProfilePressed = (item) => () => {
        let isRecruiter = this.props.navigation.state.params.recruiment ? true : false;

        if (isRecruiter) {
            NavigationService.navigate('InfoRecruitmentMoreScreen', { item, type: isRecruiter })

        } else {
            NavigationService.navigate('InfoRecruitmentMoreScreen', { item, type: isRecruiter })
        }

    }

    onRefresh = () => {
        this.setState({ loading: true });
        this.getProfileOfMe();
        this.getRecruiment();
        this.getComment();
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    headerStyle: {
        height: 'auto',
        backgroundColor: R.colors.blue800,
    },

    button: {
        width: '100%',
        borderRadius: 0,
        backgroundColor: null,
        height: 'auto',
        alignItems: 'center',
        paddingVertical: 30,

    },
    backgroundImage: {
        width: '100%',
        opacity: 0.4,
        height: '100%',
        position: 'absolute',
        top: 0
    },
    textStyle: {
        fontSize: 13,
        color: R.colors.red800
    },
    imagePerson: {
        width: 50,
        height: 50,
        borderRadius: 25
    },
    viewListProfile: {
        width: '91%',
        marginHorizontal: 15,
        marginTop: 15,
        borderBottomWidth: 0.5,
        borderColor: R.colors.greyColor,
        paddingBottom: 10
    },
    viewListFeedback: {
        width: '91%',
        marginHorizontal: 15,
        marginTop: 15,
        paddingBottom: 10
    },
    textStyle: {
        fontSize: 14,
        color: R.colors.orangeColor
    },
    viewStar: {
        width: '100%',
        borderBottomWidth: 0.5,
        borderColor: R.colors.greyColor,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },


})
