import React, { Component } from 'react';
import { View, Text, Picker } from 'react-native';
import { getProvince, getDistrict, getWard } from 'libraries/networking/apis';
import HGDropdown from 'libraries/components/HGDropdown';
export default class AddressDropdown extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataPro: [],
            dataDis: [],
            dataWar: [],
            idProvince: null
        };
    }


    componentDidMount() {
        this.getProvince();

    }
    getProvince() {
        getProvince()
            .then(res => {
                this.setState({ dataPro: res.data.provinces });
                this.onChangeStatus(res.data.provinces[0]);
            })
            .catch(error => {
                return error
            })
    }

    render() {
        return (
            <View style={{ width: '90%', marginTop: 5 }}>
                <View style={{ flex: 1, flexDirection: 'row' }}>
                    <HGDropdown
                        label='Tỉnh/Tp'
                        data={this.state.dataPro}
                        onChangeText={this.onChangeStatus}
                    />

                    {
                        this.props.hideDistrict ? null : <HGDropdown label='Quận/Huyện'
                            data={this.state.dataDis}
                            onChangeText={this.onChangeStatusDis}
                        />
                    }

                </View>

                {
                    this.props.hideWard ? null : <HGDropdown label='Xã/Phường'
                        data={this.state.dataWar}
                        onChangeText={this.onChangeStatusDisa}
                    />
                }


            </View>
        );
    }
    onChangeStatus = async (value) => {
        this.props.provincer(value.name);
        if (!this.props.hideDistrict) {
            try {
                const res = await getDistrict(value.matp);
                if (res) {
                    this.setState({ dataDis: res.data.districts });
                    this.onChangeStatusDis(res.data.districts[0]);
                }
            } catch (error) {
                return error;
            }
        }

    }
    onChangeStatusDis = async (value) => {
        this.props.district(value.name);
        if(!this.props.hideDistrict) {
            try {
                const res = await getWard(value.maqh);
               
                if (res) {
                    this.setState({ dataWar: res.data.districts })
                    this.onChangeStatusDisa(res.data.districts[0]);
                }
            } catch (error) {
                return error;
            }
        }
    }
    onChangeStatusDisa = async (value) => {
        if(!this.props.hideDistrict) {
        try {
            this.props.ward(value.name)
        } catch (error) {
            return error;
        }
    }
    }
}