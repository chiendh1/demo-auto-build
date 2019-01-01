import React, { PureComponent } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, Image } from 'react-native';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import R from 'res/R';
import NumberFormat from 'react-number-format';
import CustomMarkerSlider from './CustomMarkerSlider';

export const MAX_VALUE = 2000000;
export const MIN_VALUE = 100000;

export default class SliderComponent extends PureComponent {


    static defaultProps = {
        sliderLength: 280
    }

    constructor(props) {
        super(props);
        this.state = {
            multiSliderValue: [MIN_VALUE, MAX_VALUE],
            step: 50000,
            min: MIN_VALUE,
            max: MAX_VALUE
        };
    }

    getMultiSliderValue = () => {
        return this.state.multiSliderValue;
    }

    setSteep(step, min, max) {
        this.setState({ step, min, max })
    }

    setSliderValue(minValue, maxValue) {
        this.setState({
            multiSliderValue: [minValue, maxValue],
        })
    }


    render() {
        return (
            <View style={styles.container}>
                <View style={styles.headerStyle}>
                    <NumberFormat
                        value={this.state.multiSliderValue[0]}
                        displayType={'text'}
                        thousandSeparator="." decimalSeparator=","
                        renderText={
                            value => <Text style={styles.textLeftHeader}>{value}đ</Text>
                        }
                    />
                    <NumberFormat
                        value={this.state.multiSliderValue[1]}
                        displayType={'text'}
                        thousandSeparator="." decimalSeparator=","
                        renderText={
                            value => <Text style={styles.textRightHeader}>{value}đ</Text>
                        }
                    />
                </View>
                <View style={styles.sliderStyle}>
                    <TouchableOpacity onPress={this.onDown}>
                        <Image
                            source={R.images.ic_down_slider}
                            style={styles.imgSliderStyle}
                        />
                    </TouchableOpacity>
                    <MultiSlider
                        values={[
                            this.state.multiSliderValue[0],
                            this.state.multiSliderValue[1],
                        ]}
                        sliderLength={this.props.sliderLength}
                        onValuesChange={this.multiSliderValuesChange}
                        min={this.state.min}
                        max={this.state.max}
                        step={this.state.step}
                        allowOverlap
                        snapped
                        selectedStyle={{
                            backgroundColor: R.colors.orangeColor,
                        }}
                        customMarker={CustomMarkerSlider}
                    />
                    <TouchableOpacity onPress={this.onUp}>
                        <Image
                            source={R.images.ic_up_slider}
                            style={styles.imgSliderStyle}
                        />
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    multiSliderValuesChange = values => {
        this.setState({
            multiSliderValue: values,
        });
    };

    onUp = () => {
        let up = this.state.multiSliderValue[1] + this.state.step;
        if (this.state.multiSliderValue[1] < this.state.max) {
            this.setState({
                multiSliderValue: [this.state.multiSliderValue[0], up]
            })
        }
    }
    onDown = () => {
        let down = this.state.multiSliderValue[0] - this.state.step;
        if (this.state.multiSliderValue[0] > this.state.min) {
            this.setState({
                multiSliderValue: [down, this.state.multiSliderValue[1]]
            })
        }
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: Platform.OS === 'ios' ? null : 10,
    },
    headerStyle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 5
    },
    sliderStyle: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    textLeftHeader: {
        marginLeft: Platform.OS === 'ios' ? 60 : 50,
    },
    textRightHeader: {
        marginRight: Platform.OS === 'ios' ? 60 : 50,
    },
    imgSliderStyle: {
        width: 22,
        height: 22,
        padding: 2,
    }
})