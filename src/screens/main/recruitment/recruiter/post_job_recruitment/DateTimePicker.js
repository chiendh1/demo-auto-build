import React, { PureComponent } from 'react';
import { View, Text, TouchableOpacity, Platform, StyleSheet } from 'react-native';
import DateTimePicker from 'react-native-modal-datetime-picker';
import moment from 'moment';
import 'moment/locale/vi';
import R from 'res/R';
export default class DateTimePickera extends PureComponent {
    state = {
        isDateTimePickerVisible: false,
        date: ''
    };

    _showDateTimePicker = () => this.setState({ isDateTimePickerVisible: true });

    _hideDateTimePicker = () => this.setState({ isDateTimePickerVisible: false });

    _handleDatePicked = (date) => {
        let dateTime = moment(date).format('YYYY-MM-DD');
        this.setState({ date: dateTime })
        this._hideDateTimePicker();
    };

    getValue = () => this.state.date;

    setValue = (date) => {
        this.setState({ date })
    }

    render() {
        let locale = 'vi';
        const minSelect = new Date();
        date = this.state.date;
        let dateFormat = moment(date).toDate();
        var dateOffset = (24 * 60 * 60 * 1000) * 30;
        let min = new Date();
        min.setTime(min.getTime() + dateOffset);
        return (
            <View style={styles.container}>
                <Text style={styles.textHeader}>{R.strings.studentJobRecruitment.hint_deadline_time}</Text>
                <TouchableOpacity onPress={this._showDateTimePicker}>
                    <Text style={[styles.content, { color: date === '' ? 'grey' : R.colors.grey900 }]}>{date === '' ? R.strings.studentJobRecruitment.hint_placeholder_deadline : moment(date).format('DD-MM-YYYY')}</Text>
                </TouchableOpacity>
                <DateTimePicker
                    confirmTextIOS="Lựa chọn"
                    cancelTextIOS="Trở lại"
                    hideTitleContainerIOS
                    isVisible={this.state.isDateTimePickerVisible}
                    onConfirm={this._handleDatePicked}
                    onCancel={this._hideDateTimePicker}
                    locale={locale}
                    minimumDate={minSelect}
                    date={this.state.date === '' ? min : dateFormat}
                />
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        width: '90%',
        borderBottomColor: R.colors.greyColor,
        borderBottomWidth: 0.8,
    },
    textHeader: {
        fontSize: 16,
        fontWeight: Platform.OS === 'ios' ? '500' : '300',
        marginBottom: 5,
        color: R.colors.grey900
    },
    content: {
        marginVertical: 5,
        fontSize: 16
    }
})