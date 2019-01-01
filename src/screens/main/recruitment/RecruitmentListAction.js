import React, { PureComponent } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import R from 'res/R';
import BaseButtonOpacity from 'libraries/components/BaseButtonOpacity';
import PropTypes from 'prop-types';

class RecruitmentListAction extends PureComponent {
    
    static propTypes = {
        textActionLeft: PropTypes.string,
        textActionMiddle: PropTypes.string,
        textActionRight: PropTypes.string,

        actionLeftPressed: PropTypes.func,
        actionMiddlePressed: PropTypes.func,
        actionRightPressed: PropTypes.func,
    }

    static defaultProps = {
        textActionLeft: R.strings.recruitment.worker.save_portfolio,
        textActionMiddle: R.strings.recruitment.worker.share,
        textActionRight: R.strings.recruitment.worker.call_now,
    }

    render() {
        return (
            <View style={styles.actionContainer}>

                <BaseButtonOpacity
                    color={R.colors.primaryColor}
                    name={this.props.name}
                    containerStyle={styles.containerStyle}
                    text={this.props.textActionLeft}
                    textStyle={styles.textButtonStyle}
                    onPress={this.props.actionLeftPressed}
                />
                <BaseButtonOpacity
                    color={R.colors.primaryColor}
                    name='share-alt'
                    containerStyle={styles.containerStyle}
                    text={this.props.textActionMiddle}
                    textStyle={styles.textButtonStyle}
                    onPress={this.props.actionBetweenPressed}
                />

                <BaseButtonOpacity
                    color={R.colors.primaryColor}
                    name='phone'
                    containerStyle={styles.containerStyle}
                    text={this.props.textActionRight}
                    textStyle={styles.textButtonStyle}
                    onPress={this.props.actionRightPressed}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    

    textButtonStyle: {
        fontSize: 12,
        color: R.colors.primaryColor
    },
    containerStyle: {
        width: 100,
        height: 30,
        borderWidth: 0.8,
        borderRadius: 15,
        paddingVertical: 3,
        paddingHorizontal: 10,
        backgroundColor: 'white',
        // flex: 1
    },

    actionContainer: {
        flexDirection: 'row',
        marginTop: 10,
        justifyContent: 'space-between'
    }
});

export default RecruitmentListAction;
