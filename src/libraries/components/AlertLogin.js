import { Alert } from 'react-native';
import NavigationService from 'routers/NavigationService';

export function alertSign() {
    Alert.alert(
        'Thông báo',
        'Mời bạn đăng nhập để tiếp tục sử dụng',
        [
            { text: 'Trở lại', style: 'destructive' },
            { text: 'Đăng nhập', onPress: () => NavigationService.navigate("LoginScreen") },
        ],
        { cancelable: false }
    )
}

