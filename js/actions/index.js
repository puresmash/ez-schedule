
import firebase from 'firebase';

let nextBallId = 0;
//let nextPreBallId = 0;

export const UpdActBallColor = (id, color) => {
    return {
        type: 'UPD_ACT_BALL_COLOR',
        id,
        color
    }
}

export const UpdPreBallColor = (id, color) => {
    return {
        type: 'UPD_PRE_BALL_COLOR',
        id,
        color
    }
}

export const UpdActBall = (id, date) => {
    return {
        type: 'UPD_ACT_BALL',
        id,
        date
    }
}

export const UpdPreBall = (id, date) => {
    return {
        type: 'UPD_PRE_BALL',
        id,
        date
    }
}

export const AddBall = () => {
    return {
        type: 'ADD_BALL',
        id: nextBallId++,
        color: 'blue'
    }
}

export const UpdDesc = (id, desc) => {
    return {
        type: 'UPD_DESC',
        id,
        desc
    }
}

export const UpdDate = (data, option) => {
    return {
        type: 'UPD_DATE',
        option,
        data
    }
}

export const CreateCanvas = () => {
    return {
        type: 'UPD_BAR'
    }
}

export const RefSvg = (svg) => {
    return {
        type: 'REF_SVG',
        ref: svg
    }
}

export const SetUA = (userAgent) => {
    return {
        type: 'SET_UA',
        userAgent
    }
}

export const SetSid = (sid) => {
    return {
        type: 'SET_SID',
        sid
    }
}
export const SetUser = (uid, email, name, avatarSrc) => {
    return {
        type: 'SET_USER',
        uid,
        email,
        name,
        avatarSrc,
    }
}
export const SetFileIds = (fileIds) => {
    return {
        type: 'SET_FILE_IDS',
        fileIds,
    }
}

export const AnonymousLogin = (fnOnComplete, firebase) => {
    return function(dispatch) {

       signInAnonymous(firebase).then((user)=>{
          console.log(`anonymous signin with uid: ${user.uid}`);
          dispatch(SetUser(user.uid, 'anonymous', 'anonymous', ''));
          return user.uid;
       })
       .then(_syncUser.bind(this, firebase))
       .then(LoadScheduleArray.bind(this, firebase, dispatch))
       .then(fnOnComplete)
       .catch(handleFirebaseError);
   };
}
const signInAnonymous = (firebase) => {
    return firebase.auth().signInAnonymously();
}

export const GoogleLogin = (fnOnComplete, firebase) => {

    return function(dispatch) {
        signInWithGoogle(firebase).then(() => {
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

            dispatch(SetUser(userId, email, displayName, avatar));

            return firebase.auth().currentUser;
        })
        .then(_syncUser.bind(this, firebase))
        .then(LoadScheduleArray.bind(this, firebase, dispatch))
        .then(fnOnComplete)
        .catch(handleFirebaseError);
    }
}

const signInWithProvider = (provider, firebase) => {

    return firebase.auth().signInWithPopup(provider);
}
const signInWithGoogle = (firebase) => {
    return signInWithProvider(new firebase.auth.GoogleAuthProvider(), firebase);
}

const _syncUser = (firebase)=>{
    const user = firebase.auth().currentUser;

    return _checkUserExist(user, firebase)
    .then((flag)=>{
        if(!flag){
            return _addNewUser(user, firebase);
        }
    });
}
const _checkUserExist = (user, firebase)=>{
    return readFirebase('/users/'+user.uid, firebase)
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
const _addNewUser = (user, firebase)=>{

    var postData = {
        name: user.displayName,
        email: user.email,
        timestamp: firebase.database.ServerValue.TIMESTAMP,
    };
    return updateFirebase(`/users/${user.uid}/`, postData, user);
}

export const LoadScheduleArray = (firebase, dispatch) => {
    const user = firebase.auth().currentUser;

    return getScheduleArray(user, firebase)
    .then((snapshot)=>{
        // console.log(snapshot.val());
        let fileIds = snapshot.exists() ? Object.keys(snapshot.val()):[];
        dispatch(SetFileIds(fileIds));
    });
}
const getScheduleArray = (user, firebase) => {
    // var userId = firebase.auth().currentUser.uid;
    return readFirebase(`/users/${user.uid}/files/`, firebase);
}

export const SetFireBase = () => {
    const config = {
     apiKey: "AIzaSyAjC9U69Tq534yHFz8TfUOJ2M37se5ITyI",
     authDomain: "ez-schedule-2fd88.firebaseapp.com",
     databaseURL: "https://ez-schedule-2fd88.firebaseio.com",
     storageBucket: "ez-schedule-2fd88.appspot.com",
     messagingSenderId: "413243052956"
    };
    firebase.initializeApp(config);
    return {
        type: 'SET_FB',
        firebase
    }
}

export const SyncFromStroage = (snapshot) => {
    let sDate = '';
    let eDate = '';
    let monthAry = [];
    let preBalls = new Map();
    let actBalls = new Map();

    if(snapshot.child('updateBar').exists()){
        sDate = snapshot.val().updateBar.sDate;
        eDate = snapshot.val().updateBar.eDate;
        monthAry = snapshot.val().updateBar.monthAry;
    }
    if(snapshot.child('updateBall').exists()){
        preBalls = new Map(snapshot.val().updateBall.preBalls);
        actBalls = new Map(snapshot.val().updateBall.actBalls);
    }
    return {
        type: 'SYNC',
        monthAry,
        sDate,
        eDate,
        actBalls,
        preBalls
    }
}

/* Move fnFirebase into action END */
export const SyncFromStroageEx = (selectFile, firebase) => {
    return function (dispatch) {
        return loadSchedule(selectFile, firebase).then(
          (snapshot) => {
            dispatch(SetSid(selectFile));
            dispatch(SyncFromStroage(snapshot));
            return snapshot.val();
          }
        )
        .catch(handleFirebaseError);
    };
}

const loadSchedule = (selectFile, firebase) => {
    const user = firebase.auth().currentUser;

    return readFirebase(`/schedule/${user.uid}/${selectFile}/`, firebase);
}
const handleFirebaseError = (error) => {
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
const readFirebase = (path, firebase) => {
    console.log(`read firebase path: ${path}`);
    return firebase.database().ref(path).once('value').then(
      (snapshot) => {
        return snapshot;
      }
  );
}
const updateFirebase = (path, payload, firebase) => {
    return firebase.database().ref(path).update(payload);
}
/* Move fnFirebase into action END */
