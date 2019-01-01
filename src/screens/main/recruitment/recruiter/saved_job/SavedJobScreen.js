import React, { Component } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import Container from 'libraries/components/Container';
import Header from 'libraries/components/Header';
import R from 'res/R';
import { getSavedJob, deleteJob } from 'libraries/networking/apis';
import ListNewsTask from 'libraries/components/ListNewsTask';
import constants from 'libraries/utils/constants';
import NavigationService from 'routers/NavigationService';
import Moment from 'moment';
import database from 'libraries/utils/database';
import { Status } from 'libraries/networking/status';
import { showMessage } from 'libraries/utils/utils';
import { connect } from 'react-redux';
import { reloadSaves } from '../../../../../redux/actions';

class SavedJobScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      loading: true,
    };
  }

  componentDidMount() {
    this.getSavedJob();
  }

  getSavedJob() {
    getSavedJob(database.user.id_users, database.tokenCache).then(res => {
      const data = res.data.saved_job_id.sort((item1, item2) => {
        return item2.id - item1.id;
      })
      if (res.code === Status.SUSSESS) {
        this.setState({ data, loading: false })
      } else {
        this.setState({ loading: false })
      }
    }).catch(error => {
      this.setState({ loading: false })
      return error;
    })
  }
  onRefreshList = () => {
    this.setState({ loading: true });
    this.getSavedJob();
  }
  _render_no_data() {
    if (this.state.data.length === 0) {
      if (!this.state.loading) {
        return (
          <View style={styles.viewNoData}>
            <Text style={styles.textNodata}>{R.strings.saveJob.text_no_job_save}</Text>
          </View>
        )
      }
    } else {
      return (
        <FlatList
          data={this.state.data}
          extraData={this.state}
          keyExtractor={(item, index) => index.toString()}
          renderItem={this._renderItem}
          onRefresh={this.onRefreshList}
          refreshing={this.state.loading}
        />
      )
    }
  }

  onLeftPressed = () => {
    this.props.reloadSaves(constants.reloadList.SAVE_JOB);
    NavigationService.pop();
  }

  render() {
    return (
      <Container>
        <Header
          text={R.strings.saveJob.text_header_save_job}
          onLeftPressed={this.onLeftPressed}
        />
        {this._render_no_data()}
      </Container>
    );
  }
  _renderItem = ({ item, index }) => {
    let updated_at = item.recruitment !== null ? Moment(item.recruitment.updated_at).format('DD-MM-YYYY') : '';
    return (
      <View style={styles.content} key={index}>
        <ListNewsTask
          textTitle={item.recruitment !== null ? item.recruitment.vacancies : ''}
          textDate={updated_at !== '' ? updated_at.substring(0, 11) : ''}
          onClose={() => { this.onDelete(item, index) }}
          onClick={() => { this.onClick(item) }}
          pupopMenu={false}
        />
      </View>
    )
  }
  onClick = (item) => {
    const itemRecu = item.recruitment;
    NavigationService.navigate("InfoRecruimentScreen", { item: itemRecu, onRefreshLocalList: this.onRefreshLocalList })
  }

  onRefreshLocalList = (item) => {
    if (item) {
      this.getSavedJob();
    }
  }

  onDelete(item, index) {
    deleteJob(item.id, database.tokenCache).then(res => {
      if (res.code === Status.SUSSESS) {
        let data = this.state.data;
        data.splice(index, 1);
        this.setState({ data });
        showMessage(R.strings.saveJob.text_delete_job_done);
      } else {
        showMessage(R.strings.saveJob.text_delete_job_err);
      }
    }).catch(error => {
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

const mapDispatchToProps = dispatch => {
  return {
    reloadSaves: (text) => dispatch(reloadSaves(text))
  }
};

export default connect(null, mapDispatchToProps)(SavedJobScreen);