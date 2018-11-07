import React, { Component } from 'react';
import {Keyboard, BackHandler, View, TextInput, StyleSheet, TouchableOpacity, Platform} from 'react-native';
import AndroidKeyboardAdjust from 'react-native-android-keyboard-adjust';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {COLORS, FADEDBLACK, FADEDWHITE} from './Caption';


const styles = StyleSheet.create({
  container: { flexDirection: 'column',
  justifyContent: 'flex-start',
alignItems: 'center',},
  textInputView: {
                height: '60%',
                width: '100%',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                alignItems: 'center',
  },
  textInput: {height: 'auto',
              width: '100%',
              paddingLeft: '5%',
              paddingRight: '5%',
              justifyContent: 'center',
              alignItems: 'center',
              color: '#FFF',
              fontSize: 25,},
  iconButton: {width: 50, height: 50},
  colorBar: {
             width: '100%',
             height: 60,
             paddingLeft: 10,
             paddingRight: 10,
             flexDirection: 'row',
             justifyContent: 'space-between',
             alignItems: 'center',},
  colorButton: {
    width: 50,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  colorButtonView: {
    width: 40,
    height: 40,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: '#FFF',
  }
});

export default class CaptionEditor extends Component {
    constructor(props) {
      super(props);
      this.state = {
        text: "",
        color: COLORS[0],
        backgroundColor: "transparent",
      }

      this.input = null;
      this.onColorSelected = this.onColorSelected.bind(this);
      this.onChangeText = this.onChangeText.bind(this);
      this._handleBackPress = this._handleBackPress.bind(this);
      this._keyboardDidShow = this._keyboardDidShow.bind(this);
      this._keyboardDidHide = this._keyboardDidHide.bind(this);
    }

    // componentDidMount(){
    // }
    //
    // componentWillUnMount(){
    // }


    componentDidMount() {
      if(Platform.OS == "android"){AndroidKeyboardAdjust.setAdjustNothing();}


      this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
      this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
      BackHandler.addEventListener('hardwareBackPress', this._handleBackPress);
    }

    componentWillUnmount() {
      if(Platform.OS == "android"){AndroidKeyboardAdjust.setAdjustResize();}
      this.keyboardDidShowListener.remove();
      this.keyboardDidHideListener.remove();
      BackHandler.removeEventListener('hardwareBackPress', this._handleBackPress);
    }

    _handleBackPress(){
      this._keyboardDidHide();
      return true;
    }
    _keyboardDidShow () {

    }

    _keyboardDidHide () {
        if(this.state.text.length == 0){
          this.props.onCancel();
        }
        this.props.onFinish(this.state.text, this.state.color);
    }

    onChangeText(text){
      var cLen = this.state.text.length;
      var len = text.length;
      if(len == 0){
        this.setState({text: text, backgroundColor: 'transparent'});
      }else if(len > 0 && cLen == 0){
        this.setState({text: text, backgroundColor: this.state.color == "#000000" ?  FADEDWHITE : FADEDBLACK});
      }else {
        this.setState({text: text});
      }
    }

    onColorSelected(color){
      var bg;
      bg = color == "#000000" ?  FADEDWHITE : FADEDBLACK;
      this.setState({color: color, backgroundColor: bg});
    }



    //tried using a loop with this but run into the javascript issue of loops + callbacks
    renderColorBar(){
      return (<View style={styles.colorBar}>
        <TouchableOpacity onPressOut={()=>{this.onColorSelected(COLORS[0])}} style={[styles.colorButton]}><View style={[styles.colorButtonView, {backgroundColor: COLORS[0]}]}></View></TouchableOpacity>
        <TouchableOpacity onPressOut={()=>{this.onColorSelected(COLORS[1])}} style={[styles.colorButton]}><View style={[styles.colorButtonView, {backgroundColor: COLORS[1]}]}></View></TouchableOpacity>
        <TouchableOpacity onPressOut={()=>{this.onColorSelected(COLORS[2])}} style={[styles.colorButton]}><View style={[styles.colorButtonView, {backgroundColor: COLORS[2]}]}></View></TouchableOpacity>
        <TouchableOpacity onPressOut={()=>{this.onColorSelected(COLORS[3])}} style={[styles.colorButton]}><View style={[styles.colorButtonView, {backgroundColor: COLORS[3]}]}></View></TouchableOpacity>
        <TouchableOpacity onPressOut={()=>{this.onColorSelected(COLORS[4])}} style={[styles.colorButton]}><View style={[styles.colorButtonView, {backgroundColor: COLORS[4]}]}></View></TouchableOpacity>
        <TouchableOpacity onPressOut={()=>{this.onColorSelected(COLORS[5])}} style={[styles.colorButton]}><View style={[styles.colorButtonView, {backgroundColor: COLORS[5]}]}></View></TouchableOpacity>
        <TouchableOpacity onPressOut={()=>{this.onColorSelected(COLORS[6])}} style={[styles.colorButton]}><View style={[styles.colorButtonView, {backgroundColor: COLORS[6]}]}></View></TouchableOpacity>
        </View>);
    }

    render(){
      let len = this.state.text.length;
      if(this.props.enabled){
        return (
              <View style={[ this.props.style, styles.container, {backgroundColor: this.state.backgroundColor}]}>
                  <View style={styles.textInputView}>
                  {len > 0 ? this.renderColorBar() : null}
                  <TextInput
                    ref={(ref)=> {this.input = ref}}
                    autoFocus={true}
                    style={[styles.textInput, {color: this.state.color}]}
                    multiline={true}
                    autoGrow = {true}
                    maxLength={140}
                    caretHidden={false}
                    underlineColorAndroid='transparent'
                    onChangeText={(text) => this.onChangeText(text)}
                    value={this.state.text}
                    editable={true}
                  />
                </View>
              </View>
        );
      }else{
        return null;
      }
    }
}


CaptionEditor.propTypes = {
  onCancel: PropTypes.func,
  onFinish: PropTypes.func,
  enabled: PropTypes.bool,
};

CaptionEditor.defaultProps = {
  onCancel: () => {},
  onFinish: () => {},
  enabled: false,
};
