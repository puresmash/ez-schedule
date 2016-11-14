
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

export const SetUid = (uid) => {
    return {
        type: 'SET_UID',
        uid
    }
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

export const SyncFromStroage = (monthAry, sDate, eDate, actBalls, preBalls) => {
    return {
        type: 'SYNC',
        monthAry,
        sDate,
        eDate,
        actBalls,
        preBalls
    }
}
