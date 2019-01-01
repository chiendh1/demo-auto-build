import ImagePicker from 'react-native-image-picker';
export function getImg() {
    const options = {
        title: 'Select Image',
        quality: 0.3
    };
return new Promise((resolve, reject)=>{
    ImagePicker.showImagePicker(options, (response) => {
        if (response.didCancel) {
            console.log('User cancelled image picker');
        } else if (response.error) {
            console.log('ImagePicker Error: ', response.error);
        } else if (response.customButton) {
            console.log('User tapped custom button: ', response.customButton);
        } else {
            source = {uri: response.uri};
            resolve(response);
        }
    });
})
}

