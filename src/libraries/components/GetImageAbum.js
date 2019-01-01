import ImagePicker from 'react-native-image-picker';
import R from 'res/R';
export function getImg() {
    const options = {
        title: R.strings.camera.title,
        quality: 0.3,
        takePhotoButtonTitle: R.strings.camera.takePhotoButtonTitle,
        chooseFromLibraryButtonTitle: R.strings.camera.chooseFromLibraryButtonTitle,
        cancelButtonTitle: R.strings.camera.cancelButtonTitle
    };
return new Promise((resolve, reject)=>{
    ImagePicker.showImagePicker(options, (response) => {
        if (response.didCancel) {
            // console.log('User cancelled image picker');
        } else if (response.error) {
            // console.log('ImagePicker Error: ', response.error);
            return response.error;
        } else if (response.customButton) {
            // console.log('User tapped custom button: ', response.customButton);
            return response.customButton;
        } else {
            source = {uri: response.uri};
            resolve(response);
        }
    });
})
}

