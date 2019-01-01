import React, { Component } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import Container from 'libraries/components/Container';
import Header from 'libraries/components/Header';
import R from 'res/R';
import { getRecruiment, deleteRecruiment } from 'libraries/networking/apis';
import database from 'libraries/utils/database';
import ListNewsTask from 'libraries/components/ListNewsTask';
import constants from 'libraries/utils/constants';
import NavigationService from 'routers/NavigationService';
import Moment from 'moment';
import ModalMoreListJob from './ModalMoreListJob';
import { showMessage } from 'libraries/utils/utils';
import { Status } from 'libraries/networking/status';

export default class ListNewsRecruimentScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      isVisible: false,
      item: {},
      index: -1,
      loading: true
    };
  }

  componentDidMount() {
    this.getRecruiment();
  }

  componentWillReceiveProps(props) {
    if (props.navigation.state.params.key === constants.RECRUITER.EDIT_JOB) {
      this.getRecruiment();
    }
  }

  getRecruiment() {
    getRecruiment(database.user.id_users, database.tokenCache).then(res => {
      this.setState({ data: res.data.recruitment, loading: false })
    }).catch(error => {
      this.setState({ loading: false })
      return error;
    })
  }

  onRefreshList = () => {
    this.setState({ loading: true });
    this.getRecruiment();
  }

  _render_FlastList() {
    if (this.state.data.length === 0) {
      if (!this.state.loading) {
        return (
          <View style={styles.viewNoData}>
            <Text style={styles.textNodata}>{R.strings.recruiterList.text_no_news_recruiment}</Text>
          </View>
        )
      }
    } else {
      return (
        <FlatList
          data={this.state.data}
          extraData={this.state.indexPopup}
          keyExtractor={(item, index) => index.toString()}
          renderItem={this._renderItem}
          onRefresh={this.onRefreshList}
          refreshing={this.state.loading}
        />
      )
    }
  }

  _render_modal_more() {
    return (
      <ModalMoreListJob
        isVisible={this.state.isVisible}
        onBackdropPress={() => { this.setState({ isVisible: false }) }}
        onDel={this.onDelete}
        onEdit={this.onEdit}
      />
    )
  }


  render() {
    return (
      <Container>
        <Header
          text={R.strings.header.hint_list_news_recruiment}
        />
        {this._render_FlastList()}
        {this._render_modal_more()}
      </Container>
    );
  }
  _renderItem = ({ item, index }) => {
    let updated_at = Moment(item.expiration_date).format('DD-MM-YYYY');
    return (
      <View style={styles.content} key={index}>
        <ListNewsTask
          pupopMenu={true}
          textTitle={item.vacancies}
          textDate={updated_at.substring(0, 11)}
          onMore={() => { this.onMore(item, index) }}
          onClick={() => { this.onClick(item) }}
        />
      </View>
    )
  }
  onClick = (item) => {
    NavigationService.navigate("InfoRecruimentScreen", { item })
  }
  onMore(item, index) {
    this.setState({ isVisible: true, item, index })
  }
  onEdit = () => {
    this.setState({ isVisible: false });
    const item = this.state.item;
    if (item.type === constants.ProfileType.Student) {
      NavigationService.navigate("PostJobRecruitmentScreen", { key: constants.RECRUITER.STUDENT_RECRUITER, item })
    } else if (item.type === constants.ProfileType.Worker_Basic) {
      NavigationService.navigate("PostJobRecruitmentScreen", { key: constants.RECRUITER.WORKER_RECRUITER, item })
    }
  }
  onDelete = () => {
    const { item, index } = this.state;
    this.setState({ isVisible: false });
    deleteRecruiment(item.id, database.tokenCache).then(res => {
      if (res.code === Status.SUSSESS) {
        let data = this.state.data;
        data.splice(index, 1)
        this.setState({ data });
        showMessage(R.strings.recruiterList.text_delete_new_job_done);
      } else {
        showMessage(R.strings.recruiterList.text_delete_new_job_err);
      }
    }).catch(error => {
      showMessage(R.strings.recruiterList.text_delete_new_job_err);
      return error;
    })
  }
}
const styles = StyleSheet.create({
  content: {
    backgroundColor: R.colors.grey100,
    flex: 1
  },
  viewNoData: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textNodata: {
    fontSize: 16
  }
})
