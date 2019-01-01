import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { Dropdown } from 'react-native-material-dropdown';
import PropTypes from 'prop-types';

class HGDropdown extends Component {

    static propTypes = {
        label: PropTypes.string.isRequired,
        data: PropTypes.array,
        onChangeText: PropTypes.func,
        containerStyle: PropTypes.object,
    }

    constructor(props) {
        super(props);
        this.state = {
            value: null
        };
    }

    static defaultProps = {
        fontSize: 14
    }

    componentWillReceiveProps({ data, value }) {

        if (value !=null && data.length !== 0) {
            const val = data.find(item => {
                return item.id === value
            });
            this.setState((prev) => ({ value: val.name }))
            return
        }
        if (data !== this.props.data) {
            this.setState((prev) => ({ value: data[0].name }))
        }

    }

    render() {
        return (
            <Dropdown
                fontSize={this.props.fontSize}
                dropdownOffset={{
                    top: 15,
                    left: 15,
                }}
                rippleInsets={{
                    top: 0,
                    right: 0,
                    bottom: 0,
                    left: 0,
                }}
                label={this.props.label}
                data={this.props.data}
                value={this.state.value || ""}
                valueExtractor={(value) => value}
                labelExtractor={(value) => value.name ? value.name: ''}
                onChangeText={(value) => {
                    this.setState({ value: value.name ?value.name : '' })
                    this.props.onChangeText(value);
                }}
                containerStyle={[{ flex: 1, marginHorizontal: 5 }, this.props.containerStyle]}
            />
        );
    }
}

export default HGDropdown;
