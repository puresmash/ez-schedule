
import React from 'react';
import ReactDOM from 'react-dom';
import {connect} from 'react-redux';
import {AddBall, SetSid, DownloadImage} from './actions/index.js'
import EditDate from './components/EditDate.js';
import EditTimeline from './components/EditTimeline.js';
import MyAccount from './components/MyAccount.js';
import DocumentList from './components/DocumentList.js';
import moment from 'moment';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import DatePicker from 'material-ui/DatePicker';
import MenuItem from 'material-ui/MenuItem';
import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton';
import Snackbar from 'material-ui/Snackbar';
import CloudUploadIcon from 'material-ui/svg-icons/file/cloud-upload';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import ExpandMoreIcon from 'material-ui/svg-icons/navigation/expand-more';
import ExpandLessIcon from 'material-ui/svg-icons/navigation/expand-less';
import PhotoIcon from 'material-ui/svg-icons/image/photo';
import RemoveRedEye from 'material-ui/svg-icons/image/remove-red-eye';
import Timelapse from 'material-ui/svg-icons/image/timelapse';
import DateRange from 'material-ui/svg-icons/action/date-range';
import Mood from 'material-ui/svg-icons/social/mood';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import Divider from 'material-ui/Divider';
import Paper from 'material-ui/Paper';
import Badge from 'material-ui/Badge';
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
        openSnackbar: false,
    }
  }

  componentDidMount(){
  }

  render(){
    let {sDate, eDate, actBalls, preBalls, svgRef, uid, sid, firebase, fileInfos, dispatch} = this.props;
    let {visibleFlag, openMainSchedule, openTimeline, openSnackbar} = this.state;
    let ballPanel = this.getBallPanel(actBalls, preBalls, sDate, eDate);
    console.log('Rendering editbox');


    return(
      <div id="editbox" className="editbox">

        <MuiThemeProvider>
        <AppBar
          title="Schedule Canvas"
          className="appbar"
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
                  <MenuItem primaryText="Schedule Upload" leftIcon={<CloudUploadIcon />} onClick={()=>{
                      this._updateStore();
                  }}/>
                  <MenuItem primaryText="Download as PNG" leftIcon={<PhotoIcon />} onClick={()=>{
                      dispatch(DownloadImage(svgRef));
                  }}/>
              </IconMenu>}
          style={{zIndex: '0'}}
        />
        </MuiThemeProvider>
        <div id="mask" style={this._getMaskVisible(visibleFlag)} onClick={()=>{
            this.setState({visibleFlag: false});
        }}>
        </div>
        <div id="side-nav" style={this.getVisible(visibleFlag)}>
            <MuiThemeProvider>
            <Paper zDepth={1} className="side-nav-wrapper">
                {/* <h2 style={{margin: 0, lineHeight: '63px', color: 'gray', paddingLeft: '72px',
                            borderBottom: '1px solid rgb(224, 224, 224)'}}>
                    Schedule
                </h2> */}
                <nav>

                    <MyAccount />
                    <DocumentList fileInfos={fileInfos} sid={sid} />
                    <MenuItem
                        primaryText="Main Schedule"
                        leftIcon={<DateRange />}
                        rightIcon={openMainSchedule? <ExpandLessIcon />:<ExpandMoreIcon />}
                        onClick={()=>{
                            this.setState({openMainSchedule: !openMainSchedule});
                        }}/>
                    <EditDate openMainSchedule={openMainSchedule} />
                    <Divider />

                    <MenuItem
                        className="menu-item"
                        primaryText={
                            <div style={{display: 'flex', alignItems: 'center'}}>
                                <span>Timeline</span>
                                <Badge badgeContent={ballPanel.length} secondary={true}
                                    style={{marginLeft: '8px', padding: 0}} badgeStyle={{position: 'relative'}}/>
                            </div>
                        }
                        leftIcon={<Timelapse />}
                        rightIcon={openTimeline? <ExpandLessIcon />:<ExpandMoreIcon />}
                        onClick={()=>{
                            this.setState({openTimeline: !openTimeline})
                        }}
                    />

                    <div style={this._getTimelineVisible(openTimeline)}>
                        {ballPanel}
                    </div>
                    <Divider style={{marginTop: openTimeline?-1:0}}/>
                    <FloatingActionButton
                        mini={true}
                        style={{marginLeft: '70%', marginTop: '-20px',
                            marginBottom: '-20px', position: 'relative', zIndex: '2'}}
                        onClick={
                          () => this._addBall()
                      }>
                      <ContentAdd />
                    </FloatingActionButton>

                    <MenuItem
                        className="menu-item"
                        primaryText="Schedule Upload"
                        leftIcon={<CloudUploadIcon />}
                        onClick={()=>{
                            this._updateStore();
                    }}/>
                    <MenuItem
                        className="menu-item"
                        primaryText="Download as PNG"
                        leftIcon={<PhotoIcon />}
                        onClick={()=>{
                            dispatch(DownloadImage(svgRef));
                    }}/>
                </nav>
                {/* <MenuItem primaryText="Thanks For helping" leftIcon={<Mood />} style={{position: 'relative', backgroundColor: 'white'}}/> */}
            </Paper>
            </MuiThemeProvider>
            <MuiThemeProvider>
                <Snackbar
                  open={openSnackbar}
                  message="Save schedule to Cloud succeed"
                  autoHideDuration={4000}
                  onRequestClose={this.toogleSnack}
                />
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
      const visible = {}
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

  getBallPanel(actBalls, preBalls, sDate, eDate){
    let ary = [];
    actBalls.forEach((value, key)=>{
        console.log(`${key}, ${value}`);
        key = StringUtils.extractIndexFromId(key);
        // preBalls always has same length with actBalls
        let act = value;
        let pre = preBalls.get(`pre-${key}`);
        ary.push(
          <EditTimeline key={`row-${key}`} sort={value.sort} act={act} pre={pre} sDate={sDate} eDate={eDate}/>
        );
    })

    return ary;
  }

  toogleSnack = () => {
      const {openSnackbar} = this.state;
      this.setState({openSnackbar: !openSnackbar});
  }

  /**
   * Firebase
   */
  _updateStore = () => {
      const {sid, user, firebase} = this.props;
      const {monthAry, actBalls, preBalls, sDate, eDate} = this.props;
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
      updates[`/users/${user.uid}/files/${sid}/time`] = firebase.database.ServerValue.TIMESTAMP;
      return firebase.database().ref().update(updates)
                .then(this.toogleSnack);
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
  const {svgRef, sid, firebase, user, fileInfos} = state.internalRef;
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
    fileInfos,
  };
}

EditBox = connect(mapStateToProps)(EditBox);

export {EditBox};
