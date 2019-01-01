import { Status } from 'libraries/networking/status';
import React, { PureComponent } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import R from 'res/R';
import { getImg } from 'screens/main/upgradeaccount/GetImageAbum';
import { postUploadImage, putUpdateUser } from 'libraries/networking/apis';
import database from 'libraries/utils/database';
import FastImage from 'react-native-fast-image';
import { connect } from 'react-redux'
import { onUpdateUser } from '../../../redux/actions';
import { validateImage } from 'libraries/utils/utils';
import ModalProgressUpload from 'libraries/components/ModalProgressUpload';

class ImagePerson extends PureComponent {
    constructor(props) {
        super(props);
    }



    render() {
        const { user } = this.props;

        let source = R.images.ic_image
        if (user.avatar) {
            source = {
                uri: validateImage(user.avatar)
            }
        }

        return (
            <View style={styles.constainer}>
                <View style={styles.cycleImage}>

                    <FastImage
                        style={styles.imageStyle}
                        source={source}
                        resizeMode={FastImage.resizeMode.cover}
                    />
                </View>
                <TouchableOpacity
                    style={styles.camera}
                    onPress={this.onClickImage}
                >
                    <Icon
                        name='ios-camera'
                        size={15}
                        color='#fff'
                    />
                </TouchableOpacity>
                {this._render_modal_progress()}
            </View>
        );
    }

    onClickImage = async () => {
        const source = await getImg();
        try {
            postUploadImage(database.tokenCache, source, this.uploadProgress).then(response => {
                if (response.code === Status.SUSSESS) {
                    this.UpdateAvatar(response.data.images[0])
                }
            })
        } catch (error) {
             return error;
        }
    }

    UpdateAvatar = (url) => {

        try {
            putUpdateUser(database.tokenCache, {
                id_users: database.user.id_users,
                avatar: url
            }).then(response => {
                if (response.code === Status.SUSSESS) {
                    const user = response.user.user;
                    database.user = user;
                    this.props.onUpdateUser(user)
                }
                this.uploadProgress(0)
            })
        } catch (error) {
            this.uploadProgress(0)
             return error;
        }
    }

    uploadProgress = (progress) => {
        this.progressUploadComponent.setProgress(progress);
    }
    _render_modal_progress() {
        return (
            <ModalProgressUpload
                ref={ref => this.progressUploadComponent = ref}
                titleUpload={R.strings.upgradeacc.hint_progress_upload}
            />
        )
    }
}

const styles = StyleSheet.create({
    constainer: {
        flex: 1
    },
    cycleImage: {
        width: 90,
        height: 90,
        borderRadius: 45,
        borderWidth: 1.2,
        borderColor: '#fff',
        marginVertical: 10,
        marginTop: 70,
        marginLeft: 15,
        justifyContent: 'center',
        alignItems: 'center'
    },
    imageStyle: {
        width: 87,
        height: 87,
        borderRadius: 90 / 2
    },
    camera: {
        width: 25,
        height: 25,
        borderRadius: 13,
        borderWidth: 1,
        borderColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        top: 125,
        left: 85,
        backgroundColor: R.colors.blue900
    },
})

const mapStateToProps = state => {
    return {
        user: state.userReducer.user
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onUpdateUser: (user) => dispatch(onUpdateUser(user)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ImagePerson);