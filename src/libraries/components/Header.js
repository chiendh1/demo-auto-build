import React, { PureComponent } from 'react';
import { View, Text, Platform, StatusBar, StyleSheet, TouchableOpacity, TouchableHighlight } from 'react-native';
import PropTypes from 'prop-types';
import ImageButton from './ImageButton';
import NavigationService from 'routers/NavigationService';
import R from 'res/R';
export const STATUS_BAR_HEIGHT = Platform.OS === 'ios' ? 0 : 0;
export const HEADER_HEIGHT = Platform.OS === 'ios' ? 44 + STATUS_BAR_HEIGHT : 56 + STATUS_BAR_HEIGHT;




class Header extends PureComponent {

    static propTypes = {
        text: PropTypes.string,
        onRightPressed: PropTypes.func,
        onLeftPressed: PropTypes.func,
        isShowRightIcon: PropTypes.bool,
        isShowLeftIcon: PropTypes.bool,
        searchPlaceholder: PropTypes.string,
        onSearch: PropTypes.func,
    }

    static defaultProps = {
        onLeftPressed: () => NavigationService.pop()
    }


    constructor(props) {
        super(props);
    }

    render() {

        let menuLeft = <ImageButton
            onPress={this.props.onLeftPressed}
            iconName='ios-arrow-back'
        />

        let menuRight = <View />


        return (

            <View style={[styles.container, this.props.style]}>

                <View style={styles.headerContainer}>
                    <View style={styles.leftItem}>
                        {menuLeft}
                    </View>

                    <View style={[styles.centerItem, this.props.centerItem]}>
                        <Text style={styles.textStyle}>{this.props.text}</Text>
                    </View>

                    <View style={styles.rightItem}>
                        {menuRight}
                    </View>

                </View>
            </View>

        );
    }

}

const styles = StyleSheet.create({
    container: {
        paddingTop: STATUS_BAR_HEIGHT,
        width: '100%',
        height: HEADER_HEIGHT,
        backgroundColor: R.colors.primaryColor,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    headerContainer: {
        paddingHorizontal: 12,
        flex: 1, flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    leftItem: {
        flex: 1,
        alignItems: 'flex-start',
    },
    centerItem: {
        flex: 5,
        alignItems: 'center',
    },
    rightItem: {
        flex: 1,
        alignItems: 'flex-end',
    },

    textStyle: {
        color: 'white',
        fontSize: 18,
        textAlign: 'center'
    }
});



export default Header;
