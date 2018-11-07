import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
} from 'react-native';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/MaterialIcons';


export default class MultiClipManager extends Component {
  constructor(props){
    super(props);
    this.state = {
      clips: [],
      lastIndex: -1,

    };
    this.fullscreen = this.fullscreen.bind(this);
    this.popClip = this.popClip.bind(this);
    this.clearClips = this.clearClips.bind(this);
    this.renderClip = this.renderClip.bind(this);
    this.renderFooter = this.renderFooter.bind(this);
  }


  fullscreen(clip){
    this.props.onFullScreen(clip);
  }

  popClip(){
    var clips = this.state.clips;
    var clip = clips.pop();
    this.setState({clips: clips, lastIndex: this.state.lastIndex - 1});
    this.props.onPopClip(clip, clips.length == 0);
  }

  pushClip(clip){
    var clips = this.state.clips;
    clips.push(clip);
    this.setState({clips: clips,lastIndex: this.state.lastIndex + 1});
  }

  clearClips(){
    this.setState({clips: [], lastIndex: 0});
    this.props.onClearClips();
  }

  renderClip(data){
    var item = data.item;
    var index = data.index;
    return (
      <View style={styles.clip}>
        <TouchableOpacity style={styles.fullscreenButton} onPress={()=> {this.fullscreen(item)}}>
          <Image resizeMode="cover" style={styles.clipPreview} source={{uri:item.preview}}/>
        </TouchableOpacity>
      </View>
    );
  }

  renderFooter(){
    return (
      <TouchableOpacity style={styles.iconButton} onPress={this.popClip} longPressDelay={300} onLongPress={this.clearClips}>
        <Icon name={"delete"} size={25} color="#FFF"/>
      </TouchableOpacity>
    )
  }

  render(){
    if(this.state.clips.length) {return (
      <View styles={this.props.style}>
        <FlatList
         style={styles.list}
         data={this.state.clips}
         extraData={this.state}
         keyExtractor={(item, index)=> index}
         renderItem={this.renderClip}
         horizontal={true}
         showHorizontalScrollIndicator={false}
         ListFooterComponent={this.renderFooter}
       />
     </View>
   );}else{return null;}
  }
}


const styles = StyleSheet.create({

  list: {
    width: '100%',
  },
  clip: {
    width: 60,
    marginLeft: 7,
    height: '100%',
    alignItems: 'center',
  },
  fullscreenButton: {
    width: '100%',
    height: '100%',
  },
  clipPreview:{
    width: '100%',
    height: '100%',
    borderWidth: 1,
    borderColor: '#FFFF',
    borderRadius: 10,
  },
  iconButton: {
    width: 60,
    height: '100%',
    marginLeft: 10,
    borderRadius: 10,
    backgroundColor: 'rgba(0,0,0,.21)',
    justifyContent: 'center',
    alignItems: 'center',
  }
});
