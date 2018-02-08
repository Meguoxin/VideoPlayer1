/**
 * 设备平台
 */
import { Platform } from 'react-native';
export default {
    ANDROID: Platform.OS !== 'ios' ? true : false,
}
