
import React from 'react';
import ReactDOM from 'react-dom';
import {connect} from 'react-redux';
import {UpdDate, CreateCanvas, AddBall, UpdActBall, UpdPreBall, UpdDesc, SetUid} from './actions/index.js'
import Calendar from './components/Calendar.js'
import moment from 'moment';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import DatePicker from 'material-ui/DatePicker';
import MenuItem from 'material-ui/MenuItem';
import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';

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
import EditRow from './components/EditRow.js';

const MAX_MONTH = 6;
const MIN_MONTH = -3;

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
    }
  }
  prepareUpdateStore(){
      let uid = this.props.uid;
      if(uid && uid.length != 0){
          console.log(`found uid: ${uid} prepare to update store`)
          this._updateStore(uid);
      }
      else{
          this._createAuth()
      }
  }
  _createAuth(){
    this.props.firebase.auth().signInAnonymously()
    .then((user)=>{
        console.log(`create uid: ${uid} prepare to create store`)
        this.props.dispatch(SetUid(user.uid));
        return user.uid;
    })
    .then((uid)=>{
        console.log(`update store for: ${uid}`)
        this.updateStore(uid);
    })
    .catch((error)=>{
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        console.error(`Fail Login- errorCode:${errorCode}, errorMessage:${errorMessage}`);
    });
  }
  _updateStore(uid){
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
      updates['/schedule/' + uid] = postData;
      return this.props.firebase.database().ref().update(updates);
  }
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
    let {sDate, eDate, actBalls, svgRef} = this.props;
    let {visibleFlag} = this.state;
    let ballPanel = this.getBallPanel(actBalls, sDate, eDate);
    console.log('Rendering editbox');


    return(
      <div id="editbox" className="editbox">

        <MuiThemeProvider>
        <AppBar
          title="Paint Schedule"
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
                      this.prepareUpdateStore();
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
        <div id="container" style={{visibility: this.getVisible(visibleFlag)}}>
            <div className="edit-row edit-date">
                <div>
                    <div className="edit-row-detail" style={{marginBottom: '8px'}}>
                        <label className="edit-lbl">Start</label>
                        <MuiThemeProvider>
                          <DatePicker
                              className="datepicker-bar"
                              onChange={this._handleChangeDateS.bind(this)}
                              shouldDisableDate={(date)=>{return date.getDate() != 1}}
                              value={sDate? moment(sDate).toDate(): ''}
                              hintText="Insert Start Date"
                              minDate={moment().add(MIN_MONTH, 'M').toDate()}
                              maxDate={moment().add(MAX_MONTH, 'M').toDate()}
                              autoOk={this.state.autoOk}
                              disableYearSelection={this.state.disableYearSelection}/>
                        </MuiThemeProvider>
                        {/* <Calendar onChange={this._handleChangeDateS.bind(this)} placeholder={'Insert Start Date'}
                                  maxDate={moment().add(MAX_MONTH, 'M').format('YYYY-MM')}
                                  minDate={moment().add(MIN_MONTH, 'M').format('YYYY-MM')}
                                  value={sDate} clearIcon={visibleFlag}></Calendar> */}
                    </div>
                    <div className="edit-row-detail" style={{marginBottom: '8px'}}>
                        <label className="edit-lbl">End</label>
                        <MuiThemeProvider>
                          <DatePicker
                              className="datepicker-bar"
                              onChange={this._handleChangeDateE.bind(this)}
                              shouldDisableDate={(date)=>{
                                  return date.getDate() != moment(date).daysInMonth()
                              }}
                              value={eDate? moment(eDate).toDate(): ''}
                              hintText="Insert End Date"
                              minDate={moment().add(MIN_MONTH, 'M').toDate()}
                              maxDate={moment().add(MAX_MONTH, 'M').toDate()}
                              autoOk={this.state.autoOk}
                              disableYearSelection={this.state.disableYearSelection}/>
                        </MuiThemeProvider>
                        {/* <Calendar onChange={this._handleChangeDateE.bind(this)} placeholder={'Insert End Date'}
                                  maxDate={moment().add(MAX_MONTH, 'M').format('YYYY-MM')}
                                  minDate={moment().add(MIN_MONTH, 'M').format('YYYY-MM')}
                                  value={eDate} clearIcon={visibleFlag}></Calendar> */}
                    </div>
                </div>

                <div style={{display: 'inline-flex',alignItems: 'center'}}>
                    <div className="btn-canvas" onClick={
                        (event) => this._createCanvas()
                    }>
                        <i className="fa fa-repeat" aria-hidden="true"></i>
                    </div>
                    <div className="btn-canvas" onClick={
                        () => this.prepareImage()
                    }>
                        <i className="fa fa-download" aria-hidden="true"></i>
                    </div>
                    {/* <div className="btn-canvas" onClick={
                        () => this.testFirebase()
                    }>
                        <i className="fa fa-cloud-download" aria-hidden="true"></i>
                    </div> */}
                </div>
            </div>
            {ballPanel}
            <div className="btn-action" onClick={
              () => this._addBall()
            }>
              <span className="circle btn-plus" >+</span>
            </div>
        </div>
      </div>
    );
  }

  toggleVisible(){
      let flag = Boolean(this.state.visibleFlag ^ true);
      this.setState({visibleFlag: flag});
  }
  getVisible(flag){
      return (flag ? 'visible':'hidden');
  }
  _createCanvas(){
    this.props.dispatch(CreateCanvas());
  }
  _handleChangeDateS(event, dateString){
    this.props.dispatch(UpdDate(moment(dateString).format('YYYY-MM-DD'), 'start'));
  }
  _handleChangeDateE(event, dateString){
    this.props.dispatch(UpdDate(moment(dateString).format('YYYY-MM-DD'), 'end'));
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

}

function mapStateToProps(state) {
  const {sDate, eDate} = state.updateBar;
  const {svgRef, uid, firebase} = state.internalRef;
  console.log(`calling mSTPs: sDate=${sDate}, eDate=${eDate}`);
  return {
    sDate,
    eDate,
    monthAry: state.updateBar.monthAry,
    actBalls: state.updateBall.actBalls,
    preBalls: state.updateBall.preBalls,
    svgRef,
    uid,
    firebase,
  };
}

EditBox = connect(mapStateToProps)(EditBox);

export {EditBox};
