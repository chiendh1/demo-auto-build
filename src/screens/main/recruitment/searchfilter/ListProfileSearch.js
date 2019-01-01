import React, { Component } from 'react';
import { View, Text } from 'react-native';
import Container from 'libraries/components/Container';
import Header from 'libraries/components/Header';
import R from 'res/R';
import NavigationService from 'routers/NavigationService';
import CandidateListScreen from '../recruiter/list/CandidateListScreen';
import database from 'libraries/utils/database';
import constants from 'libraries/utils/constants';
import RecruiterListScreen from '../worker/list/RecruiterListScreen';

export default class ListProfileSearch extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    const { filterData, routeKey, type } = this.props.navigation.state.params;

    return (
      <Container>
        <Header
          text={type === 'cityInMax' ? filterData.cityName : R.strings.searchFilter.title_filter_results}
          onLeftPressed={() => NavigationService.pop()}
        />
        {
          database.user &&
            (database.user.loaitk === constants.upgradeAcc.KTS
              || database.user.loaitk === constants.upgradeAcc.NX
              || database.user.loaitk === constants.upgradeAcc.NBS) ?
            <CandidateListScreen
              filterData={filterData}
              routeKey={routeKey}
            /> :
            <RecruiterListScreen
              filterData={filterData}
              routeKey={routeKey}
            />
        }


      </Container>
    );
  }
}
