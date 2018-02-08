/**
 * 视频播放器
 */
import React, { Component } from 'react';
import {
  Text,
  View,
  Image,
  StatusBar,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet
} from 'react-native';

import Slider from './Slider';
import PubSub from 'pubsub-js';
import pxToDp from './util/pxToDp';
import screen from './util/screen';
import Video from 'react-native-video';
import TimeUtil from './util/TimeUtil';
import Orientation from 'react-native-orientation';

export default class VideoPlayer extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      paused: true,
      isLoading: true,
      fullScreen: false,
      durationTime: 0.0,
      currentTime: 0.0,
      hiddenControl: true,
      videoLoadOver: false,
      playIcon: require('./imgs/lysp_btn_play.png'),
      fullscreenIcon: require('./imgs/ZFPlayer_fullscreen.png'),
    }
  }

  componentDidMount() {
    this.pubsub_token = PubSub.subscribe('video_screenChange', this._toggleScreen.bind(this, false));
  }

  componentWillUnmount() {
    PubSub.unsubscribe(this.pubsub_token);
  }

  /**
   * 获取视频状态
   */
  getVideoPlayerStatus() {
      return this.state.paused;
  }
  
  /**
   * 播放、暂停
   */
  _togglePlay() {
    this.setState({ 
      paused: !this.state.paused,
      playIcon: this.state.paused ? 
      require('./imgs/lysp_btn_pause.png') 
      : 
      require('./imgs/lysp_btn_play.png')
    });
  }

  /**
   * 全屏播放
   */
  _toggleScreen(type) {
    StatusBar.setHidden(type);
    this.setState({ fullScreen: type });
    this.props.screenChange && this.props.screenChange(type);
    if(type) {
      Orientation.lockToLandscape();
      this.setState({ fullscreenIcon: require('./imgs/ZFPlayer_shrinkscreen.png') });
    } else {
      Orientation.lockToPortrait();
      this.setState({ fullscreenIcon: require('./imgs/ZFPlayer_fullscreen.png') });
    }
  }
  
  /**
   * 视频开始加载
   */
  _onLoadStart() {
    this.setState({ isLoading: true });
  }

  /**
   * 视频加载完毕
   */
  _onLoad(data) {
    this.setState({ 
      isLoading: false,
      videoLoadOver: true,
      durationTime: data.duration 
    }); 
  };

  /**
   * 视频播放进度
   */
  _onProgress(data) {
    this.setState({ currentTime: data.currentTime });
  };

  /**
   * 视频播放结束
   */
  _onEnd() {
    this.setState({
      paused: false, 
      currentTime: 0.0,
      playIcon: require('./imgs/lysp_btn_play.png'),
    });
    this.refs.player.seek(0);
  };

  /**
   * 视频加载失败
   */
  _onError() {
    console.log('视频加载失败');
  }

  /**
   * 快进
   * @param {*} currentTime 
   */
  _seekTo(currentTime) {
    this.setState({
      currentTime: currentTime
    });
    this.refs.player.seek(currentTime);
  }

  render() {
      return(
        <TouchableOpacity 
          activeOpacity={1} 
          onPress={ ()=> this.changeVideoControlHidden(!this.state.hiddenControl)} >
          { this.renderVideo() }
          { this.renderActivityIndicator() }
        </TouchableOpacity>
      )
  }

  /**
   * 视频播放器
   */
  renderVideo= () => {
      return  this.props.videoUri ?              
      <View style={[ styles.video, this.state.fullScreen && { width: screen.height, height: screen.width }]}>
        <Video source={ this.props.videoUri }   
          ref='player'
          style={ styles.videoView }    
          rate={ 1.0 }                           
          volume={ 1.0 }          
          muted={ false }                           
          repeat={ false } 
          resizeMode={ 'cover' }
          paused={ this.state.paused }        
          onLoadStart={ this._onLoadStart.bind(this) }
          onLoad={ this._onLoad.bind(this) }
          onProgress={ this._onProgress.bind(this) }
          onEnd={ this._onEnd.bind(this) }                      
          playInBackground={ false }               
          playWhenInactive={ false }            
          ignoreSilentSwitch={ 'ignore' } 
          onError={ this._onError.bind(this) }               
          onBuffer={ this.onBuffer }
        />
        { this.renderVideoControl() }
      </View> : <View style={ styles.video } />;
  }

  renderPlayBtn() {
    return (
      <TouchableOpacity 
        activeOpacity={ 0.8 } 
        style={ styles.playBtn }
        onPress={ this._togglePlay.bind(this) }>
        <Image source={ this.state.playIcon } />
      </TouchableOpacity>
    )
  }

  _rendePlayControl() {
      return (
        <View style={ styles.playControl }>
          <Text style={ styles.currentTime }>
            { TimeUtil.getFormatTime(this.state.currentTime) }
          </Text>
          <Slider
            minimumValue={ 0 }
            style={ styles.progress }
            // thumbStyle={ styles.thumb }
            // thumbImage={require('./imgs/progress.png')}
            value={ parseInt(this.state.currentTime) }
            minimumTrackTintColor='#EE8A32'
            maximumTrackTintColor='#fff'
            thumbTintColor='#EE8A32'
            maximumValue={ parseInt(this.state.durationTime) }
            onSlidingComplete={ (value) => this._seekTo(value) } 
          />
          <Text style={ styles.durationTime }>
            { TimeUtil.getFormatTime(this.state.durationTime) }
          </Text>
          <TouchableOpacity
            activeOpacity={ 0.8 } 
            style={ styles.fullScreen }
            onPress={ this._toggleScreen.bind(this, !this.state.fullScreen) }>
            <Image source={ this.state.fullscreenIcon } />
        </TouchableOpacity>   
      </View>
    )
  }

  /**
   * 视频播放控制
   */
  renderVideoControl= ()=> {
      if(this.state.hiddenControl) {
        return null;
      }
      return this.state.videoLoadOver ? 
      <View style={ [styles.videoControl, this.state.fullScreen && { width: screen.height } ]}>
        <View style={ styles.playControl }>
          { this._rendePlayControl() }
        </View>
        { this.renderPlayBtn() }
      </View> : null;
  }

  /**
   * 加载控件
   */
  renderActivityIndicator() {
    return this.state.isLoading ?  
    <ActivityIndicator 
      color='#b1b1b1'
      style={ styles.spinner } />
    : null;
  }

  /**
   * 控制播放控制显示和隐藏
   */
  changeVideoControlHidden(isHidden) {
    this.timeOutId && clearTimeout(this.timeOutId);
    this.setState({ hiddenControl: isHidden }, ()=>{
      if(!isHidden) {
        this.timeOutId = setTimeout(()=>{
          this.setState({ hiddenControl: true });
        },5000);
      }
    });
  }   
}

const styles = StyleSheet.create({

  video: {
    width: screen.width,
    height: pxToDp(640),
    alignItems: 'center',
    justifyContent: 'center'
  },

  videoControl: {
    width: screen.width,
    height: pxToDp(640),
    flexDirection: 'row',
    position: 'absolute',
    left: 0,
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingHorizontal: pxToDp(10),
  },

  playControl: { 
    flex: 1,
    flexDirection: 'row',
    alignItems:'center'
  },

  playBtn: {
    alignSelf: 'center',
    position: 'absolute',
  },

  progress: {
    flex: 1,
    marginLeft: pxToDp(6),
  },

  currentTime: {
    fontSize: pxToDp(20),
    fontFamily: 'ArialMT',
    color: '#fff',
    marginLeft: pxToDp(20),
    backgroundColor: 'transparent'
  },

  durationTime: {
    fontSize: pxToDp(20),
    fontFamily: 'ArialMT',
    color: '#fff',
    marginLeft: pxToDp(6),
    backgroundColor: 'transparent'
  },

  fullScreen: {
    marginLeft: pxToDp(30)
  },

  thumb: {
    width: 40,
    height: 40,
    backgroundColor: 'transparent'
    // shadowColor: 'black',
    // shadowOffset: {width: 0, height: 1},
    // shadowOpacity: 0.5,
    // shadowRadius: 1,
  },

  videoView: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },

  spinner: {
    position: 'absolute', 
    top: 0, 
    bottom: 0, 
    left: 0, 
    right: 0
  }
})
