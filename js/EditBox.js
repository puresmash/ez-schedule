
import React from 'react';
import ReactDOM from 'react-dom';
import {connect} from 'react-redux';
import {AddBall, SetSid} from './actions/index.js'
import Calendar from './components/Calendar.js'
import EditDate from './components/EditDate.js';
import EditRow from './components/EditRow.js';
import MyAccount from './components/MyAccount.js';
import DocumentList from './components/DocumentList.js';
import moment from 'moment';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import DatePicker from 'material-ui/DatePicker';
import MenuItem from 'material-ui/MenuItem';
import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import ExpandMoreIcon from 'material-ui/svg-icons/navigation/expand-more';
import ExpandLessIcon from 'material-ui/svg-icons/navigation/expand-less';
import RemoveRedEye from 'material-ui/svg-icons/image/remove-red-eye';
import Timelapse from 'material-ui/svg-icons/image/timelapse';
import DateRange from 'material-ui/svg-icons/action/date-range';
import Mood from 'material-ui/svg-icons/social/mood';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import Divider from 'material-ui/Divider';
import Paper from 'material-ui/Paper';
// import firebase from 'firebase';
// const config = {
//  apiKey: "AIzaSyAjC9U69Tq534yHFz8TfUOJ2M37se5ITyI",
//  authDomain: "ez-schedule-2fd88.firebaseapp.com",
//  databaseURL: "https://ez-schedule-2fd88.firebaseio.com",
//  storageBucket: "ez-schedule-2fd88.appspot.com",
//  messagingSenderId: "413243052956"
// };
// firebase.initializeApp(config);

import StringUtils from './utils/Utils.js';




class EditBox extends React.Component {

  static defaultProps = {
    sDate: '',
    eDate: '',
    visible : false,
  };
  static propTypes = {
        visible: React.PropTypes.bool,
  };

  constructor(props){
    super(props);
    let visibleFlag = props.visible || EditBox.defaultProps.visible;
    this.state = {
        open: true,
        autoOk: true,
        disableYearSelection: true,
        visibleFlag,
        openMainSchedule: false,
        openTimeline: false,
    }
  }
  // prepareUpdateStore(){
  //     let uid = this.props.uid;
  //     if(uid && uid.length != 0){
  //         console.log(`found uid: ${uid} prepare to update store`)
  //         this._updateStore(uid);
  //     }
  //     else{
  //         this._createAuth()
  //     }
  // }
  // _createAuth(){
  //   this.props.firebase.auth().signInAnonymously()
  //   .then((user)=>{
  //       console.log(`create uid: ${user.uid} prepare to create store`)
  //       this.props.dispatch(SetSid(user.uid));
  //       return user.uid;
  //   })
  //   .then((uid)=>{
  //       console.log(`update store for: ${uid}`)
  //       this._updateStore(uid);
  //   })
  //   .catch((error)=>{
  //       // Handle Errors here.
  //       var errorCode = error.code;
  //       var errorMessage = error.message;
  //       console.error(`Fail Login- errorCode:${errorCode}, errorMessage:${errorMessage}`);
  //   });
  // }

  // _updateStore(uid){
  //     let {monthAry, actBalls, preBalls, sDate, eDate} = this.props;
  //     var postData = {
  //       updateBall: {
  //           actBalls,
  //           preBalls
  //       },
  //       updateBar: {
  //           sDate,
  //           eDate,
  //           monthAry
  //       }
  //     };
  //     var updates = {};
  //     updates['/schedule/' + uid] = postData;
  //     return this.props.firebase.database().ref().update(updates);
  // }

  componentDidMount(){
  }
  prepareImage(){
      let {svgRef} = this.props;

      let svghtml = svgRef.outerHTML;
      let myImageSrc = 'data:image/svg+xml;base64,' + window.btoa(svghtml);
      let image = new Image();
      image.src = myImageSrc;
      let canvas = document.createElement('canvas');
      canvas.setAttribute('width', '598px');
      canvas.setAttribute('height', '498px');
      let context = canvas.getContext('2d');

      image.onload = ()=>{

        context.drawImage(image, 0, 0);

        let canvasdata = canvas.toDataURL('image/png');
        let pngimg = new Image();
        pngimg.src = canvasdata;

        let a = document.createElement('a');
        a.download = 'sample.png';
        a.href = canvasdata;
        // console.log(a);
        a.click();
    }
  }
  render(){
    let {sDate, eDate, actBalls, svgRef, uid, sid, firebase, fileIds} = this.props;
    let {visibleFlag, openMainSchedule, openTimeline} = this.state;
    let ballPanel = this.getBallPanel(actBalls, sDate, eDate);
    console.log('Rendering editbox');


    return(
      <div id="editbox" className="editbox">

        <MuiThemeProvider>
        <AppBar
          title={"Paint Schedule-"+uid}
          iconElementLeft={
              <i
                className="fa fa-bars"
                aria-hidden="true"
                style={{lineHeight: '46px', paddingLeft: '6px',
                        paddingRight: '6px', fontSize: '20px', color: 'white'}}
                onClick={
                  () => this.toggleVisible()
              }>
              </i>
          }
          iconElementRight={
              <IconMenu
                  iconButtonElement={
                      <IconButton><MoreVertIcon /></IconButton>
                  }
                  targetOrigin={{horizontal: 'right', vertical: 'top'}}
                  anchorOrigin={{horizontal: 'right', vertical: 'top'}}
                  >
                  <MenuItem primaryText="SAVE" onClick={()=>{
                      this._updateStore();
                  }}/>
                  <MenuItem primaryText="PRINT" />
              </IconMenu>}
          style={{zIndex: '0'}}
        />
        </MuiThemeProvider>
        {/* <div style={{fontSize: '3em', display: 'flex', justifyContent: 'flex-end'}}>
            <i className="fa fa-minus-square-o" aria-hidden="true" onClick={
                () => this.toggleVisible()
            }>
            </i>
        </div> */}
        <div id="mask" style={this._getMaskVisible(visibleFlag)} onClick={()=>{
            this.setState({visibleFlag: false});
        }}>
        </div>
        <div id="container" style={this.getVisible(visibleFlag)}>
            <MuiThemeProvider>
            <Paper zDepth={1}>
                <MyAccount />
                <DocumentList fileIds={fileIds} sid={sid} />
                <MenuItem
                    primaryText="Main Schedule"
                    leftIcon={<DateRange />}
                    rightIcon={openMainSchedule? <ExpandLessIcon />:<ExpandMoreIcon />}
                    onClick={()=>{
                        this.setState({openMainSchedule: !openMainSchedule});
                    }}/>
                <EditDate openMainSchedule={openMainSchedule} />
                <Divider />
                <div className="menu-timeline">
                    <MenuItem
                        primaryText="Timeline"
                        leftIcon={<Timelapse />}
                        rightIcon={openTimeline? <ExpandLessIcon />:<ExpandMoreIcon />}
                        onClick={()=>{
                            this.setState({openTimeline: !openTimeline})
                        }}
                        />
                </div>

                <div style={this._getTimelineVisible(openTimeline)}>
                    {ballPanel}
                </div>
                <Divider />

                <FloatingActionButton
                    mini={true}
                    style={{marginLeft: '70%', marginTop: '-20px', marginBottom: '-20px', position: 'relative', zIndex: '2'}}
                    onClick={
                      () => this._addBall()
                  }>
                <ContentAdd />
                </FloatingActionButton>
                <MenuItem primaryText="Thanks" leftIcon={<Mood />} style={{position: 'relative', backgroundColor: 'white'}}/>


                {/* <div className="btn-action" onClick={
                  () => this._addBall()
                }>
                  <span className="circle btn-plus" >+</span>
                </div> */}
            </Paper>
            </MuiThemeProvider>

        </div>
      </div>
    );
  }

  toggleVisible(){
      let flag = Boolean(this.state.visibleFlag ^ true);
      this.setState({visibleFlag: flag});
  }

  getVisible(flag){
      const collapse = {
          left: '-100%',

          opacity: 0
      }
      const visible = {
          left: 0,

          opacity: 1
      }
      console.log('visibleFlag change');
      console.log(flag);
      return (flag ? visible:collapse);
  }
  _getMaskVisible(flag){
      const collapse = {
          left : '-100%',
          opacity: 0,
      }
      const visible = {
          left : 0,
      }
      return (flag ? visible:collapse);
  }
  _getTimelineVisible(flag){
      const collapse = {
          overflow: 'hidden',
          visibility: 'hidden',
          height: 0,
          opacity: 0
      }
      const visible = {
          visibility: 'visible',
          height: 'auto',
          opacity: 1
      }
      return (flag ? visible:collapse);
  }
  _addBall(){
    this.props.dispatch(AddBall());
  }

  getBallPanel(ballMap , sDate, eDate){
    let ary = [];
    ballMap.forEach((value, key)=>{
        console.log(`${key}, ${value}`);
        key = StringUtils.extractIndexFromId(key);
        let a = `act-${key}`;
        let b = `pre-${key}`;
        ary.push(
          <EditRow key={`row-${key}`} sort={value.sort} a={a} b={b} sDate={sDate} eDate={eDate}/>
        );
    })

    return ary;
  }
  /**
   * Firebase
   */
  _updateStore = () => {
      let {sid, user} = this.props;
      let {monthAry, actBalls, preBalls, sDate, eDate} = this.props;
      var postData = {
        updateBall: {
            actBalls,
            preBalls
        },
        updateBar: {
            sDate,
            eDate,
            monthAry
        }
      };
      var updates = {};
      updates[`/schedule/${user.uid}/${sid}`] = postData;
      updates[`/users/${user.uid}/files/${sid}`] = 'time';
      return this.props.firebase.database().ref().update(updates);
  }
  readFirebase = (path) => {
      return this.props.firebase.database().ref(path).once('value').then(
        (snapshot) => {
          return snapshot.val();
        }
    );
  }
  updateFirebase = (path, payload) => {
      return this.props.firebase.database().ref(path).update(payload);
  }

}

function mapStateToProps(state) {
  const {sDate, eDate} = state.updateBar;
  const {svgRef, sid, firebase, user, fileIds} = state.internalRef;
  console.log(`calling mSTPs: sDate=${sDate}, eDate=${eDate}`);
  return {
    sDate,
    eDate,
    monthAry: state.updateBar.monthAry,
    actBalls: state.updateBall.actBalls,
    preBalls: state.updateBall.preBalls,
    svgRef,
    sid,
    firebase,
    user,
    fileIds,
  };
}

EditBox = connect(mapStateToProps)(EditBox);

export {EditBox};
