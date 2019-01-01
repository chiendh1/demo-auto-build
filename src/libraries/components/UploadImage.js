import React, { PureComponent } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, FlatList, Dimensions } from 'react-native';
import PropTypes from 'prop-types';
import R from 'res/R';
import Icon from 'react-native-vector-icons/Ionicons';
import database from 'libraries/utils/database';
import { getImg } from './GetImageAbum';
import { postUploadImage } from 'libraries/networking/apis';
import { Status } from 'libraries/networking/status';
import { showMessage } from 'libraries/utils/utils';
import _ from 'lodash';
const { width, height } = Dimensions.get('window');

export default class UploadImage extends PureComponent {
    static propTypes = {
        addimgSV: PropTypes.number,
        onAddImg: PropTypes.func,
    }

    constructor(props) {
        super(props);
        this.state = {
            images: this.props.data || [],
        }

        this.onPressAddImg = _.debounce(this.onPressAddImg, 100);
    }

    getImage = () => this.state.images

    setImages = (images) => {
        this.setState({ images })
    }
    render() {
        return (
            <View style={[styles.container, this.props.style]}>
                {this._render_imgSV()}
            </View>
        );
    }



    _render_imgSV() {
        let { images } = this.state;
        let { numColumns, horizontal } = this.props;
        if (!numColumns) numColumns = 1;
        if (!horizontal) horizontal = false;
        return (
            <View style={{ marginHorizontal: 10, flex: 1 }}>
                <FlatList
                    ref='flatlist'
                    style={{ flex: 1 }}
                    data={images}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={this._renderItem}
                    horizontal={horizontal}
                    numColumns={numColumns}
                    showsHorizontalScrollIndicator={false}
                    ListFooterComponent={this.renderFooter}
                    onEndReachedThreshold={0.5}
                />
            </View>
        )
    }

    uploadProgress = (progress) => {
        this.props.uploadProgress(progress)
    }

    onAddImagePressed = async () => {
        const source = await getImg();
        postUploadImage(database.tokenCache, source, this.uploadProgress).then(res => {
            if (res.code === Status.SUSSESS) {
                this.uploadProgress(0)
                const uri = res.data.images[0];
                this.setState({ images: [...this.state.images, uri] }, ()=> {
                    
                })
                setTimeout(() => {
                    this.refs.flatlist.scrollToEnd();
                }, 200)
            } else {
                this.uploadProgress(0)
                showMessage(R.strings.validate.msg_upload_image_error);
            }
        }).catch(err => {
            this.uploadProgress(0)
            showMessage(R.strings.validate.msg_upload_image_error);
        });
    }

    renderFooter = () => {
        if (this.state.images && this.state.images.length < 10) {
            return (
                <TouchableOpacity onPress={this.onPressAddImg}>
                    <View style={styles.imgAdd}>
                        <Image
                            source={R.images.add_imgSV}
                            style={styles.img1}
                        />
                    </View>
                </TouchableOpacity>
            )
        }
        return null;
    }

    _renderItem = ({ item, index }) => {
        return (
            <View style={styles.styleImg}>
                <Image
                    style={{ flex: 1, borderRadius: 5 }}
                    resizeMode="cover"
                    source={{ uri: item }}
                />
                <View style={{ position: 'absolute', top: 2, right: 2 }}>
                    <TouchableOpacity style={styles.delIMG} onPress={this.onPressDeleteImg}>
                        <Icon name="ios-close" size={20} color={R.colors.white100} style={styles.iconStyle} />
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
    onPressAddImg = () => {
        this.onAddImagePressed();
    }

    onPressDeleteImg = (index) => {
        let images = [...this.state.images];
        images.splice(index, 1);
        this.setState({ images })
    }
}
const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        marginTop: 5,
        flex: 1,
    },

    imgAdd: {
        flex: 1,
        height: 100,
        width: (width / 2) - 30,
        borderWidth: 0.5,
        borderStyle: 'dashed',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5,
        margin: 4
    },
    styleImg: {
        flex: 1,
        margin: 4,
        height: 100,
        width: (width / 2) - 30,
        borderWidth: 0.5,
        borderColor: R.colors.greyColor,
        borderRadius: 5,
        borderStyle: 'solid'
    },
    blankComponent: {
        flex: 1,
        margin: 4,
        height: 1,
    },
    img1: {
        width: 40,
        height: 40,
        margin: 3,
    },
    delIMG: {
        width: 20,
        height: 20,
        borderRadius: 20 / 2,
        backgroundColor: R.colors.orangeColor,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        top: 0,
        right: 0
    },
    iconStyle: {
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        alignContent: 'flex-end',
    },
})