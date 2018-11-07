import React, { Component } from 'react';
import {View, TouchableWithoutFeedback,Animated, Easing} from 'react-native';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
const AnimatedIcon = Animated.createAnimatedComponent(Icon);

export default class ToggleButton extends Component {

  constructor(props){
    super(props);
    this.state = {
      toggled: false,
      scale: new Animated.Value(1),
      opacity: new Animated.Value(1),
      name: this.props.forceDefault ? this.props.toggledIcon : this.props.icon
    }
  }

  animation(toSize, toOpacity, callback = () => {}){
    Animated.parallel([
      Animated.spring(this.state.scale, {
        toValue: toSize,
        useNativeDriver: true,
        duration: 200,
      }),
      Animated.timing(this.state.opacity, {
        toValue: toOpacity,
        useNativeDriver: true,
        duration: 100
      }),
    ]).start(callback);
  }

  startAnimation(){
    this.animation(0, 0, this.onAnimationFinish.bind(this));
  }

  onAnimationFinish(){
    this.setState({toggled: !this.state.toggled, name: this.state.name == this.props.icon ? this.props.toggledIcon : this.props.icon});
    this.animation(1, 1);
  }

  toggle(){
    this.startAnimation();
    this.props.onPress();
  }


  render(){

    let s = {transform: [{scale: this.state.scale}]};
    const p = this.props.disabled ? {opacity: 0} : {opacity: this.state.opacity};
    const i = this.state.name;
    return (
      <TouchableWithoutFeedback disabled={(this.state.toggled && this.props.singleToggle) || this.props.disabled} style={this.props.style} onPress={this.toggle.bind(this)}>
        <AnimatedIcon style={[p, s]}  color={this.props.color} name={i} size={this.props.iconSize}/>
      </TouchableWithoutFeedback>
    );
  }
}
