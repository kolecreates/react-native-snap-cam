import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ToggleButton from '../toggle-button/ToggleButton';
import CaptionEditor from '../caption-editor/CaptionEditor';
import {Caption} from '../caption-editor/Caption';

class PictureView extends Component {
  constructor(props){
    super(props);
    this.state = {
      cEditorEnabled: false,
      text: "",
      color: "",
    };
    this.caption = null;
    this.finishEditingCaption = this.finishEditingCaption.bind(this);
  }

  onCancel(){
    this.setState({text: "", color: ""});
    this.closeCaptionEditor();
    this.props.onCancel();
  }

  openCaptionEditor(){
    this.setState({cEditorEnabled: true});
  }

  closeCaptionEditor(){
    this.setState({cEditorEnabled: false});
  }

  finishEditingCaption(text,color){
    this.closeCaptionEditor();
    this.setState({text: text, color: color});
  }

  onSave(){
    this.props.onSave().then(()=>{}).catch((error)=>{});
  }

  onSubmit(){
    var caption = {text: this.state.text, color: this.state.color, offset: this.caption ? this.caption.getRelativeOffset() : .5};
    this.props.onSubmit(caption);
  }

  render(){
    if(this.props.path){
      return (
        <View style={this.props.style}>
          <TouchableOpacity style={[styles.iconButton, styles.floatingTopLeftButton]} onPress={this.onCancel.bind(this)}>
            <Icon name={"close"} size={34} color="#FFF"/>
          </TouchableOpacity>
          {this.state.cEditorEnabled ? null : <TouchableOpacity style={[styles.iconButton, styles.floatingBottomRightButton]} onPress={this.onSubmit.bind(this)}>
            <Icon name={"send"} size={34} color="#FFF"/>
          </TouchableOpacity>}
          <View style={styles.toolBar}>
            <TouchableOpacity style={styles.iconButton} onPress={this.openCaptionEditor.bind(this)}>
              <Icon name={"format-text"} size={34} color="#FFF"/>
            </TouchableOpacity>
            <ToggleButton style={styles.iconButton}
                        iconSize={34}
                        color="#FFF"
                        icon={"download"}
                        toggledIcon={"checkbox-marked-circle-outline"}
                        singleToggle={true}
                        onPress={this.onSave.bind(this)}/>
          </View>
          <CaptionEditor onCancel={this.closeCaptionEditor.bind(this)} onFinish={this.finishEditingCaption} enabled={this.state.cEditorEnabled} style={styles.captionEditor}/>
          <Caption ref={(ref)=>{this.caption = ref}} style={{zIndex: 1}} onPress={this.openCaptionEditor.bind(this)} lock={false} visible={!this.state.cEditorEnabled}  color={this.state.color} text={this.state.text}/>
          <Image source={this.props.path} style={styles.image}/>
        </View>
      )
    }else{
      return null;
    }
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    flex: 1,
  },
  toolBar: {
    position: 'absolute',
    top: 0,
    right: 0,
    paddingTop: 15,
    width: 60,
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 1,
  },
  iconButton:{
    height: 50,
    width:50,
  },
  floatingTopLeftButton:{
    position: 'absolute',
    top: 0,
    left: 0,
    paddingLeft: 15,
    paddingTop: 15,
    zIndex: 1
  },
  floatingBottomRightButton:{
    position: 'absolute',
    bottom: 0,
    right: 0,
    paddingRight: 15,
    paddingBottom: 15,
    zIndex: 1
  },
  captionEditor: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    zIndex: 1
  }
});

PictureView.propTypes = {
  style: PropTypes.obj,
  path: PropTypes.string,
  onCancel: PropTypes.func,
  onSave: PropTypes.func,
  onSubmit: PropTypes.func,

}

PictureView.defaultProps = {
  style: styles.container,
  path: null,
  onCancel: () => {},
  onSave: () => {},
  onSubmit: ()=>{},
};

export default PictureView;
