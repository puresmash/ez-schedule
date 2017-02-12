
import firebase from 'firebase';

let nextBallId = 0;
// let nextPreBallId = 0;

export const UpdActBallColor = (id, color) => {
  return {
    type: 'UPD_ACT_BALL_COLOR',
    id,
    color,
  };
};

export const UpdPreBallColor = (id, color) => {
  return {
    type: 'UPD_PRE_BALL_COLOR',
    id,
    color,
  };
};

export const UpdActBall = (id, date) => {
  return {
    type: 'UPD_ACT_BALL',
    id,
    date,
  };
};

export const UpdPreBall = (id, date) => {
  return {
    type: 'UPD_PRE_BALL',
    id,
    date,
  };
};

export const AddBall = () => {
  return {
    type: 'ADD_BALL',
    id: nextBallId++,
    color: 'blue',
  };
};

export const UpdDesc = (id, desc) => {
  return {
    type: 'UPD_DESC',
    id,
    desc,
  };
};

export const UpdDate = (data, option) => {
  return {
    type: 'UPD_DATE',
    option,
    data,
  };
};

export const CreateCanvas = () => {
  return {
    type: 'UPD_BAR',
  };
};

export const RefSvg = (svg) => {
  return {
    type: 'REF_SVG',
    ref: svg,
  };
};

export const SetUA = (userAgent) => {
  return {
    type: 'SET_UA',
    userAgent,
  };
};

export const SetSid = (sid) => {
  return {
    type: 'SET_SID',
    sid,
  };
};

export const SetUser = (uid, email, name, avatarSrc) => {
  return {
    type: 'SET_USER',
    uid,
    email,
    name,
    avatarSrc,
  };
};

export const SetFileIds = (fileIds) => {
  return {
    type: 'SET_FILE_IDS',
    fileIds,
  };
};

export const SetFileInfos = (fileInfos) => {
  return {
    type: 'SET_FILE_INFOS',
    fileInfos,
  };
};

export const SyncFromStroage = (snapshot) => {
  let sDate = '';
  let eDate = '';
  let monthAry = [];
  let preBalls = new Map();
  let actBalls = new Map();

  if (snapshot.child('updateBar').exists()) {
    sDate = snapshot.val().updateBar.sDate;
    eDate = snapshot.val().updateBar.eDate;
    monthAry = snapshot.val().updateBar.monthAry;
  }
  if (snapshot.child('updateBall').exists()) {
    preBalls = new Map(snapshot.val().updateBall.preBalls);
    actBalls = new Map(snapshot.val().updateBall.actBalls);
    nextBallId = preBalls.size;
  }
  return {
    type: 'SYNC',
    monthAry,
    sDate,
    eDate,
    actBalls,
    preBalls,
  };
};

/* fnFirebase START */

/**
 * Anonymous Sign in
 */
export const AnonymousLogin = (fnOnComplete) => {
  return (dispatch) => {
    _signInAnonymous().then((user)=>{
      console.log(`anonymous signin with uid: ${user.uid}`);
      dispatch(SetUser(user.uid, 'anonymous', 'anonymous', ''));
      return user.uid;
    })
    .then(_syncUser.bind(this))
    .then(LoadScheduleArray.bind(this, dispatch))
    .then(fnOnComplete)
    .catch(handleFirebaseError);
  };
};

const _signInAnonymous = () => {
  return firebase.auth().signInAnonymously();
};

/**
 * Google Sign in
 */
export const GoogleLogin = (fnOnComplete) => {

  return (dispatch) => {
    _signInWithGoogle().then(() => {
      const user = firebase.auth().currentUser;
      // This gives you a Google Access Token. You can use it to access the Google API.
      // var token = result.credential.accessToken;
      // P.S. result.user == firebase.auth().currentUser
      const userId = firebase.auth().currentUser.uid;
      const avatar = firebase.auth().currentUser.photoURL;
      const email = firebase.auth().currentUser.email;
      const displayName = firebase.auth().currentUser.displayName;
      console.log(`userId: ${userId}`);
      console.log(`avatar: ${avatar}`);
      console.log(`email: ${email}`);
      console.log(`displayName: ${displayName}`);

      dispatch(SetUser(userId, email, displayName, avatar));

      return firebase.auth().currentUser;
    })
    .then(_syncUser.bind(this))
    .then(LoadScheduleArray.bind(this, dispatch))
    .then(fnOnComplete)
    .catch(handleFirebaseError);
  };
};

const _signInWithProvider = (provider) => {
  return firebase.auth().signInWithPopup(provider);
};

const _signInWithGoogle = () => {
  return _signInWithProvider(new firebase.auth.GoogleAuthProvider(), firebase);
};

const _syncUser = () => {
  const user = firebase.auth().currentUser;

  return _checkUserExist(user)
  .then((flag) => {
    if (!flag) {
      return _addNewUser(user);
    }
    return null;
  });
};

const _checkUserExist = (user) => {
  return readFirebase(`/users/${user.uid}`)
  .then((snapshot) => {
    if (snapshot.exists()) {
      console.log(`user: ${user.uid} exist`);
      return true;
    }
    console.log(`user: ${user.uid} does not exist`);
    return false;
  });
};

const _addNewUser = (user) => {
  const postData = {
    name: user.displayName,
    email: user.email,
    timestamp: firebase.database.ServerValue.TIMESTAMP,
  };
  return updateFirebase(`/users/${user.uid}/`, postData);
};

export const LoadScheduleArray = (dispatch) => {
  const user = firebase.auth().currentUser;

  return getScheduleArray(user)
  .then((snapshot) => {
    // console.log(snapshot.val());
    const fileInfos = snapshot.exists() ? snapshot.val() : [];
    dispatch(SetFileInfos(fileInfos));
  });
}

const getScheduleArray = (user) => {
  // var userId = firebase.auth().currentUser.uid;
  return readFirebase(`/users/${user.uid}/files/`);
};

/* Sign in*/
export const SyncFromStroageEx = (selectFile, onComplete) => {
  return function (dispatch) {
    const sid = selectFile;
    return loadSchedule(sid).then(
      (snapshot) => {
        dispatch(SetSid(sid));
        dispatch(SyncFromStroage(snapshot));
        onComplete();
        return snapshot.val();
      }
    )
    .catch(handleFirebaseError);
  };
};

const loadSchedule = (selectFile) => {
  const user = firebase.auth().currentUser;

  return readFirebase(`/schedule/${user.uid}/${selectFile}/`);
};

const handleFirebaseError = (error) => {
  // Handle Errors here.
  const errorCode = error.code;
  const errorMessage = error.message;
  // The email of the user's account used.
  const email = error.email;
  // The firebase.auth.AuthCredential type that was used.
  const credential = error.credential;
  // ...
  console.error(`Firebase Failed- errorCode:${errorCode}, errorMessage:${errorMessage}`);
  // fnOnComplete();
};

const readFirebase = (path) => {
  console.log(`read firebase path: ${path}`);
  return firebase.database().ref(path).once('value').then(
    snapshot => snapshot,
  );
};

const updateFirebase = (path, payload) => {
  return firebase.database().ref(path).update(payload);
};
/* fnFirebase END */


export const DownloadImage = (svgRef) => {
  const svghtml = svgRef.outerHTML;
  const myImageSrc = `data:image/svg+xml;base64,${window.btoa(svghtml)}`;
  const image = new Image();
  image.src = myImageSrc;
  const canvas = document.createElement('canvas');
  canvas.setAttribute('width', '598px');
  canvas.setAttribute('height', '498px');
  const context = canvas.getContext('2d');

  image.onload = () => {
    context.drawImage(image, 0, 0);

    const canvasdata = canvas.toDataURL('image/png');
    const pngimg = new Image();
    pngimg.src = canvasdata;

    const a = document.createElement('a');
    a.download = 'sample.png';
    a.href = canvasdata;
    a.click();
  };
};
