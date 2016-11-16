
import React from 'react';
import {connect} from 'react-redux';
import {UpdDate, CreateCanvas, SetFireBase, SetUid, SyncFromStroage} from '../actions/index.js';
import moment from 'moment';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import DatePicker from 'material-ui/DatePicker';
import TextField from 'material-ui/TextField';
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();
// import MyDialog from './Window.js'

const MAX_MONTH = 6;
const MIN_MONTH = -3;

class Surface extends React.Component {
    static STEP = {
        first: 'first',
        googleLogin: 'googleLogin',
        anonymous: 'anonymous',
        new: 'new',
        load: 'load',
    }
    constructor(){
      super();
      this.state = {
          open: true,
          autoOk: true,
          disableYearSelection: true,
          closeComponent: false,
          inputUid: '',
          errorText: '',
          step: 'first',
          traceStep: ['first'],
      };

    }
    componentDidMount(){
        this.props.dispatch(SetFireBase());
    }
    onChange(dateString){
      console.log(dateString);
    }
    handleOpen(){
        this.setState({open: true});
    }

    handleClose(){
        this.setState({open: false});
    }

    render(){
       let {sDate, eDate} = this.props;
       let { step } = this.state;
    //   let wizard = this.getWizard(sDate, eDate);

      return(
        //   <MyDialog></MyDialog>
        <div id="surface" className="flex-center" style={this.getVisWindow()}>
          <div className="window">
              <div className="state">
                    <h2>Wizard</h2>
                    <i className="fa fa-times" aria-hidden="true" onClick={
                        ()=>this.closeWindow()
                    }></i>
              </div>

                {this.getWizard(step)}
                {this.getStep(step)}
          </div>
        </div>
      );
    }
    getSchedule(uid){
        const {firebase, dispatch} = this.props
        console.log(`Prepare to Sync by uid: ${uid}`);
        return firebase.database().ref('/schedule/' + uid).once('value').then(function(snapshot) {
            // let sDate = snapshot.val().updateBar.sDate;
            dispatch(SetUid(uid));
            dispatch(SyncFromStroage(snapshot));

        })
        .catch((error)=>{
            console.error(error);
            this.setState({errorText: 'wrong uid or file does not exist'});
        });
    }

    _createCanvas(){
      this.props.dispatch(CreateCanvas());
    }
    getDisableDate(date){
        return date.getDate() != 1;
    }
    _handleChangeDateS(event, dateString){
      this.props.dispatch(UpdDate(moment(dateString).format('YYYY-MM-DD'), 'start'));
    }
    _handleChangeDateE(event, dateString){
      this.props.dispatch(UpdDate(moment(dateString).format('YYYY-MM-DD'), 'end'));
    }

    // _handleChangeDateS(){
    //   let sDate = ReactDOM.findDOMNode(this.refs.sDate).value;
    //   console.log(`change sDate by wizard: ${sDate}`);
    //   this.props.dispatch(UpdDate(sDate, 'start'));
    // }
    // _handleChangeDateE(){
    //     let eDate = ReactDOM.findDOMNode(this.refs.eDate).value;
    //     console.log(`change eDate by wizard: ${eDate}`);
    //     this.props.dispatch(UpdDate(eDate, 'end'));
    // }

    closeWindow(){
        this.setState({closeComponent: true});
    }

    getVisWindow(){
        if(this.state.closeComponent)
            return {display: 'none'};
        return {};
    }

    getWizard(step){
        let {sDate, eDate} = this.props;

        if(step==Surface.STEP.first){
            return (
                <div className="wizard">
                    <div className="desciption">
                        <div className="content">
                            <p style={{paddingTop: '8px'}}>
                                Choose you identity:
                            </p>
                            <p style={{paddingBottom: '8px', lineHeight: '24px'}}>
                                You can enjoy our features anonymously,
                                or login by your google account to draw schedules on each of your devices synchronously
                            </p>
                        </div>
                    </div>
                </div>
            );
        }
        else if(step==Surface.STEP.new){
            return (
                <div className="wizard">
                    <MuiThemeProvider>
                      <DatePicker
                          className="datepicker-wizard"
                          onChange={this._handleChangeDateS.bind(this)}
                          shouldDisableDate={(date)=>{return date.getDate() != 1}}
                          floatingLabelText="Insert Start Date"
                          minDate={moment().add(MIN_MONTH, 'M').toDate()}
                          maxDate={moment().add(MAX_MONTH, 'M').toDate()}
                          autoOk={this.state.autoOk}
                          disableYearSelection={this.state.disableYearSelection}/>
                    </MuiThemeProvider>
                    <MuiThemeProvider>
                      <DatePicker
                          className="datepicker-wizard"
                          onChange={this._handleChangeDateE.bind(this)}
                          shouldDisableDate={(date)=>{
                              return date.getDate() != moment(date).daysInMonth()
                          }}
                          floatingLabelText="Insert End Date"
                          minDate={moment().add(MIN_MONTH, 'M').toDate()}
                          maxDate={moment().add(MAX_MONTH, 'M').toDate()}
                          autoOk={this.state.autoOk}
                          disableYearSelection={this.state.disableYearSelection}/>
                    </MuiThemeProvider>
                </div>
            );
        }
        else if(step==Surface.STEP.load){
            return (
                <div className="wizard">
                    <MuiThemeProvider>
                    <TextField
                      floatingLabelText="Insert uid"
                      errorText={this.state.errorText}
                      onChange={(event)=>{
                          this.setState({inputUid: event.target.value});
                      }}
                    />
                    </MuiThemeProvider>
                </div>
            );
        }
        else if(step==Surface.STEP.googleLogin || step==Surface.STEP.anonymous){
            return (
                <div className="wizard">
                    <div className="desciption">
                        <div className="content">
                            <p style={{paddingTop: '8px'}}>
                                Choose action you need:
                            </p>
                            <p style={{paddingBottom: '8px', lineHeight: '24px'}}>
                                Load your old file, or create a new file ?
                            </p>
                        </div>
                    </div>
                </div>
            );
        }
    }
    getStep(step){
        const wizard = {};
        let { traceStep } = this.state;

        wizard[Surface.STEP.first] = (
            <div className="btn-panel">
                <div className="button" style={{marginRight: '1em'}} onClick={
                  () => this.setState({step: Surface.STEP.anonymous})
                }>
                    <i className="fa fa-cloud-download" aria-hidden="true">
                      <span style={{paddingLeft: '0.5em'}}>Anonymous</span>
                    </i>
                </div>
                <div className="button" onClick={
                  () => this.setState({step: Surface.STEP.googleLogin})
                }>
                    <i className="fa fa-cloud-download" aria-hidden="true">
                      <span style={{paddingLeft: '0.5em'}}>Google Signin</span>
                    </i>
                </div>
            </div>
        );
        wizard[Surface.STEP.googleLogin] = (
            <div className="btn-panel">
                <div className="button" style={{marginRight: '1em'}} onClick={
                  () => {
                      this.setState({step: Surface.STEP.new, traceStep: traceStep.push(Surface.STEP.googleLogin)});
                  }
                }>
                    <i className="fa fa-cloud-download" aria-hidden="true">
                      <span style={{paddingLeft: '0.5em'}}>New</span>
                    </i>
                </div>
                <div className="button" onClick={
                  () => {
                      this.setState({step: Surface.STEP.load, traceStep: traceStep.push(Surface.STEP.googleLogin)});
                  }
                }>
                    <i className="fa fa-cloud-download" aria-hidden="true">
                      <span style={{paddingLeft: '0.5em'}}>Load</span>
                    </i>
                </div>
            </div>
        );
        wizard[Surface.STEP.anonymous] = (
            <div className="btn-panel">
                <div className="button" style={{marginRight: '1em'}} onClick={
                  () => {
                      this.setState({step: Surface.STEP.new, traceStep: traceStep.push(Surface.STEP.anonymous)});
                  }
                }>
                    <i className="fa fa-cloud-download" aria-hidden="true">
                      <span style={{paddingLeft: '0.5em'}}>New</span>
                    </i>
                </div>
                <div className="button" onClick={
                  () => {
                      this.setState({step: Surface.STEP.load, traceStep: traceStep.push(Surface.STEP.anonymous)});
                  }
                }>
                    <i className="fa fa-cloud-download" aria-hidden="true">
                      <span style={{paddingLeft: '0.5em'}}>Load</span>
                    </i>
                </div>
            </div>
        );
        wizard[Surface.STEP.new] = (
            <div className="btn-panel">
                <div className="button" style={{marginRight: '1em'}} onClick={
                  (event) => this._createCanvas()
                }>
                    <i className="fa fa-cloud-download" aria-hidden="true">
                      <span style={{paddingLeft: '0.5em'}}>New</span>
                    </i>
                </div>
            </div>
        );
        wizard[Surface.STEP.load] = (
            <div className="btn-panel">
                <div className="button" style={{marginRight: '1em'}} onClick={
                    () => {}
                }>
                    <i className="fa fa-cloud-download" aria-hidden="true">
                      <span style={{paddingLeft: '0.5em'}}>Load</span>
                    </i>
                </div>
            </div>
        );
        return wizard[step];
    }
}

function mapStateToProps(state) {
  const {sDate, eDate} = state.updateBar;
  console.log(`calling mSTPs: sDate=${sDate}, eDate=${eDate}`);
  console.log(state);
  return {
    sDate,
    eDate,
    firebase: state.internalRef.firebase
  };
}

Surface = connect(mapStateToProps)(Surface);

export {Surface};
