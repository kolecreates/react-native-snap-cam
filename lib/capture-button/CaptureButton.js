import React, { Component } from 'react';
import {Text, View,StyleSheet, TouchableWithoutFeedback,Animated, Easing} from 'react-native';
import PropTypes from 'prop-types';

const BUTTON_RADIUS_DEFAULT = 1;
const BUTTON_RADIUS_LARGE = 1.3;
const TIMER_TRANSFORM = -95;

export default class CaptureButton extends Component {

  constructor(props){
    super(props);
    this.state = {
      timer: props.maxTimerDuration / 1000,
      timerY: new Animated.Value(0),
      radius: new Animated.Value(BUTTON_RADIUS_DEFAULT),
      opacity: new Animated.Value(0),
      longPressIn: false,
    }

    this.interval = null;
  }


  resetTimer(add = null){
    var t = add == null ? this.props.maxTimerDuration / 1000 : Math.min(10,this.state.timer + Math.ceil(add/1000));
    this.setState({timer: t});
  }


  beginTimer(){
    var that = this;
    this.interval = setInterval(function(){
      var t = that.state.timer;
      if(t > 0){
        that.setState({timer: that.state.timer - 1});
      }else{
        that.onTimerEnd();
        clearInterval(that.interval);
      }
    }, 1000);
  }

  stopTimer(){
    clearInterval(this.interval);
  }

  onTimerEnd(){
    this.props.onTimerEnd();
    this.moveTimerDown();
    this.shrinkButton();
  }

  moveTimer(toValue){
    Animated.spring(this.state.timerY, {
      toValue: toValue,
      useNativeDriver: true,
    }).start();
  }

  fadeTimer(toValue){
    Animated.timing(this.state.opacity, {
      toValue: toValue,
      duration: 100,
      useNativeDriver: true,
    }).start();
  }

  moveTimerUp(){
    this.moveTimer(TIMER_TRANSFORM);
    this.fadeTimer(1);
  }

  moveTimerDown(){
    this.moveTimer(0);
    this.fadeTimer(0);
  }

  growButton(){
    Animated.spring(this.state.radius,{
      toValue: BUTTON_RADIUS_LARGE,
      useNativeDriver: true,
      duration: 150,
    }).start();
  }

  shrinkButton(){
    Animated.timing(this.state.radius,{
      toValue: BUTTON_RADIUS_DEFAULT,
      easing: Easing.ease,
      useNativeDriver: true
    }).start();
  }

  onPressOut(){
    if(this.state.timer > 0){this.shrinkButton()}
    if(this.state.longPressIn){
      this.stopTimer();
      this.moveTimerDown();
      this.props.onLongPressOut();
      this.setState({longPressIn: false});
    }else{
      this.props.onPressOut();
    }
  }

  onLongPress(){
    this.beginTimer();
    this.moveTimerUp();
    this.props.onLongPressIn();
    this.setState({longPressIn: true});
  }

  onPressIn(){
    this.growButton();
    this.props.onPressIn();
  }

  render(){
    const y = this.state.timerY;
    const r = this.state.radius;
    const p = this.state.opacity;
    let [translateX, translateY] = [0, y];
    let timerTransform = {transform: [{translateX}, {translateY}]};
    let buttonTransform = {transform: [{scale: r}]};
    let timerOpacity = {opacity: p};
    return (
      <View style={[styles.captureButtonView, this.props.style]}>
        <Animated.View style={[styles.timer, timerTransform, timerOpacity]}>
          <Text style={styles.timerText}>{this.state.timer}</Text>
        </Animated.View>
        <TouchableWithoutFeedback
          disabled={this.props.disabled}
          delayLongPress={this.props.longPressDelay}
          onPressIn={this.onPressIn.bind(this)}
          onPressOut={this.onPressOut.bind(this)}
          onLongPress={this.onLongPress.bind(this)}>
          <Animated.View style={[styles.captureButton, buttonTransform]}>
            <Animated.View style={[styles.captureButtonInner, buttonTransform, timerOpacity]}></Animated.View>
          </Animated.View>
        </TouchableWithoutFeedback>
      </View>
    );
  }

}


const styles = StyleSheet.create({
  timer: {
    width: '100%',
    height: '50%',
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 0,
    opacity: 0,
  },
  timerText: {
    fontSize: 30,
    color: '#FFF',
  },
  captureButtonView:{
    width: '50%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 15,
  },
  captureButton:{
    width: 70,
    height: 70,
    borderWidth: 5,
    borderColor: '#FFF',
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  captureButtonInner:{
    width: 40,
    height: 40,
    borderRadius: 50,
    backgroundColor: 'red',
    opacity: 0,
  }
});


CaptureButton.propTypes = {
  onPressIn: PropTypes.func,
  onPressOut: PropTypes.func,
  onLongPressIn: PropTypes.func,
  onLongPressOut: PropTypes.func,
  onTimerEnd: PropTypes.func,
  maxTimerDuration: PropTypes.number,
  longPressDelay: PropTypes.number,
  disabled: PropTypes.bool,
}

CaptureButton.defaultProps = {
  onPressIn: ()=> {},
  onPressOut: ()=> {},
  onLongPressIn: ()=> {},
  onLongPressOut: ()=> {},
  onTimerEnd: ()=> {},
  maxTimerDuration: 10000,
  longPressDelay: 300,
  disabled: false,
};
