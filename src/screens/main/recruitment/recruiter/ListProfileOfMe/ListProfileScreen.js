import React, { Component } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import Container from 'libraries/components/Container';
import Header from 'libraries/components/Header';
import R from 'res/R';
import { getProfileOfMe, deleteProfileOfMe } from 'libraries/networking/apis';
import database from 'libraries/utils/database';
import ListNewsTask from 'libraries/components/ListNewsTask';
import constants from 'libraries/utils/constants';
import NavigationService from 'routers/NavigationService';
import Moment from 'moment';
import { showMessage } from 'libraries/utils/utils';
import { Status } from 'libraries/networking/status';
import ModalMoreListJob from 'screens/main/recruitment/recruiter/list_News_recruiment/ModalMoreListJob';

export default class ListProfileScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            loading: true,
            isVisible: false,
            item: {},
            index: -1,
        };
    }
    componentWillMount() {
        this._ListProfile();
    }



    _ListProfile = () => {
        getProfileOfMe(database.user.id_users, database.tokenCache).then(response => {
            if (response.code === Status.SUSSESS) {
                this.setState({ data: response.data.profile, loading: false })
            }
        }).catch(error => {
            this.setState({ loading: false })
            return error;
        })
    }

    onLeftPressed = () => NavigationService.pop();

    render() {
        return (
            <Container containerStyle={{ flex: 1, backgroundColor: R.colors.grey100 }}>
                <Header
                    text={R.strings.profileOfMe.text_header}
                    onLeftPressed={this.onLeftPressed}
                />
                {this._renderFlatlist()}

                {this._renderModal()}
            </Container>
        );
    }

    _renderFlatlist = () => {
        if (!this.state.loading) {
            if (this.state.data.length !== 0) {
                return (
                    <FlatList
                        data={this.state.data}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={this._renderItem}
                        onRefresh={this._onRefresh}
                        refreshing={this.state.loading}
                        style={{ marginBottom: 10 }}
                    />
                )
            } else {
                return (
                    <View style={styles.viewNoData}>
                        <Text style={styles.textNodata}>{R.strings.saveProfile.text_not_profile}</Text>
                    </View>
                )
            }
        }
        return null;

    }

    _renderItem = ({ item, index }) => {
        let updated_at = Moment(item.updated_at).format('DD-MM-YYYY');
        return (
            <View style={{ height: 70, marginBottom: 10 }}>
                <ListNewsTask
                    pupopMenu
                    textTitle={item.position}
                    textDate={updated_at.substring(0, 11)}
                    onMore={() => { this.onMore(item, index) }}
                    onClick={() => { this.onClick(item, index) }}
                    item={item}
                />
            </View>
        )
    }

    _renderModal = () => {
        return (
            <ModalMoreListJob
                isVisible={this.state.isVisible}
                onBackdropPress={() => { this.setState({ isVisible: false }) }}
                onDel={this.onDelete}
                onEdit={this.onEdit}
            />
        )
    }

    _onRefresh = () => {
        this.setState({ loading: true });
        this._ListProfile();
    }

    onClick = (item) => {

        NavigationService.navigate("DetailProfile", { item })
    }


    onMore(item, index) {
        this.setState({ isVisible: true, item, index })
    }

    onDelete = () => {
        const { item, index } = this.state;
        this.setState({ isVisible: false });
        deleteProfileOfMe(item.id, database.tokenCache).then(res => {
            if (res.code === Status.SUSSESS) {
                let data = this.state.data;
                data.splice(index, 1)
                this.setState({ data });
                showMessage(R.strings.profileOfMe.text_delete_new_profile_done);
            }
        }).catch(error => {
            showMessage(R.strings.profileOfMe.text_delete_new_profile_err);
            return error;
        })
    }

    onEdit = () => {
        const { item, index } = this.state;
        this.setState({ isVisible: false });
        if (item.type === constants.ProfileType.Student) {
            NavigationService.navigate('CreateStudentPortfolioScreen', { key: constants.CANDIDATE.STUDENT_CANDIDATE, item, _ListProfile: this._ListProfile })
        } else {
            const type = item.type === constants.ProfileType.Worker_Basic ? 'basic' : 'advanced';
            NavigationService.navigate('WorkerAdvancedPortfolioScreen', { key: constants.CANDIDATE.WORKER_CANDIDATE, item, type, _ListProfile: this._ListProfile })
        }
    }

}


const styles = StyleSheet.create({
    viewNoData: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    textNodata: {
        fontSize: 16
    }
})