import React, { Component } from 'react';
import { View, Text, StyleSheet, FlatList, Image } from 'react-native';
import R from 'res/R'
import StarRating from 'react-native-star-rating';
import { validateImage } from 'libraries/utils/utils';

export default class ListFeedBack extends Component {
    state = {
        loading: true
    }

    _render_flasList() {
        const { feedback } = this.props;
        if (feedback.length === 0) {
            return (
                <View style={styles.feedbackEmpty}>
                    <Text>{R.strings.feedback.text_feedback_empty}</Text>
                </View>
            )
        } else {
            return (
                <FlatList
                    data={feedback}
                    keyExtractor={this._keyExtractor}
                    renderItem={this._renderItem}
                    onRefresh={this.props.onRefresh}
                    refreshing={this.props.loading}
                />
            )
        }
    }

    render() {
        return (
            <View style={{ width: '100%', flex:1 }}>
                {this._render_flasList()}
            </View>
        );
    }

    _keyExtractor = (item, index) => index.toString();

    _renderItem = ({ item }) => {
        let source = R.images.ic_image
        if (item.user.avatar) {
            source = {
                uri: validateImage(item.user.avatar)
            }
        }
        return (
            <View style={styles.viewFeeback}>
                <Image source={source} style={styles.imagePerson} resizeMode="cover" />
                <View style={{ flex: 1, justifyContent: 'center' , marginTop: -10 }}>
                    <View style={styles.viewInfo}>
                        <Text style={styles.textName}>{item.user.name}</Text>
                        <Text style={styles.textProject}>{R.strings.feedback.text_project} {item.profile ? item.profile.position : null || item.recruitment ? item.recruitment.vacancies : null}</Text>
                        <StarRating
                            disabled={true}
                            maxStars={5}
                            rating={item.rate}
                            starSize={12}
                            containerStyle={{ minWidth: 70 }}
                            fullStarColor={R.colors.secondaryColor}
                        />
                    </View>
                    <Text style={styles.textContent}>{item.contents}</Text>
                </View>
            </View>
        )
    }
}


const styles = StyleSheet.create({
    viewFeeback: {
        flexDirection: 'row',
        borderBottomWidth: 0.5,
        borderColor: '#CCCCCC',
        paddingVertical: 10,
        width: '100%',
    },
    imagePerson: {
        width: 50,
        height: 50,
        borderRadius: 25,
    },
    viewInfo: {
        flexDirection: "row",
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingLeft: 10
    },
    textProject: {
        fontSize: 10,
        color: R.colors.primaryColor,
        maxWidth: 120,
        alignItems: 'flex-start'
    },
    textName: {
        color: '#111111', 
        fontSize: 14, 
        maxWidth: 80,
        alignItems: 'flex-start'
    },
    textContent: {
        fontSize: 12, 
        paddingLeft: 10, 
        paddingTop: 5, 
        color: R.colors.grey800
    },
    feedbackEmpty: {
        alignItems: 'center', 
        justifyContent: 'center', 
        marginVertical: 20
    }
})