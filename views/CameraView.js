import React, { Component } from 'react';
import {
  View,
  Platform,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import Camera from '../lib/react-native-camera';
import CaptureButton from '../lib/capture-button/CaptureButton';
import PictureView from '../lib/picture-view/PictureView';
import VideoView from '../lib/video-view/VideoView';
import ToggleButton from '../lib/toggle-button/ToggleButton';
import MultiClipManager from '../lib/multiclip-manager/MultiClipManager';
import LoaderButton from '../lib/loader-button/LoaderButton';


class CameraView extends Component {

  constructor(props){
    super(props);
    this.state = {
      cameraOn: true,
      multiClipMode: false,
      flash: false,
      facing: "back",
      torch: "off",
      recording: false,
      video: null,
      picture: null,
    }
    this.camera = null;
    this.captureButton = null;
    this.mcManager = null;
    this.fullsreenClip = this.fullsreenClip.bind(this);
    this.popVideoClip = this.popVideoClip.bind(this);
    this.submitVideo = this.submitVideo.bind(this);
    this.submitPicture = this.submitPicture.bind(this);

  }

  toggleFlash(){
    this.setState({flash: !this.state.flash});
  }

  switchFacing(){
    this.setState({facing: this.state.facing  == "back" ? "front" : "back"});
  }

  startRecording(){
    if(this.camera != null){

      var capture = () => {
        this.camera.startRecording().then((data)=>{
          if(this.state.multiClipMode && this.mcManager != null){
            this.mcManager.pushClip(data);
          }else{
            this.setState({video: data});
          }
        }).catch((error)=>{
            if(this.captureButton){
              this.captureButton.resetTimer(1000);
            }
        });
      }
      if(this.state.flash){
        this.setState({recording: true, torch: "on"});
        setTimeout(capture,600);
      }else{
        this.setState({recording: true});
        capture();
      }
    }
  }

  stopRecording(){
    if(this.camera != null){
      this.camera.stopRecording().catch((error)=>{});
      this.setState({recording: false, torch: "off"});
    }
  }


  takePicture(){
    if(this.camera != null && !this.state.multiClipMode){
        var snap = () => {
            this.camera.stopPreview();
            this.camera.screenshot().then((data)=>{
              this.setState({picture: data.path, torch: "off"});
            }).catch((error)=>{});
        }
        if(this.state.flash){
          this.setState({torch: "on"});
          setTimeout(snap,600); //let torch turn on and camera exposure adjust
        }else{
          snap();
        }
    }
  }

  stitchClips(){
    var that = this;
    return new Promise(function(resolve, reject) {
      if(that.state.multiClipMode && that.camera){
        that.camera.stitchVideoClips().then((data)=>{
          that.setState({multiClipMode: false, video: data});
          resolve();
        }).catch((error)=>{
          reject();
        })
      }else{
        reject();
      }
    });
  }

  clearClips(){
    if(this.state.multiClipMode || this.camera){
      this.camera.clearVideoClips();
      this.setState({multiClipMode: false});
    }
  }

  cancelVideo(){
    if(this.captureButton){this.captureButton.resetTimer();}
    this.camera.deleteVideoClip();
    this.setState({video: null});
  }

  popVideoClip(clip, empty){
    if(this.captureButton){
      this.captureButton.resetTimer(clip.duration);
    }
    if(empty){
      //no more clips in stack, revert to default mode
      this.setState({multiClipMode: false});
    }
    this.camera.deleteVideoClip();
  }

  cancelPicture(){
    this.camera.startPreview();
    this.camera.deletePicture();
    this.setState({picture: null});
  }

  saveVideo(){
    return this.camera.saveCurrentClip();
  }

  savePicture(){
    return this.camera.savePicture();
  }

  fullsreenClip(clip){
    this.setState({video: clip});
  }

  exitFullscreen(){
    this.setState({video: null});
  }

  enableMultiClipMode(){
    var data = this.state.video;
    this.setState({video: null, multiClipMode: true}, ()=>{
      if(this.mcManager != null){
        this.mcManager.pushClip(data);
      }
    });
  }

  submitVideo(caption, muted){
    if(this.state.video){
      //@TODO submit to backend & navigate
    }
  }
  submitPicture(caption){
    if(this.state.picture){
      //@TODO submit to backend & navigate
    }
  }
  renderCamera(){
    if(this.state.cameraOn){
      return (<Camera
                ref={(cam) => {
                  this.camera = cam;
                }}
                style={styles.camera}
                aspect={Camera.constants.Aspect.fill}
                captureTarget={Camera.constants.CaptureTarget.temp}
                type={this.state.facing}
                torchMode={this.state.torch}
                captureAudio={true}
                captureQuality={"1080p"}
                captureMode={"video"}
                playSoundOnCapture={false}>
                </Camera>
              );
    }else{
      return null;
    }
  }

  renderRightCameraControl(hide, opacity){
    if(this.state.multiClipMode){
         return (<LoaderButton
           disabled={hide}
           style={styles.iconButton}
           iconStyle={opacity}
           iconSize={34}
           color="#FFF"
           icon={"stop-circle-outline"}
           onPress={this.stitchClips.bind(this)}/>
         );
    }else{
      return (
          <ToggleButton disabled={hide} style={styles.iconButton}
        iconSize={34}
        color="#FFF"
        icon={"camera-party-mode"}
        toggledIcon={"emoticon-tongue"}
        forceDefault={this.state.facing == "front"}
        onPress={this.switchFacing.bind(this)}/>
      );
    }
  }

  renderCameraControls(){
    const overlay = this.state.picture != null || this.state.video != null;
    const hide = this.state.recording || overlay;

    const opacity = {opacity: hide == true ? 0 : 1};
    const opacity2 = {opacity: overlay == true ? 0 : 1};

    return (<View style={styles.bottomControls}>
             <ToggleButton disabled={hide} style={styles.iconButton}
                  iconSize={34}
                  color="#FFF"
                  icon={"flash-off"}
                  toggledIcon={"flash"}
                  onPress={this.toggleFlash.bind(this)}/>
              <CaptureButton
               style={opacity2}
               disabled={overlay}
               ref={(ref)=>{this.captureButton = ref}}
               onTimerEnd={this.stopRecording.bind(this)}
               onLongPressOut={this.stopRecording.bind(this)}
               onLongPressIn={this.startRecording.bind(this)}
               onPressOut={this.takePicture.bind(this)}/>
               {this.renderRightCameraControl(hide, opacity)}
            </View>);
  }

  renderMultiClipManager(){
    if(this.state.multiClipMode){
      return (<View style={styles.mcManager}>
        <MultiClipManager
        ref={(ref) => this.mcManager = ref}
        style={{flex: 1}}
        onClearClips={this.clearClips.bind(this)}
        onPopClip={(data, empty) => {this.popVideoClip(data, empty)}}
        onFullScreen={(clip)=>{this.fullsreenClip(clip)}}
        />
      </View>);
    }else{
      return null;
    }
  }
  render(){
    return (
      <View style={styles.container}>
        {this.renderCamera()}
        <View style={styles.uiContainer}>
          {this.renderMultiClipManager()}
          {this.renderCameraControls()}
        </View>
        <VideoView style={styles.overlay}
          onSave={this.saveVideo.bind(this)}
          onCancel={this.cancelVideo.bind(this)}
          onBack={this.exitFullscreen.bind(this)}
          onSubmit={this.submitVideo}
          onMultiClipMode={this.enableMultiClipMode.bind(this)}
          multiClipMode={this.state.multiClipMode}
          data={this.state.video}/>
        <PictureView style={styles.overlay}
          onSave={this.savePicture.bind(this)}
          onCancel={this.cancelPicture.bind(this)}
          onSubmit={this.submitPicture}
          path={this.state.picture}/>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container:{
    flex:1,
    width:'100%',
    height:'100%',
    backgroundColor:  '#000',
  },
  uiContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    flexDirection: "column",
    justifyContent: "flex-end",
    zIndex: 0
  },
  mcManager:{
    flex: .15,
    width: '100%',
  },
  bottomControls:{
    flex: .23,
    paddingBottom: '8%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  iconButton:{
    height: 50,
    width:50,
  },
  overlay:{
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 2,
    width: '100%',
    height: '100%',
  },
  camera:{
    flex: 1,
  },
});

export default CameraView;
