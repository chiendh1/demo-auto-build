import React, { PureComponent } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Container from 'libraries/components/Container';
import R from 'res/R';
import Header from 'libraries/components/Header';
import { getComment } from 'libraries/networking/apis';
import database from 'libraries/utils/database';
import StarRating from 'react-native-star-rating';
import ListFeedBack from 'screens/main/recruitment/recruiter/personal_page/ListFeedback';
import LoadingPage from 'libraries/components/LoadingPage';
import { Status } from 'libraries/networking/status';

export default class MyFeedBackScreen extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            feedback: [],
            loading: true
        };
    }

    componentDidMount() {
        this.getComment();
    }

    getComment() {
        getComment(database.user.id_users).then(res => {
            if (res.code === Status.SUSSESS) {
                this.setState({ feedback: res.data.comment, loading: false });
            } else {
                this.setState({ loading: false })
            }
        }).catch(err => {
            this.setState({ loading: false })
        })
    }

    render() {
        const { user } = this.props.navigation.state.params;
        return (
            <Container>
                <Header text={R.strings.header.hint_text_my_feedback} />
                <View style={styles.viewListFeedback}>
                    <View style={styles.viewStar}>
                        <Text style={[styles.textStyle, { paddingBottom: 9 }]}>{R.strings.personPage.text_feedback} ({this.state.feedback.length})</Text>
                        <StarRating
                            disabled={true}
                            maxStars={5}
                            rating={user.rate_feedback}
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
                <LoadingPage visible={this.state.loading} />
            </Container>
        );
    }
}
const styles = StyleSheet.create({
    viewListFeedback: {
        width: '91%',
        marginHorizontal: 15,
        marginTop: 15,
        paddingBottom: 10,
        flex: 1
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