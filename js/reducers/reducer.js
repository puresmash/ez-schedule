import {combineReducers} from 'redux';

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
      let yearS = parseInt(sDate.substring(0, 4));
      let yearE = parseInt(eDate.substring(0, 4));
      let monthS = parseInt(sDate.substring(5, 7));
      let monthE = parseInt(eDate.substring(5, 7));

      let ary = [];


      for(let y=yearS, m=0, mB=0; y<=yearE; y++){
        if(y===yearS){
          m = monthS;
          console.log("sFlag==");
        }
        else {
          m = 1;
        }
        if(y===yearE){
          mB = monthE;
          console.log("eFlag==");
        }
        else{
          mB = 12;
        }

        for(; m<=mB; m++){
          ary.push({
            mstr: defMonth[m-1],
            y,
            m
          });
        }
      }

      console.log(`reducer: ${action.type} ${ary}`);
      // if(eDate.getDate() < sDate.getDate()){
      //   months--;
      // }
      return Object.assign({}, state, {
        monthAry: ary
      });

    default:
      return state;
  }
}

const defMonth = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

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
