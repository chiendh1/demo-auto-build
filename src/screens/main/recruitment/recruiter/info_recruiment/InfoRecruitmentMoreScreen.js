import React, { Component } from 'react';
import { View, Text } from 'react-native';
import InfoRecruimentScreen from './InfoRecruimentScreen';
import DetailProfile from 'screens/main/recruitment/recruiter/list/DetailProfile';

class InfoRecruitmentMoreScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        const { item, type } = this.props.navigation.state.params;
        if (type) {
            return (
                <InfoRecruimentScreen
                    item={item}
                />
                
            );
        } else {
            return (
                <DetailProfile
                   {...this.props}
                />
            );
        }
    }
}

export default InfoRecruitmentMoreScreen;
