
import React from 'react';
import {connect} from 'react-redux';
import {SetUser,SetFileIds} from '../actions/index.js'
// import firebase from 'firebase';

import MenuItem from 'material-ui/MenuItem';
import RemoveRedEye from 'material-ui/svg-icons/image/remove-red-eye';

import Avatar from './Avatar.js';

class MyAccount extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            avatarSrc: ''
        }
    }

    render(){
        let { fnDisplayFiles, user, sid } = this.props;
        return(
            <div style={{height: '150px'}}>
                <div style={{height: '102px', display: 'flex', alignItems: 'center', flexDirection: 'row'}}>
                    <div style={{flex: 1, display: 'inline-flex', justifyContent: 'center'}}>
                        <Avatar src={user.avatarSrc}></Avatar>
                    </div>
                    <div style={{flex: 3}}>
                        <span>{user.name}</span>
                    </div>
                </div>
                <MenuItem
                    onClick={()=>{
                        fnDisplayFiles();
                    }}
                    primaryText={sid}
                    rightIcon={
                        <RemoveRedEye/>
                }/>
            </div>
        );
    }

    googleLogin(){
        let self = this;
        let {firebase} = this.props;
        console.log(firebase);
        var provider = new firebase.auth.GoogleAuthProvider();
        //firebase.auth().signInWithRedirect(provider);
        firebase.auth().signInWithPopup(provider).then(function(result) {
            // This gives you a Google Access Token. You can use it to access the Google API.
            // var token = result.credential.accessToken;
            // The signed-in user info.
            var user = result.user;
            // P.S. result.user == firebase.auth().currentUser (firebase do inject for us?)
            // So we can get uid in this way.
            var userId = firebase.auth().currentUser.uid;
            var avatar = firebase.auth().currentUser.photoURL;
            var email = firebase.auth().currentUser.email;
            var displayName = firebase.auth().currentUser.displayName;
            console.log(`userId: ${userId}`);
            console.log(`avatar: ${avatar}`);
            console.log(`email: ${email}`);
            console.log(`displayName: ${displayName}`);
            self.setState({avatarSrc: avatar});
            self.props.dispatch(SetUser(userId, email, displayName));

            return userId;
        })
        .then((userId)=>{
            this._getSchedule(userId, firebase);
        })
        .catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // The email of the user's account used.
            var email = error.email;
            // The firebase.auth.AuthCredential type that was used.
            var credential = error.credential;
            // ...
            console.error(errorMessage);
        });
    }

    _getSchedule(userId, firebase){
        // var userId = firebase.auth().currentUser.uid;
        console.log(`userId:${userId} is entering for retrieving data from db`);

        return firebase.database().ref('/schedule/'+userId).once('value').then(
          (snapshot) => {
            console.log(snapshot.val());
          }
        )
        .catch((err)=>{
            console.error(`FAIL MSG: ${err}`);
            // TODO: Do something to inform user IF you want
        });
    }
}

function mapStateToProps(state) {
  const {firebase, user, fileIds, sid} = state.internalRef;
  return {
    firebase,
    user,
    fileIds,
    sid,
  };
}

export default connect(mapStateToProps)(MyAccount);
