import React, { PureComponent } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Modal from "react-native-modal";
import WorkerPortfolioItem from './WorkerPortfolioItem';
import R from 'res/R';
import ImageButton from 'libraries/components/ImageButton';

class SelectWorkerPortfolio extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            isVisible: false
        };
    }

    setVisible = (isVisible) => {
        this.setState({ isVisible })
    }

    render() {
        return (

            <Modal
                style={styles.container}
                isVisible={this.state.isVisible}>

                <View style={styles.headerStyle}>
                    <ImageButton
                        containerStyle={{ position: 'absolute', left: 10 }}
                        iconName='md-close'
                        iconColor='white'
                        iconSize={14}
                        onPress={this.props.onClosePressed}
                    />

                    <Text style={styles.titleStyle}>{R.strings.selectWorkerPortfolio.title_dialog_select_portfolio}</Text>
                </View>
                <View style={styles.contentContainer}>

                    <WorkerPortfolioItem
                        iconName='file-alt'
                        title={R.strings.selectWorkerPortfolio.title_basic_portfolio}
                        desc1={R.strings.selectWorkerPortfolio.desc1_basic_portfolio}
                        desc2={R.strings.selectWorkerPortfolio.desc2_basic_portfolio}
                        onPortfolioPressed={() => { this.props.onPortfolioPressed('basic') }} />
                    <View style={styles.dividerStyle} />
                    <WorkerPortfolioItem
                        iconName='file-invoice-dollar'
                        title={R.strings.selectWorkerPortfolio.title_advanced_portfolio}
                        desc1={R.strings.selectWorkerPortfolio.desc1_advanced_portfolio}
                        desc2={R.strings.selectWorkerPortfolio.desc2_advanced_portfolio}
                        onPortfolioPressed={() => { this.props.onPortfolioPressed('advanced') }} />
                </View>
            </Modal>

        );
    }
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    dividerStyle: {
        backgroundColor: 'grey',
        height: 0.5,
        width: '100%'
    },
    headerStyle: {
        width: '95%',
        height: 35,
        backgroundColor: R.colors.secondaryColor,
        paddingHorizontal: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },

    contentContainer: {
        width: '95%',
        backgroundColor: 'white',
        padding: 10
    },

    titleStyle: {
        fontSize: 14,
        color: 'white',

    }
});

export default SelectWorkerPortfolio;
