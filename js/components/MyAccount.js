
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import firebase from 'firebase';

import { SetUser } from '../actions/index';
import Avatar from './Avatar';

class MyAccount extends Component {

  constructor(props) {
    super(props);
    this.state = {
      avatarSrc: '',
    };
  }

  render() {
    const { user } = this.props;
    return(
      <div>
        <div style={{ height: '102px', display: 'flex', alignItems: 'center', flexDirection: 'row' }}>
          <div style={{ flex: 1, display: 'inline-flex', justifyContent: 'center' }}>
            <Avatar src={user.avatarSrc} />
          </div>
          <div style={{flex: 3}}>
            <span>{user.name}</span>
          </div>
        </div>
      </div>
    );
  }

  googleLogin(){
    let self = this;
    var provider = new firebase.auth.GoogleAuthProvider();
    //firebase.auth().signInWithRedirect(provider);
    firebase.auth().signInWithPopup(provider).then(function(result) {
      // This gives you a Google Access Token. You can use it to access the Google API.
      // var token = result.credential.accessToken;
      // The signed-in user info.
      const user = result.user;
      // P.S. result.user == firebase.auth().currentUser (firebase do inject for us?)
      // So we can get uid in this way.
      const userId = firebase.auth().currentUser.uid;
      const avatar = firebase.auth().currentUser.photoURL;
      const email = firebase.auth().currentUser.email;
      const displayName = firebase.auth().currentUser.displayName;
      console.log(`userId: ${userId}`);
      console.log(`avatar: ${avatar}`);
      console.log(`email: ${email}`);
      console.log(`displayName: ${displayName}`);
      self.setState({ avatarSrc: avatar });
      self.props.dispatch(SetUser(userId, email, displayName));

      return userId;
    })
    .then((userId) => {
      this._getSchedule(userId);
    })
    .catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      const credential = error.credential;
      // ...
      console.error(errorMessage);
    });
  }

  _getSchedule(userId) {
    // var userId = firebase.auth().currentUser.uid;
    console.log(`userId:${userId} is entering for retrieving data from db`);

    return firebase.database().ref(`/schedule/${userId}`).once('value').then(
      (snapshot) => {
        console.log(snapshot.val());
      }
    )
    .catch((err) => {
      console.error(`FAIL MSG: ${err}`);
      // TODO: Do something to inform user IF you want
    });
  }
}

function mapStateToProps(state) {
  const { user, fileIds, sid } = state.internalRef;
  return {
    user,
    fileIds,
    sid,
  };
}

export default connect(mapStateToProps)(MyAccount);
