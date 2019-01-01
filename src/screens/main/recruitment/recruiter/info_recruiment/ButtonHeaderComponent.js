import React, { PureComponent } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import BaseButtonOpacity from 'libraries/components/BaseButtonOpacity';
import R from 'res/R';

const { width, height } = Dimensions.get('window');
import Icon from 'react-native-vector-icons/FontAwesome5';

export default class ButtonHeaderComponent extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
        };
    }


    _render_btn_save() {
        if (this.props.activeSave === true) {
            return (
                <BaseButtonOpacity
                    color={R.colors.primaryColor}
                    name='save'
                    containerStyle={styles.containerStyle}
                    text={this.props.textLeft}
                    textStyle={styles.textButtonStyle}
                    onPress={this.props.onSave}
                />
            )
        }
    }

    render() {
        return (
            <View style={styles.container}>
                {this._render_btn_save()}
                <BaseButtonOpacity
                    color={R.colors.primaryColor}
                    name='share-alt'
                    containerStyle={[styles.containerStyle, { width: this.props.activeSave === true ? null : '40%'}]}
                    text={R.strings.infoRecruiment.text_share}
                textStyle={styles.textButtonStyle}
                onPress={this.props.onShare}
                />
                <View style={styles.viewDateStyle}>
                    <Icon name='clock' size={16} color={R.colors.primaryColor} />
                    <Text style={[styles.textButtonStyle, { marginLeft: 5 }]}>{this.props.textActionRight}</Text>
                </View>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        marginTop: 10,
        flex: 1,
        justifyContent: 'space-between',
    },
    containerStyle: {
        height: 25,
        borderWidth: 0.8,
        borderRadius: 15,
        paddingHorizontal: 6,
        paddingVertical: 3,
        marginRight: 3,
        backgroundColor: R.colors.white100,
        width: null,
        borderColor: R.colors.primaryColor,
    },
    textButtonStyle: {
        fontSize: 12,
        color: R.colors.primaryColor
    },
    viewDateStyle: {
        height: 25,
        borderWidth: 0.8,
        borderRadius: 15,
        paddingHorizontal: 10,
        paddingVertical: 3,
        backgroundColor: R.colors.white100,
        width: '50%',
        borderColor: R.colors.primaryColor,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    }
})