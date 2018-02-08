/**
 * 设备屏幕宽高,像素密度
 */
import { Dimensions, PixelRatio, Platform } from 'react-native';

export default {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    onePixel: 1 / PixelRatio.get(),
    appBarHeight: Platform.OS === 'ios'? 44 : 56,
    statusBarHeight: 24,
}
