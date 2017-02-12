
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import uuid from 'node-uuid';

import { UpdDate, CreateCanvas, SetSid, SetUser, GoogleLogin, AnonymousLogin, SyncFromStroageEx } from '../actions/index.js';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import DatePicker from 'material-ui/DatePicker';
import TextField from 'material-ui/TextField';
import RefreshIndicator from 'material-ui/RefreshIndicator';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

import {Step, StepTitle, StepDescription, StepTextContent, StepButton,
            StepFooter, StepPlainContent} from './step/Step.js'

const MAX_MONTH = 6;
const MIN_MONTH = -3;

class Wizard extends Component{

    static STEP = {
        first: 'first',
        googleLogin: 'googleLogin',
        anonymous: 'anonymous',
        new: 'new',
        load: 'load',
        waiting: 'waiting',
    }

    static propTypes = {
        onComplete: PropTypes.func.isRequired
    };

    constructor(props){
        super(props);
        this.state = {
            autoOk: true,
            disableYearSelection: true,
            step: 'first',
            traceStep: ['first'],
            selectFile: '',
        };
    }

    render(){
        const { dispatch, onComplete } = this.props;
        const { step, traceStep } = this.state;

        return (
            <div>
              <Step stepIndex={Wizard.STEP.first} activeStep={step}>
                <StepTextContent>
                  <StepTitle>Choose you identity:</StepTitle>
                  <StepDescription>
                    You can enjoy our features anonymously,
                    or login by your google account to draw schedules on each of your devices synchronously
                  </StepDescription>
                </StepTextContent>
                <StepFooter>
                  <StepButton
                    wording="Anonymous"
                    iconId="fa fa-user-secret"
                    style={{marginRight: '1em'}}
                    onClick={() => {
                      this.setState({step: Wizard.STEP.waiting});
                      dispatch(AnonymousLogin(this._chgStateToAnonymousSignIn.bind(this)));
                    }}>
                  </StepButton>
                  <StepButton
                    wording="SignIn"
                    iconId="fa fa-google"
                    onClick={() => {
                      this.setState({step: Wizard.STEP.waiting});
                      dispatch(GoogleLogin(this._chgStateToGoogleSignIn.bind(this)));
                        }}>
                    </StepButton>
                </StepFooter>
            </Step>

            <Step stepIndex={Wizard.STEP.googleLogin} activeStep={step}>
                <StepTextContent>
                    <StepTitle>Choose action you need:</StepTitle>
                    <StepDescription>
                        Load your old file, or create a new file ?
                    </StepDescription>
                </StepTextContent>
                <StepFooter>
                    <StepButton
                        wording="New"
                        iconId="fa fa-magic"
                        style={{marginRight: '1em'}}
                        onClick={() => {
                            this.setState({step: Wizard.STEP.new});
                            this.setState({traceStep: traceStep.push(Wizard.STEP.googleLogin)});
                        }}>
                    </StepButton>
                    <StepButton
                        wording="Load"
                        iconId="fa fa-folder-open"
                        onClick={() => {
                            this.setState({step: Wizard.STEP.load});
                            this.setState({traceStep: traceStep.push(Wizard.STEP.googleLogin)});
                        }}>
                    </StepButton>
                </StepFooter>
            </Step>

            <Step stepIndex={Wizard.STEP.anonymous} activeStep={step}>
                <StepTextContent>
                    <StepTitle>Choose action you need:</StepTitle>
                    <StepDescription>
                        Load your old file, or create a new file ?
                    </StepDescription>
                </StepTextContent>
                <StepFooter>
                    <StepButton
                        wording="New"
                        iconId="fa fa-magic"
                        style={{marginRight: '1em'}}
                        onClick={() => {
                            this.setState({step: Wizard.STEP.new});
                            this.setState({traceStep: traceStep.push(Wizard.STEP.anonymous)});
                        }}>
                    </StepButton>
                    <StepButton
                        wording="Load"
                        iconId="fa fa-folder-open"
                        onClick={() => {
                            this.setState({step: Wizard.STEP.load});
                            this.setState({traceStep: traceStep.push(Wizard.STEP.anonymous)});
                        }}>
                    </StepButton>
                </StepFooter>
            </Step>

            <Step stepIndex={Wizard.STEP.waiting} activeStep={step}>
                <StepPlainContent>
                    <MuiThemeProvider>
                        <RefreshIndicator
                          size={50}
                          left={0}
                          top={0}
                          loadingColor="#FF9800"
                          status="loading"
                          style={{position: 'relative'}}
                        />
                    </MuiThemeProvider>
                </StepPlainContent>
            </Step>

            <Step stepIndex={Wizard.STEP.new} activeStep={step}>
                <StepPlainContent>
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
                </StepPlainContent>
                <StepFooter>
                    <StepButton
                        wording="New"
                        iconId="fa fa-magic"
                        style={{marginRight: '1em'}}
                        onClick={()=>{
                            this._createCanvas(onComplete);
                        }}>
                    </StepButton>
                </StepFooter>
            </Step>

            <Step stepIndex={Wizard.STEP.load} activeStep={step}>
                <StepPlainContent>
                    <MuiThemeProvider>
                        <SelectField
                            value={this.state.selectFile}
                            onChange={this.handleChangeSelect}
                            underlineStyle={{borderColor: 'black'}}
                            iconStyle={{fill: 'black'}}
                            style={{overflow: 'hidden'}}>
                            {this._getItems()}
                        </SelectField>
                    </MuiThemeProvider>
                </StepPlainContent>
                <StepFooter>
                    <StepButton
                        wording="Load"
                        iconId="fa fa-folder-open"
                        style={{marginRight: '1em'}}
                        onClick={()=>{
                            this._loadfirst(onComplete);
                        }}>
                    </StepButton>
                </StepFooter>
            </Step>
            </div>
        );
    }

    _getItems = () => {
        const {fileInfos} = this.props;
        const items = [];
        for(let fileId in fileInfos){
            let filename = fileInfos[fileId].name || fileId;
            items.push(<MenuItem value={fileId} key={fileId} primaryText={filename} />);
        }
        return items;
    }
    _chgStateToGoogleSignIn(){
        this.setState({step: Wizard.STEP.googleLogin});
        // can disable progress bar here.
    }
    _chgStateToAnonymousSignIn(){
        this.setState({step: Wizard.STEP.anonymous});
        // can disable progress bar here.
    }
    /**
     * load
     */
     // As a arrow func property, no need to bind this
     handleChangeSelect = (event, index, value) => {
         this.setState({selectFile: value});
     }
     _loadfirst = (onComplete) => {
         let {selectFile} = this.state;
         let { dispatch } = this.props;
         if(!selectFile){
             console.error('User does not have any file yet.');
             return;
         }
         dispatch(SyncFromStroageEx(selectFile, onComplete));
     }
    /**
     * new graph
     */
     _createCanvas = (onComplete) => {
        const { sDate, eDate } = this.props;
        this.props.dispatch(SetSid(uuid.v4()));
        this.props.dispatch(CreateCanvas());
        if(sDate && eDate){
            onComplete();
        }
     }
     _handleChangeDateS(event, dateString){
       this.props.dispatch(UpdDate(moment(dateString).format('YYYY-MM-DD'), 'start'));
     }
     _handleChangeDateE(event, dateString){
       this.props.dispatch(UpdDate(moment(dateString).format('YYYY-MM-DD'), 'end'));
     }

}

function mapStateToProps(state) {
  return {
    fileInfos: state.internalRef.fileInfos,
    sDate: state.updateBar.sDate,
    eDate: state.updateBar.eDate
  };
}

export default connect(mapStateToProps)(Wizard);
