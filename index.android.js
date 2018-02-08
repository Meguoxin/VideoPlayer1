
import React, { Component } from 'react';
import {
  Text,
  View,
  Image,
  ScrollView,
  BackHandler,
  StyleSheet,
  AppRegistry,
  TouchableOpacity
} from 'react-native';

import pxToDp from './src/util/pxToDp';
import screen  from './src/util/screen';
import device from './src/util/Device';
import VpCompoent from './src/VideoPlayer';
import Orientation from 'react-native-orientation';

export default class VideoPlayer extends Component {

  componentWillMount() {
    if(device.ANDROID) {  
      BackHandler.addEventListener('hardwareBackPress', this.back);  
    }  
  }

  componentDidMount() {
    // 强制竖屏显示
    Orientation.lockToPortrait();
  }
  
  componentWillUnmount() {
    if(Device.ANDROID) {  
      BackHandler.removeEventListener('hardwareBackPress', this.back);  
    }  
  }

  render() {
    return (
      <View style={ styles.container }>
        <ScrollView ref='scrollview'>
          <VpCompoent
            ref='videoPlayer'
            videoUri={{ uri: 'http://oleeed73x.bkt.clouddn.com/me.mp4' }}
            screenChange={ (type)=> this.screenChange(type) } 
            />
          <TouchableOpacity 
            activeOpacity={ 0.8 } 
            style={ styles.backBtn } 
            onPress={ this.back.bind(this) }>
            <Image source={ require('./src/imgs/btn_back.png') }  /> 
          </TouchableOpacity>
        </ScrollView>
      </View>
      
    );
  }

  /**
   * 退出当前界面
   */
  back = ()=> {
    Orientation.getOrientation((err,orientation)=>{
      if(orientation !== 'PORTRAIT') {
        // 旋转屏幕,改变状态
        PubSub.publish('video_screenChange');
      } else {
        // this.props.navigation.goBack();
      } 
    });
    return true;
  }

  /**
   * 当切换屏幕时
   * @param {*} type 
   */
  screenChange(type) {
    this.setState({ fullScreen: type });
    if(type) {
      // 全屏
      this.refs.scrollview.scrollTo({ x: 0, y: 0, animated: false });
      this.refs.scrollview.setNativeProps({
        scrollEnabled: false,
      });
    } else {
      // 竖屏
      this.refs.scrollview.setNativeProps({
        scrollEnabled: true,
      });
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },

  backBtn: {
    position: 'absolute',
    top: screen.statusBarHeight,
    left: pxToDp(30),
    paddingTop: pxToDp(screen.statusBarHeight),
  },
});

AppRegistry.registerComponent('VideoPlayer', () => VideoPlayer);
