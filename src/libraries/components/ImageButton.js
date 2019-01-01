import React, { PureComponent } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import PropTypes from 'prop-types';

class ImageButton extends PureComponent {

    static propTypes = {
        onPress: PropTypes.func,
        iconName: PropTypes.string,
        iconColor: PropTypes.string,
        iconSize: PropTypes.number,
        containerStyle: PropTypes.object,
    }

    static defaultProps = {
        iconSize: 24,
        iconColor: '#FFF',
    }

    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        return (
            <TouchableOpacity
                style={[styles.container, this.props.containerStyle]}
                underlayColor="transparent"
                onPress={this.props.onPress}
            >
                <Icon name={this.props.iconName} size={this.props.iconSize} color={this.props.iconColor} />
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        padding: 5
    }
})

export default ImageButton;
