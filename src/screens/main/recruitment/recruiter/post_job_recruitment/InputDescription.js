import React, { PureComponent } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import BaseInput from 'libraries/components/BaseInput';
import R from 'res/R';

class InputDescription extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            value: 'Để đi đến Thành công là cả một chặng đường dài, chắc chắn sẽ gặp nhiều chông gai nhưng tập thể Vinsofts luôn xác định mỗi một dự án thành công, mỗi một khách hàng hài lòng, mỗi một mục tiêu hoàn thành chính là những Cột mốc trên Con đường đi đến Thành công đó'
        }
    }

    getValue = () => this.state.value

    setValue = (value) => {
        this.setState({ value })
    }


    onChangeText = text => {
        this.setState({ value: text })
    }


    render() {
        return (
            <View style={styles.viewInputDesWork}>
                <BaseInput
                    style={styles.inputDesWork}
                    {...this.props}
                    value={this.state.value}
                    onChangeText={this.onChangeText}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    viewInputDesWork: {
        borderColor: R.colors.greyColor,
        borderWidth: 0.8,
        height: 80,
        borderRadius: 5,
        width: '90%'
    },
    inputDesWork: {
        borderBottomColor: null,
        borderBottomWidth: null,
        width: '97%',
        marginBottom: null,
        marginLeft: 5,
        marginRight: 5
    },
})
export default InputDescription;
