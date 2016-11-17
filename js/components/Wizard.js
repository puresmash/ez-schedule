
import React from 'react';
import {connect} from 'react-redux';
import {UpdDate, CreateCanvas, SetFireBase, SetSid, SetUser, SetFileIds, SyncFromStroage} from '../actions/index.js';
import WizardButton from './WizardButton.js';
import moment from 'moment';
import uuid from 'node-uuid';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import DatePicker from 'material-ui/DatePicker';
import TextField from 'material-ui/TextField';
import RefreshIndicator from 'material-ui/RefreshIndicator';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

const MAX_MONTH = 6;
const MIN_MONTH = -3;

class Wizard extends React.Component{

    static STEP = {
        first: 'first',
        googleLogin: 'googleLogin',
        anonymous: 'anonymous',
        new: 'new',
        load: 'load',
        waiting: 'waiting',
    }
    static BTN = {
        anonymous: Wizard.STEP.anonymous,
        googleLogin: Wizard.STEP.googleLogin,
        new: Wizard.STEP.new,
        load: Wizard.STEP.load,
    }

    constructor(props){
        super(props);
        this.state = {
            autoOk: true,
            disableYearSelection: true,
            inputUid: '',
            errorText: '',
            step: 'first',
            traceStep: ['first'],
            selectFile: '',
        };
    }

    render(){
        let {step} = this.state;

        return (
            <div>
                {this._getWizardContent(step)}
                {this._getWizardBtn(step)}
            </div>
        );
    }

    // class First extends React.Component {
    //
    // }
    _getWizardContent(step){
        let {sDate, eDate} = this.props;

        if(step==Wizard.STEP.first){
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
        else if(step==Wizard.STEP.new){
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
        else if(step==Wizard.STEP.load){
            const {fileIds} = this.props;
            const items = [];
            fileIds.forEach((ele, index)=>{
                items.push(<MenuItem value={ele} key={index} primaryText={`${ele}`} />);
            });

            return (
                <div className="wizard">
                    <MuiThemeProvider>
                    {/* <TextField
                      floatingLabelText="Insert uid"
                      errorText={this.state.errorText}
                      onChange={(event)=>{
                          this.setState({inputUid: event.target.value});
                      }}
                    /> */}
                        <SelectField
                            value={this.state.selectFile}
                            onChange={this.handleChangeSelect}
                            underlineStyle={{borderColor: 'black'}}
                            iconStyle={{fill: 'black'}}
                            style={{overflow: 'hidden'}}>
                            {items}
                        </SelectField>
                    </MuiThemeProvider>
                </div>
            );
        }
        else if(step==Wizard.STEP.googleLogin || step==Wizard.STEP.anonymous){
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
        else if(step==Wizard.STEP.waiting){
            return(
                <div className="wizard">
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
                </div>
            );
        }
    }
    _chgStateToGoogleSignIn(){
        this.setState({step: Wizard.STEP.googleLogin});
        // can disable progress bar here.
    }
    _chgStateToAnonymousSignIn(){
        this.setState({step: Wizard.STEP.anonymous});
        // can disable progress bar here.
    }
    _getWizardBtn(step){
        const wizard = {};
        let { traceStep } = this.state;

        wizard[Wizard.STEP.first] = (
            <div className="btn-panel">
                <WizardButton
                    wording="Anonymous"
                    iconId="fa fa-user-secret"
                    style={{marginRight: '1em'}}
                    onClick={() => {
                        this.setState({step: Wizard.STEP.waiting});
                        this._anonymousLogin(this._chgStateToAnonymousSignIn.bind(this));
                    }}>
                </WizardButton>
                <WizardButton
                    wording="SignIn"
                    iconId="fa fa-google"
                    onClick={() => {
                        this.setState({step: Wizard.STEP.waiting});
                        this._googleLogin(this._chgStateToGoogleSignIn.bind(this));
                    }}>
                </WizardButton>
            </div>
        );
        wizard[Wizard.STEP.googleLogin] = (
            <div className="btn-panel">
                <WizardButton
                    wording="New"
                    iconId="fa fa-magic"
                    style={{marginRight: '1em'}}
                    onClick={
                        () => {
                            this.setState({step: Wizard.STEP.new});
                            this.setState({traceStep: traceStep.push(Wizard.STEP.googleLogin)});
                        }
                    }>
                </WizardButton>
                <WizardButton
                    wording="Load"
                    iconId="fa fa-folder-open"
                    onClick={
                        () => {
                            this.setState({step: Wizard.STEP.load});
                            this.setState({traceStep: traceStep.push(Wizard.STEP.googleLogin)});
                        }
                    }>
                </WizardButton>
            </div>
        );
        wizard[Wizard.STEP.anonymous] = (
            <div className="btn-panel">
                <WizardButton
                    wording="New"
                    iconId="fa fa-magic"
                    style={{marginRight: '1em'}}
                    onClick={
                        () => {
                            this.setState({step: Wizard.STEP.new});
                            this.setState({traceStep: traceStep.push(Wizard.STEP.anonymous)});
                        }
                    }>
                </WizardButton>
                <WizardButton
                    wording="Load"
                    iconId="fa fa-folder-open"
                    onClick={
                        () => {
                            this.setState({step: Wizard.STEP.load});
                            this.setState({traceStep: traceStep.push(Wizard.STEP.anonymous)});
                        }
                    }>
                </WizardButton>
            </div>
        );
        wizard[Wizard.STEP.new] = (
            <div className="btn-panel">
                <WizardButton
                    wording="New"
                    iconId="fa fa-magic"
                    style={{marginRight: '1em'}}
                    onClick={this._createCanvas.bind(this)}>
                </WizardButton>
            </div>
        );
        wizard[Wizard.STEP.load] = (
            <div className="btn-panel">
                <WizardButton
                    wording="Load"
                    iconId="fa fa-folder-open"
                    style={{marginRight: '1em'}}
                    onClick={this._loadfirst.bind(this)}>
                </WizardButton>
            </div>
        );
        return wizard[step];
    }
    /**
     * load
     */
     // As a arrow func property, no need to bind this
     handleChangeSelect = (event, index, value) => {
         this.setState({selectFile: value});
     }
     _loadfirst(){
         let {selectFile} = this.state;
         let {user, dispatch, firebase} = this.props;

         if(!selectFile){
             console.error('User does not have any file yet.');
             return;
         }
         return this.readFirebase(`/schedule/${user.uid}/${selectFile}/`).then(
           (snapshot) => {
             dispatch(SetSid(selectFile));
             dispatch(SyncFromStroage(snapshot));
             return snapshot.val();
           }
         )
         .catch(this.handleFirebaseError);
     }
    /**
     * new graph
     */
     _createCanvas(){
        this.props.dispatch(SetSid(uuid.v4()));
        this.props.dispatch(CreateCanvas());
     }
     _handleChangeDateS(event, dateString){
       this.props.dispatch(UpdDate(moment(dateString).format('YYYY-MM-DD'), 'start'));
     }
     _handleChangeDateE(event, dateString){
       this.props.dispatch(UpdDate(moment(dateString).format('YYYY-MM-DD'), 'end'));
     }
    /**
     * anonymous
     */
     signInAnonymous = () => {
         const {firebase} = this.props;
         return firebase.auth().signInAnonymously();
     }
     _anonymousLogin(fnOnComplete){
        let self = this;
        let {firebase} = this.props;
        this.signInAnonymous().then((user)=>{
           console.log(`anonymous signin with uid: ${user.uid}`);
           self.props.dispatch(SetUser(user.uid, 'anonymous', 'anonymous', ''));
           return user.uid;
        })
        .then(this._syncUser)
        .then(this.loadSchedule)
        .then(fnOnComplete)
        .catch(this.handleFirebaseError);
    }
    /**
     * googleLogin
     */
    signInWithProvider = (provider) => {
        const {firebase} = this.props;
        return firebase.auth().signInWithPopup(provider);
    }
    signInWithGoogle = () => {
        const {firebase} = this.props;
        return this.signInWithProvider(new firebase.auth.GoogleAuthProvider());
    }
    _googleLogin(fnOnComplete){
        let self = this;
        this.signInWithGoogle().then(() => {
            const {firebase} = this.props;
            const user = firebase.auth().currentUser;
            // This gives you a Google Access Token. You can use it to access the Google API.
            // var token = result.credential.accessToken;
            // The signed-in user info.
            // var user = result.user;
            // P.S. result.user == firebase.auth().currentUser
            var userId = firebase.auth().currentUser.uid;
            var avatar = firebase.auth().currentUser.photoURL;
            var email = firebase.auth().currentUser.email;
            var displayName = firebase.auth().currentUser.displayName;
            console.log(`userId: ${userId}`);
            console.log(`avatar: ${avatar}`);
            console.log(`email: ${email}`);
            console.log(`displayName: ${displayName}`);
            // self.setState({avatarSrc: avatar});
            self.props.dispatch(SetUser(userId, email, displayName, avatar));

            return firebase.auth().currentUser;
        })
        .then(this._syncUser)
        .then(this.loadSchedule)
        .then(fnOnComplete)
        .catch(this.handleFirebaseError);
    }
    _syncUser = ()=>{
        const {firebase} = this.props;
        const user = firebase.auth().currentUser;

        return this._checkUserExist(user)
        .then((flag)=>{
            if(!flag){
                return this._addNewUser(user);
            }
        });
    }
    _checkUserExist = (user)=>{
        return this.readFirebase('/users/'+user.uid, user)
        .then((snapshot)=>{
            if(snapshot.exists()){
                console.log(`user: ${user.uid} exist`);
                return true;
            }
            else{
                console.log(`user: ${user.uid} does not exist`);
                return false;
            }
        });
    }
    _addNewUser = (user)=>{
        const {firebase} = this.props;

        var postData = {
            name: user.displayName,
            email: user.email,
            timestamp: firebase.database.ServerValue.TIMESTAMP,
        };
        return this.updateFirebase(`/users/${user.uid}/`, postData, user);
    }
    loadSchedule = () => {
        const {firebase} = this.props;
        const user = firebase.auth().currentUser;

        return this._getSchedule(user)
        .then((snapshot)=>{
            console.log('####testing console -1')
            console.log(snapshot.val());
            let fileIds = snapshot.exists()?Object.keys(snapshot.val()):[];
            this.props.dispatch(SetFileIds(fileIds));
        })
        // .catch(function(error){
        //     console.error('loadSchedule failed');
        //     console.error('error message: '+error.message);
        // });
    }
    _getSchedule = (user) =>{
        // var userId = firebase.auth().currentUser.uid;
        return this.readFirebase(`/users/${user.uid}/files/`);
    }
    handleFirebaseError = (error) => {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        // ...
        console.error(`Fail Login- errorCode:${errorCode}, errorMessage:${errorMessage}`);
        // fnOnComplete();
    }
    readFirebase = (path) => {
        console.log(`read firebase path: ${path}`);
        return this.props.firebase.database().ref(path).once('value').then(
          (snapshot) => {
            return snapshot;
          }
      );
    }
    updateFirebase = (path, payload) => {
        return this.props.firebase.database().ref(path).update(payload);
    }

}

function mapStateToProps(state) {
  const {sDate, eDate} = state.updateBar;
  console.log(`calling mSTPs: sDate=${sDate}, eDate=${eDate}`);
  console.log(state);
  return {
    sDate,
    eDate,
    firebase: state.internalRef.firebase,
    fileIds: state.internalRef.fileIds,
    user: state.internalRef.user,
  };
}

export default connect(mapStateToProps)(Wizard);
