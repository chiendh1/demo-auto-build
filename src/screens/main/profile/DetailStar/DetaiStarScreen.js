
import React, { Component } from 'react';
import { Platform, StyleSheet, View, Text } from 'react-native';
import NavigationService from 'routers/NavigationService';
import Container from 'libraries/components/Container';
import Header from 'libraries/components/Header';
import R from 'res/R';
import { getCondition } from 'libraries/networking/apis';
import { Status } from 'libraries/networking/status';
import Accordion from 'react-native-collapsible/Accordion';
import database from 'libraries/utils/database';
import Icon from 'react-native-vector-icons/Ionicons'



export default class DetailStarScreen extends Component {
    state = {
        sections: [],
        activeSections: [],

    };

    componentDidMount() {
        getCondition(database.tokenCache)
            .then(response => {
                if (response.code === Status.SUSSESS) {
                    let sections = [];
                    response.data.rightConditions.forEach(element => {
                        sections.push({
                            title: element.rate,
                            content: element.rights,
                            condition: element.conditions
                        })
                    });
                    this.setState({ sections })
                }
            }).catch(error => {
                return error;
            })
    }

    _renderHeader = (section, index, isActive) => {
        let stars = [];
        for (var i = 1; i <= 5; i++) {
            let name = 'ios-star'
            if (i > section.title) {
                name = null
            }
            stars.push((<Icon name={name} size={20} color={R.colors.orangeColor} style={styles.starStyle} key={i} />));
        }
        return (
            <View style={styles.headerStyles}>
                <View style={styles.viewTitle}>
                    <Text style={styles.headerText}>{section.title} {R.strings.detailStar.text_star}</Text>
                    {stars}
                </View>
                <Icon name={isActive ? "ios-arrow-up" : "ios-arrow-down"} size={15} style={{ paddingTop: 7 }} />
            </View>
        );
    };

    _renderContent = section => {
        return (
            <View style={styles.contentStyles}>
                <View style={styles.viewContent}>
                    <Text style={styles.titleStyle}>{R.strings.detailStar.text_request}</Text>
                    <Text style={styles.textContent}>{section.content}</Text>
                </View>
                <View style={styles.viewContent}>
                    <Text style={styles.titleStyle}>{R.strings.detailStar.text_right}</Text>
                    <Text style={styles.textContent}>{section.condition}</Text>
                </View>

            </View>
        );
    };

    _updateSections = activeSections => {
        this.setState({ activeSections });
    };


    render() {
        return (
            <Container style={styles.container}>
                <Header
                    text={R.strings.detailStar.text_header}
                    onLeftPressed={this.onLeftPressed}
                />
                <Accordion
                    underlayColor="transparent"
                    sections={this.state.sections}
                    activeSections={this.state.activeSections}
                    renderHeader={this._renderHeader}
                    renderContent={this._renderContent}
                    onChange={this._updateSections}
                />
            </Container>
        );
    }
    onLeftPressed = () => {
        const { key } = this.props.navigation.state.params;
        if (key) {
            NavigationService.navigate("MyHGScreen");
        } else {
            NavigationService.pop();
        }
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    MainContainer: {
        flex: 1,
        justifyContent: 'center',
        paddingTop: (Platform.OS === 'ios') ? 20 : 0
    },
    headerStyles: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 13,
        borderBottomWidth: 0.5,
        borderColor: R.colors.grey800,
        marginHorizontal: 15
    },
    contentStyles: {
        flexDirection: 'column',
        marginHorizontal: 15,
        marginLeft: 30
    },
    headerText: {
        fontSize: 15,
        color: R.colors.orangeColor,
        paddingRight: 7,
    },
    viewContent: {
        flex: 1,
        flexDirection: 'column',
        borderBottomWidth: 0.5,
        borderColor: R.colors.grey800,
        paddingVertical: 7
    },
    textContent: {
        color: R.colors.grey600,
        paddingVertical: 5
    },
    starStyle: {
        paddingLeft: 5,
    },
    viewTitle: {
        width: 100,
        flexDirection: 'row'
    },
    titleStyle: {
        fontWeight: 'bold'
    },
})
