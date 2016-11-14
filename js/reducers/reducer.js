import {combineReducers} from 'redux';
import moment from 'moment';

function updateBall(state={actBalls: new Map(), preBalls: new Map()}, action){
  switch (action.type) {
    case 'UPD_ACT_BALL': {
        let { actBalls } = state;
        actBalls = new Map(actBalls);

        let ball = actBalls.get(action.id);
        ball.date = action.date;

        return Object.assign({}, state, {actBalls});
    }
    case 'UPD_PRE_BALL': {
        let { preBalls } = state;
        preBalls = new Map(preBalls);

        let ball = preBalls.get(action.id);
        ball.date = action.date;

        return Object.assign({}, state, {preBalls});
    }
    case 'UPD_DESC': {
        let { preBalls } = state;
        preBalls = new Map(preBalls);

        let ball = preBalls.get(action.id);
        ball.desc = action.desc;

        return Object.assign({}, state, {preBalls});
    }
    case 'UPD_ACT_BALL_COLOR': {
        console.log(`reducer: ${action.type} ${action.id} ${action.color}`);
        console.log(action.color);
        let { actBalls } = state;
        actBalls = new Map(actBalls);

        let ball = actBalls.get(action.id);
        ball.color = action.color;

        return Object.assign({}, state, {actBalls});
    }
    case 'UPD_PRE_BALL_COLOR':{
        let { preBalls } = state;
        preBalls = new Map(preBalls);

        let ball = preBalls.get(action.id);
        ball.color = action.color;

        return Object.assign({}, state, {preBalls});
    }
    case 'ADD_BALL': {
        console.log(`reducer: ${action.type} ${action.id}`);

        let { actBalls, preBalls } = state;
        actBalls = new Map(actBalls);
        preBalls = new Map(preBalls);

        actBalls.set(`act-${action.id}`, {
            id: `act-${action.id}`,
            sort: action.id,
            color: action.color
        });

        preBalls.set(`pre-${action.id}`, {
            id: `pre-${action.id}`,
            sort: action.id,
            color: action.color
        });

        return Object.assign({}, state, {
            actBalls,
            preBalls
        });
    }
    case 'SYNC': {
        let { actBalls, preBalls } = state;
        return Object.assign({}, state, {
            actBalls: action.actBalls,
            preBalls: action.preBalls
        });
    }

    default:
      return state;
  }
}
function updateBar(state = {monthAry:[], sDate:'', eDate:''}, action) {
    switch (action.type) {
        case 'UPD_DATE': {
            console.log(`reducer: ${action.type} ${action.data}`);
            if (action.option == 'start') {
                return Object.assign({}, state, {
                    sDate: action.data
                });
            } else {
                return Object.assign({}, state, {
                    eDate: action.data
                });
            }
        }
        case 'UPD_BAR': {
            const { sDate, eDate } = state;

            if (!sDate || !eDate || eDate < sDate) {
                return state;
            }

            let diff = moment(eDate, 'YYYY-MM-DD').diff(moment(sDate, 'YYYY-MM-DD'), 'months');
            console.log(diff);
            if (diff < 0) {
                console.error('invalid month range(<0)');
                return;
            }
            let ary = [];
            for (let i = 0; i <= diff; i++) {
                let date = moment(sDate, 'YYYY-MM-DD').add(i, 'M');
                let daysInMonth = date.daysInMonth();
                ary.push({
                    mstr: date.format('MMM'),
                    y: parseInt(date.format('YYYY')),
                    m: parseInt(date.format('MM')),
                    daysInMonth
                });
            }

            console.log(`reducer: ${action.type} ${ary}`);

            return Object.assign({}, state, {
                monthAry: ary
            });
        }
        case 'SYNC': {
            const { sDate, eDate, monthAry } = state;

            return Object.assign({}, state, {
                sDate: action.sDate,
                eDate: action.eDate,
                monthAry: action.monthAry
            });
        }
        default:
            return state;
    }
}
function internalRef(state={svgRef: {}, userAgent:{}, uid:''}, action){
    switch(action.type){
        case 'REF_SVG': {
            return Object.assign({}, state, {
                svgRef: action.ref
            });
        }
        case 'SET_UA': {
            return Object.assign({}, state, {
                userAgent: action.userAgent
            });
        }
        case 'SET_UID': {
            return Object.assign({}, state, {
                uid: action.uid
            });
        }
        case 'SET_FB':{
            return Object.assign({}, state, {
                firebase: action.firebase
            })
        }

        default:
            return state;
    }
}
/*
{
    sDate,
    eDate,
    actBalls: new Map(),
    preBalls: new Map(),
    monthBar[]
}
*/

const svgApp = combineReducers({
  updateBall,
  updateBar,
  internalRef
})

export default svgApp;
