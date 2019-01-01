import React, { PureComponent } from 'react';
import { View, StyleSheet, TouchableOpacity, Share } from 'react-native';
import R from 'res/R';
import RecruiterInfo from './RecruiterInfo';
import JobContent from './JobContent';
import RecruitmentListAction from '../../RecruitmentListAction';
import { showMessage } from 'libraries/utils/utils';
import NavigationService from 'routers/NavigationService';
import database from 'libraries/utils/database';
import { alertSign } from 'libraries/components/AlertLogin';
import constants from 'libraries/utils/constants';


class JobItem extends PureComponent {
    constructor(props) {
        super(props);
    }

    render() {
        const { item } = this.props;
        return (
            <View style={styles.container}>

                <TouchableOpacity onPress={this.props.onPress(item, this.props.index)}>

                    <View style={{ flexDirection: 'row' }}>

                        <RecruiterInfo
                            item={item}
                        />

                        <JobContent item={item} />

                    </View>

                    <RecruitmentListAction
                        name={item.save_status ? 'trash-alt' : 'save'}
                        textActionLeft={item.save_status === constants.saveProfile.save ? R.strings.recruitment.worker.remove_job : R.strings.recruitment.worker.save_job}
                        actionLeftPressed={this.props.onSavePressed(item, this.props.index)}
                        actionRightPressed={() => { this.props.onCallPressed(item) }}
                        actionBetweenPressed={() => { this.onSharePressed(item) }}
                    />

                </TouchableOpacity>
            </View>

        );
    }

    onSharePressed = (item) => {
        if (database.tokenCache) {
            if (database.user.loaitk === constants.upgradeAcc.GUEST) {
                const action = {
                    title: R.strings.main.hint_text_upgrade_mess,
                    color: R.colors.orangeColor,
                    onPress: () => NavigationService.navigate("MyHGScreen"),
                }
                showMessage(R.strings.upgradeacc.text_you_update_acc, action);
            } else {
                Share.share({
                    message: 'Họ tên: ' + item.user.name + '\n'
                        + 'Địa chỉ:' + item.user.address + '\n'
                        + 'Số điện thoại:' + item.user.telephone.replace(item.user.telephone.substring(7, 10), "***") + '\n'
                        + 'Vị trí:' + item.description + '\n'
                        + 'Tải LimberNow tại đây:' + 'https://play.google.com/store/apps/details?id=vn.noithathg',
                }).then(this.showResult)
            }
        } else {
            alertSign();
        }
    }

    showResult = result => {
        this.setState({ result: result })
    }


}


const styles = StyleSheet.create({
    container: {
        paddingVertical: 10,
        marginTop: 10,
        paddingHorizontal: 10,
        backgroundColor: R.colors.white100,
    },

});

export default JobItem;
