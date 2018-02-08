import { Dimensions } from 'react-native';

const deviceWidthDp = Dimensions.get('window').width;
const uiWidthPx = 750;

function pxToDp(uiElementPx) {
    return uiElementPx *  deviceWidthDp / uiWidthPx;
}

export default pxToDp;