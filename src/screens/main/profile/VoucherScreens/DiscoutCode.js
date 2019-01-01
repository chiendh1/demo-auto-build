import { Status } from 'libraries/networking/status';
import React, { PureComponent } from 'react';
import { View, Text, StyleSheet, FlatList, Image, Dimensions } from 'react-native';

import Container from 'libraries/components/Container';
import Header from 'libraries/components/Header';
import NavigationService from 'routers/NavigationService';
import R from 'res/R';
import database from 'libraries/utils/database';
import { getHistoryVoucher } from 'libraries/networking/apis';
import LoadingPage from 'libraries/components/LoadingPage';
import FlatlistDiscountCode from './FlatlistDiscountCode'

const { width, height } = Dimensions.get('window');

export default class DiscountCode extends PureComponent {
    state = {
        historyVoucher: [],
        isLoading: true
    };
    componentDidMount() {
       this.onReListVoucher();
    }

    _renderNotVoucher() {
        return (
            <View style={styles.wrapperList}>
                <Image
                    source={R.images.ic_introduce}
                    style={styles.imagesStyle}
                    resizeMode='contain'
                />
                <Text style={styles.textStyle}>{R.strings.requireIntroduce.text_discode_introduces}</Text>
            </View>
        )
    }

    _renderListVoucher() {
        return (
           <View style={styles.wrapper}>
                <FlatList
                data={this.state.historyVoucher}
                onRefresh={this.onRefresh}
                refreshing={this.state.isLoading}
                style={{ width: width }}
                showsVerticalScrollIndicator={false}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item, index }) => {
                    return <FlatlistDiscountCode item={item} onDetail={() => this.onDetail(item)}/>
                }}
            />
           </View>
        )
    }
    onDetail(item) {
        NavigationService.navigate('DetailVoucher',  {item:item.voucher} )
    }

    _renderBody() {
        if (!this.state.isLoading) {
            if (this.state.historyVoucher.length !== 0) {
                return this._renderListVoucher();
            }
            return this._renderNotVoucher();
        }
        return null;
    }
    onRefresh = () => {
        this.setState({isLoading: true})
        this.onReListVoucher();
    }

    onReListVoucher = () => {
        getHistoryVoucher(database.user.id_users, database.tokenCache)
        .then(response => {
            if (response.code === Status.SUSSESS) {
                this.setState({ historyVoucher: response.data.code_vouchers, isLoading: false })
            }
        }).catch(error => {
            return error;
        })
    }

    render() {
        return (
            <Container style={styles.container}>
                <Header
                    text={R.strings.discoutCode.text_header_discount_code}
                    onLeftPressed={() => NavigationService.pop()}
                />
                {this._renderBody()}
                <LoadingPage visible={this.state.isLoading} />
            </Container>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    wrapperList: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
       
    },
    wrapper: {
        flex: 1,
        backgroundColor: R.colors.grey100,
        alignItems: 'center',
        paddingBottom: 15
    },
    imagesStyle: {
        width: 150,
        height: 150,
    },
    textStyle: {
        fontSize: 14,
        color: R.colors.grey500,
        paddingVertical: 45,
        paddingTop: width / 2.5,
    },
})
