
import React from 'react';
import {connect} from 'react-redux';
// Actions
import {UpdDate, CreateCanvas, AddActBall, UpdActBall, UpdPreBall} from './actions/index.js';
// Date String Validate
import StringUtils from './utils/Utils.js';

class Graph extends React.Component {
  constructor(){
    super();
    this.width = 600;
  }
  render(){
    let monthNum = 5;
    let {monthAry, preBalls, actBalls} = this.props;
    let title = this.getTitleList(monthAry);

    let preBallAry = this.getPreBallList(preBalls, monthAry);
    let actBallAry = this.getActBallList(actBalls, monthAry);
    let descAry = this.getDescList(preBalls);
    let width = 600;

    return(
      <svg width="500" height="500">
        <defs>
          <radialGradient id="blue" cx=".4" cy=".4" r=".6">
            <stop offset="0%" style={{stopColor: "#0066FF"}}></stop>
            <stop offset="60%" style={{stopColor: "#005CE6"}}></stop>
            <stop offset="80%" style={{stopColor: "#0047B3"}}></stop>
            <stop offset="100%" style={{stopColor: "#003380"}}></stop>
          </radialGradient>
          <radialGradient id="green" cx=".4" cy=".4" r=".6">
            <stop offset="0%" style={{stopColor: "#33CC33"}}></stop>
            <stop offset="60%" style={{stopColor: "#2EB82E"}}></stop>
            <stop offset="80%" style={{stopColor: "#248F24"}}></stop>
            <stop offset="100%" style={{stopColor: "#196619"}}></stop>
          </radialGradient>
        </defs>
        {title}
        <line x1="0" y1="135" x2={width} y2="135"></line>
        <line x1="0" y1="215" x2={width} y2="215"></line>
        {preBallAry}
        {actBallAry}

        {descAry}
      </svg>
    );
  }

  getDescList(preBalls=[]){
    let x = 30;
    let y= 275;

    let ary=[];
    for(let [key, value] of preBalls.entries()){
      console.log(`${key}, ${value}`);
      let text = `${value.sort}. ${value.desc}`;
      if(key!==0 && key%5 === 0){
        x += 100;
        y = 300;
      }
      else{
        y +=25;
      }
      ary.push(<text x={x} y={y}>{text}</text>);
    }
    return ary;
  }

  getPreBallList(preBalls=[], monthAry=[]){
    let ary = [];
    for(let [key, value] of preBalls.entries()){
      console.log(`${key}, ${value}`);
      let date = StringUtils.validDate(value.date);
      if(!date){
        continue;
      }

      let x = this._adjustBallCord(date, monthAry);
      ary.push(<BlueBall key={key} x={x} y={120}
        color={value.color} desc={value.desc} text={value.sort}/>);
    }
    return ary;
  }

  getActBallList(actBalls=[], monthAry=[]){
    let ary = [];

    for(let [key, value] of actBalls.entries()){
      console.log(`${key}, ${value}`);
      let date = StringUtils.validDate(value.date);
      if(!date){
        continue;
      }

      let x = this._adjustBallCord(date, monthAry);
      ary.push(<BlueBall key={key} x={x} y={200}
        color={value.color} desc={value.desc} text={value.sort}/>);
    }
    return ary;
  }

  _adjustBallCord(date, monthAry){
    let x = monthAry.findIndex(
      element => element.y === date.y && element.m === date.m
    );
    return x = (20 * x + (date.d/31) * 20 + 5) * this.scale
  }

  getTitleList(monthAry=[]){
    //store.dispatch({type: 'OnUpdDateS'})
    // let width = 600;
    let barWidth = 25;
    let ary = [];
    let scale = 0;
    if(monthAry.length == 1){
      this.scale = this.width / (monthAry.length * barWidth);
    }
    else{
      this.scale = this.width / ((monthAry.length-1) * (barWidth - 5) + barWidth);
    }

    // for(let [key, value] of monthAry.entries()){
    //   console.log(`${key}, ${value}`);
    //   let title = `t-${key}`
    //   ary.push(<MonthBar key={title} index={key} title={value.mstr} scale={this.scale}/>);
    // }
    monthAry.forEach((ele,index) => {
        console.log(ele);
        ary.push(<MonthBar index={index} title={ele} scale={this.scale}/>);
    });
    return ary;
  }

}

class BlueBall extends React.Component {
  constructor(){
      super();
  }
  render(){
    // Cut radius
    let x = this.props.x - 15;
    let trans = `translate(${x}, ${this.props.y})`;
    let text = this.props.text;
    return(
      <g className="ball" transform={trans}>
        <circle cx="15" cy="15" r="15" className={this.props.color}/>
        <text x="15" y="22">{text}</text>
      </g>
    );
  }
}

class MonthBar extends React.Component {
  constructor(){
    super();
    // this.propTypes = { x: React.PropTypes.number };
  }
  render(){
    //scale(5)
    let scale = this.props.scale;
    let x0 = scale*5;
    let x1 = scale*20;
    let x2 = scale*25;

    let transX = scale*20*this.props.index;
    let textX = scale*12.5;

    let trans = `translate(${transX}, 0)`;
    let title = this.props.title;
    //points="0,0 20,0 25,5 20,10 0,10 5,5"
    let points =`0,0 ${x1},0 ${x2},25 ${x1},50 0,50 ${x0},25`;

    let clipWidth = scale*15;

    return(
      <g id="month" className="month" transform={trans}>
        <defs>
          <clipPath id="textClip">
            <rect x={x0} y="0" width={clipWidth} height="50"/>
          </clipPath>
        </defs>

        <polygon points={points} fill="orange" stroke="white" stroke-width="1"/>

        <text className="clip-path" x={textX} y="32.5" clip-path="url(#textClip)">{title}</text>
      </g>
    );
  }
}

function mapStateToProps(state) {
  console.log(`calling mSTPs: monthAry=${state.monthAry}`);
  console.log(state);
  return {
    monthAry: state.updateBar.monthAry,
    actBalls: state.updateBall.actBalls,
    preBalls: state.updateBall.preBalls
  };
}

// class EditBox extends React.Component {
//   constructor(){
//     super();
//   }
//
//   render(){
//     let {actBalls} = this.props;
//     let ballPanel = this.getBallPanel(actBalls);
//     console.log('Rendering editbox');
//     return(
//       <div id="editbox">
//         <div>
//           <span>Start</span>
//           <input type="month" name="sDate" onChange={
//             (event) => this._handleChangeDateS(event)
//           }/>
//
//           <span>End</span>
//           <input type="month" name="eDate" onChange={
//             (event) => this._handleChangeDateE(event)
//           }/>
//
//           <button onClick={
//             (event) => this._createCanvas()
//           }>genCanvas</button>
//
//         </div>
//         {ballPanel}
//         <div onClick={
//           () => this._addBall()
//         }>
//           <span className="circle btn-plus" >+</span>
//         </div>
//       </div>
//     );
//   }
//
//   _createCanvas(){
//     this.props.dispatch(CreateCanvas());
//   }
//   _handleChangeDateS(event){
//     this.props.dispatch(UpdDate(event.target.value, 'start'));
//   }
//   _handleChangeDateE(event){
//     this.props.dispatch(UpdDate(event.target.value, 'end'));
//   }
//   _addBall(){
//     this.props.dispatch(AddActBall());
//   }
//   _updActBall(event, id){
//     id = id.a;
//     this.props.dispatch(UpdActBall(id, event.target.value));
//     console.log(`UpdActBall-id: ${id}`);
//     console.log(id);
//   }
//   _updPreBall(event, id){
//     id = id.b
//     this.props.dispatch(UpdPreBall(id, event.target.value));
//   }
//   getBallPanel(ballAry=[]){
//     let ary = [];
//     for(let [key, value] of ballAry.entries()){
//       console.log(`${key}, ${value}`);
//       let a = `act-${key}`;
//       let b = `pre-${key}`;
//       ary.push(
//       <div>
//         <span id={a} className="circle edit-ball">{value.sort}</span>
//         <input type="text" key={a} defaultValue="01/01"
//           onChange={ (event) => this._updActBall(event, {a})}/>
//
//         <span id={b} className="circle edit-ball">{value.sort}</span>
//         <input type="text" key={b} defaultValue="02/01"
//           onChange={ (event) => this._updPreBall(event, {b})}/>
//
//         <input type="text" defaultValue="kick start"/>
//       </div>
//       );
//     }
//     return ary;
//   }
// }

// EditBox.propTypes = {
//   sDate: React.PropTypes.instanceOf(Date),
//   eDate: React.PropTypes.instanceOf(Date)
// }

// EditBox = connect(mapStateToProps)(EditBox);
Graph = connect(mapStateToProps)(Graph);
// module.exports = BlueBall;
export { Graph };
