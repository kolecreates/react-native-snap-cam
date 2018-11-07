import React, { Component } from 'react';
import {Dimensions,View, Text, StyleSheet, TouchableWithoutFeedback,PanResponder, Animated} from 'react-native';
import PropTypes from 'prop-types';

const HEIGHT = Dimensions.get('window').height;
export const COLORS = ["#FFFFFF", "#000000", "#FFEE58", "#4DB6AC", "#42A5F5", "#AB47BC", "#F44336"];
export const FADEDBLACK = 'rgba(0,0,0,.51)';
export const FADEDWHITE = 'rgba(255,255,255,.51)';


export class Caption extends Component {
  constructor(props){
    super(props);
    this.state = {
      pan: new Animated.ValueXY({x: 0, y: this.props.offset}),
      lastPanY: 0,
    }
  }

  componentWillMount() {
    //for dragging text input up and down
    this._panResponder = PanResponder.create({
      onMoveShouldSetResponderCapture: () => true,
      onMoveShouldSetPanResponderCapture: () => true,

      // Initially, set the value of x and y to 0 (the center of the screen)
      onPanResponderGrant: (e, gestureState) => {
        // Set the initial value to the current state
         this.state.pan.setOffset({x: 0, y: this.state.pan.y._value});
         this.state.pan.setValue({x: 0, y: 0});
         Animated.diffClamp(this.state.pan, HEIGHT*.2, HEIGHT*.8);
      },

      // When we drag/pan the object, set the delate to the states pan position
      onPanResponderMove: Animated.event([
        null, {dx: this.state.pan.x, dy: this.state.pan.y},
      ]),

      onPanResponderRelease: (e, {vx, vy}) => {
        this.state.pan.flattenOffset();
      }
    });
  }


  getRelativeOffset(){
    return this.state.pan.y._value/HEIGHT;
  }


  render(){

    let y = this.state.pan.y;
    let [translateX, translateY] = [0, y];
    let panStyle = {transform: [{translateX}, {translateY}]};
    var bg = this.props.color == "#000000" ?  FADEDWHITE : FADEDBLACK;
    if(this.props.text.length > 0 && this.props.visible){
      return (
        <Animated.View style={[this.props.style, styles.container, panStyle]}
          {...this.props.lock ? null : this._panResponder.panHandlers}>
          <TouchableWithoutFeedback onPress={this.props.onPress} style={styles.button}>
            <Text onPress={this.props.onPress} style={[styles.text, {backgroundColor: bg, color: this.props.color}]}>{this.props.text}</Text>
          </TouchableWithoutFeedback>
        </Animated.View>
      );
    }else{
      return null;
    }
  }

}

Caption.propTypes = {
  onPress:PropTypes.func,
  color: PropTypes.string,
  text: PropTypes.string,
  lock: PropTypes.bool,
  offset: PropTypes.number,
  visible: PropTypes.bool,
};

Caption.defaultProps = {
  color: COLORS[0],
  text: "",
  lock: true,
  offset: HEIGHT/2,
  visible: true,
  onPress: () => {},
};


const styles = StyleSheet.create({
  container: {
                height: 'auto',
                width: '100%',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
  },
  button: {
  },
  text: {height: 'auto',
              width: '100%',
              paddingLeft: '5%',
              paddingRight: '5%',
              paddingTop: 5,
              paddingBottom: 5,
              justifyContent: 'center',
              alignItems: 'center',
              color: '#FFF',
              fontSize: 25,}
})
