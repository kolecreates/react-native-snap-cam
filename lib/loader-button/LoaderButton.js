import React, { Component } from 'react';
import {ActivityIndicator, View, TouchableOpacity,Animated, Easing} from 'react-native';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
const AnimatedIcon = Animated.createAnimatedComponent(Icon);
const CYCLE_DURATION = 600;
const TIMEOUT = 20000;

export default class LoaderButton extends Component {
  constructor(props){
    super(props);
    this.state = {
      loading: false,
      success: false,
    }

    this.loading = null;
  }

  onPress(){
    this.startLoadingAnimation();
    this.props.onPress().then(()=>{
      this.successAnimation();
    }).catch(()=>{
      this.failAnimation();
    });
  }

  startLoadingAnimation(){
    this.setState({loading: true});
  }

  stopLoadingAnimation(){

    this.setState({loading: false});
    if(this.loading){this.loading.stop();}
  }

  successAnimation(){
    this.setState({success: true});
    stopLoadingAnimation();
  }

  failAnimation(){
    stopLoadingAnimation();
  }

  render(){
    const icon = this.state.success ? "check" : this.props.icon;
    if(!this.state.loading){
      return (
        <TouchableOpacity disabled={this.state.loading || this.props.disabled} style={this.props.style} onPress={this.onPress.bind(this)}>
          <AnimatedIcon style={this.props.iconStyle}  color={this.props.color} name={icon} size={this.props.iconSize}/>
        </TouchableOpacity>
      );
    }else{
      return (
        <View style={this.props.style}>
          <ActivityIndicator size="large" color="#FFF" />
        </View>
      );
    }
  }
}
