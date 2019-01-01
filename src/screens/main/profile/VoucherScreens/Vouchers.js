import { Status } from 'libraries/networking/status';
import React, { PureComponent } from 'react';
import { View, Text, StyleSheet, FlatList, Image, Dimensions, TouchableHighlight } from 'react-native';
import NavigationService from 'routers/NavigationService';
import Container from 'libraries/components/Container';
import Header from 'libraries/components/Header';
import BaseButtonOpacity from 'libraries/components/BaseButtonOpacity';
import R from 'res/R';
import ModalVoucher from './ModalVoucher';
import { getVoucher, putVoucher } from 'libraries/networking/apis';
import database from 'libraries/utils/database';
import { showMessage } from 'libraries/utils/utils';
import ListVoucher from './ListVoucher';
import { connect } from 'react-redux';
import { onFetchUser } from '../../../../redux/actions';
import LoadingPage from 'libraries/components/LoadingPage';

const { width, height } = Dimensions.get('window');

class Vouchers extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            isVisible: false,
            voucher: [],
            data: null,
            itemPositionSelected: -1,
            loading: true
        };
        this.timer = null;
    }
    componentDidMount() {
        this.onGetVoucher()
    }

    _renderNotVoucher() {
        return (
            <View style={styles.wrapperList}>
                <Image
                    source={R.images.ic_introduce}
                    style={styles.imagesStyle}
                    resizeMode='contain'
                />
                <Text style={styles.textStyle}>{R.strings.requireIntroduce.text_havent_introduces}</Text>
            </View>
        )
    }

    _renderListVoucher() {
        return (
            <FlatList
                data={this.state.voucher}
                style={{ width: width }}
                onRefresh={this.onRefreshList}
                refreshing={this.state.loading}
                showsVerticalScrollIndicator={false}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item, index }) => {
                    return <ListVoucher item={item} onDetail={() => this.onDetail(item)} onModal={() => this.onModal(item)} />
                }}
            />
        )
    }

    _renderBody() {
        if (!this.state.loading) {
            if (this.state.voucher.length !== 0) {
                return this._renderListVoucher()
            }
            return this._renderNotVoucher();
        }
        return null;
    }
    render() {
        return (
            <Container style={styles.container}>
                <Header
                    text={R.strings.discoutCode.text_header_voucher}
                    onLeftPressed={() => NavigationService.pop()}
                />

                <View style={styles.wrapper}>
                    <View style={styles.viewButton}>
                        <BaseButtonOpacity
                            text={R.strings.discoutCode.text_discount_code}
                            containerStyle={styles.buttonDiscount}
                            onPress={() => NavigationService.navigate('DiscountCode')}
                        />
                    </View>
                    {this._renderBody()}


                </View>

                {this._renderModal()}
              
                <LoadingPage vidible={this.state.loading} />
            </Container>
        )
    }

    onDetail(item) {
        NavigationService.navigate('DetailVoucher', { item })
    }
    _renderModal() {
        return <ModalVoucher
            isVisible={this.state.isVisible}
            data={this.state.data}
            onClose={() => { this.disableModal() }}
            changeVoucher={this.changeVoucher}
        />
    }

    onRefreshList = () => {
        this.setState({ loading: true });
        this.onGetVoucher();
    }

    onGetVoucher = () => {
        getVoucher(database.tokenCache).then(response => {
            if (response.code === Status.SUSSESS) {
                this.setState({ voucher: response.data.vouchers, loading: false })
            }
        }).catch(error => {
            this.setState({ loading: false })
            return error;
        })
    }
    changeVoucher = () => {
        let data = this.state.data;

        putVoucher(database.user.id_users, database.tokenCache, data.id).then(response => {

            if (response.code === Status.SUSSESS) {
                let voucher = null;
                if (response.data.voucher.remaining_voucher === 0) {
                    voucher = this.state.voucher.filter(item => item.id !== response.data.voucher.id);
                } else {
                    voucher = this.state.voucher.map(item => {
                        if (response.data.voucher.id === item.id) {
                            item.remaining_voucher = response.data.voucher.remaining_voucher;
                        }
                        return item;
                    });
                }

                this.props.onFetchUser();

                this.timer = setTimeout(() => {
                    showMessage(R.strings.voucher.msg_change_voucher_success)
                }, 500)

                this.setState({ voucher, isVisible: false });

            } else if (response.code === Status.POINT_NOT_ENOUGH) {
                this.timer = setTimeout(() => {
                    showMessage(R.strings.voucher.msg_point_not_enought)
                }, 500)
                this.setState({ voucher, isVisible: false });

            } else if (response.code === Status.NUMBER_EXPIRED) {
                this.timer = setTimeout(() => {
                    showMessage(R.strings.voucher.msg_voucher_expired)
                }, 500)
                this.setState({ voucher, isVisible: false });

            } else if (response.code === Status.DATE_EXPIRY) {
                this.timer = setTimeout(() => {
                    showMessage(R.strings.voucher.msg_date_voucher_expiry)
                }, 500)
                this.setState({ voucher, isVisible: false });

            }
        })
    }

    componentWillUnmount() {
        if (this.timer) {
            clearTimeout(this.timer);
        }
    }

    onModal(item, index) {
        this.setState({ isVisible: true, data: item, itemPositionSelected: index })
    }
    disableModal() {
        this.setState({
            isVisible: false,
            data: null,
            itemPositionSelected: -1
        })
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    wrapper: {
        flex: 1,
        backgroundColor: R.colors.grey100,
        alignItems: 'center',
        paddingBottom: 15
    },
    viewButton: {
        width: '100%',
        backgroundColor: R.colors.white100,
        alignItems: 'center',
    },
    buttonDiscount: {
        backgroundColor: R.colors.orangeColor,
        width: '90%',
        marginVertical: 10,
        marginBottom: 20
    },
    wrapperList: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',

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

const mapDispatchToProps = dispatch => {
    return {
        onFetchUser: () => dispatch(onFetchUser(database.user.id_users, database.tokenCache)),
    }
}
export default connect(null, mapDispatchToProps)(Vouchers);