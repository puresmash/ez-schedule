import {combineReducers} from 'redux';
import moment from 'moment';

function updateBall(state={actBalls: [], preBalls: []}, action){
  switch (action.type) {
    case 'UPD_ACT_BALL':
      //
      return Object.assign({}, state, {
        actBalls: state.actBalls.map((actBall, index) => {
          // console.log("UPD BALL=====");
          // console.log(actBall);
          // console.log(index);
          // console.log(action.id);
          // console.log(action.date);
          if(actBall.id===action.id){
            return Object.assign({}, actBall, {
              date: action.date
            });
          }
          //return if id not found
          return actBall;
        })
      });
    // case 'UPD_PRE_BALL':
    //   return Object.assign({}, state, {
    //     preBalls: state.preBalls.map((preBall, index) => {
    //       if(preBall.id===action.id){
    //         return Object.assign({}, preBall, {
    //           date: action.date
    //         })
    //       }
    //       //return if id not found
    //       return preBall;
    //     })
    //   })
    case 'UPD_PRE_BALL':
       let {preBalls} = state;
       preBalls = preBalls.map(p => {
         if(p.id === action.id)
           return Object.assign({}, p, { date: action.date })
         return preBall
       })
    return Object.assign({}, state, { preBalls })

    case 'UPD_DESC':

      return Object.assign({}, state, {
        preBalls: state.preBalls.map((preBall, index) => {
          if(preBall.id===action.id){
            return Object.assign({}, preBall, {
              desc: action.desc
            })
          }
          return preBall;
        })
      });

    case 'ADD_BALL':
      console.log(`reducer: ${action.type} ${action.id}`);
      return Object.assign({}, state, {
        actBalls: [
          ...state.actBalls,
          {
            id: `act-${action.id}`,
            sort: action.id,
            color: action.color
          }
        ],
        preBalls: [
          ...state.preBalls,
          {
            id: `pre-${action.id}`,
            sort: action.id,
            color: action.color,
            desc: ''
          }
        ]
      });
    default:
      return state;
  }
}

function updateBar(state={}, action){
  switch(action.type){
    case 'UPD_DATE':
      console.log(`reducer: ${action.type} ${action.data}`);
      if(action.option == 'start'){
        return Object.assign({}, state, {
          sDate: action.data
        });
      }
      else{
        return Object.assign({}, state, {
          eDate: action.data
        });
      }
    case 'UPD_BAR':
      const {sDate, eDate} = state;

      if(!sDate || !eDate || eDate<sDate){
        return state;
      }

      let diff = moment(eDate, 'YYYY-MM').diff(moment(sDate, 'YYYY-MM'),'months');
      console.log(diff);
      if(diff<0){
          console.error('invalid month range(<0)');
          return;
      }
      let ary = [];
      for(let i=0; i<=diff; i++){
          let date = moment(sDate, 'YYYY-MM').add(i, 'M');
          ary.push({
              mstr: date.format('MMM'),
              y: parseInt(date.format('YYYY')),
              m: parseInt(date.format('MM'))
          });
      }

      console.log(`reducer: ${action.type} ${ary}`);

      return Object.assign({}, state, {
        monthAry: ary
      });

    default:
      return state;
  }
}

/*
{
    sDate,
    eDate,
    actBalls[],
    preBalls[],
    monthBar[]
}
*/

const svgApp = combineReducers({
  updateBall,
  updateBar
})

export default svgApp;
