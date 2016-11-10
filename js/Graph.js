
import React from 'react';
import {connect} from 'react-redux';
// Actions
import {UpdDate, CreateCanvas, AddActBall, UpdActBall, UpdPreBall} from './actions/index.js';
// Date String Validate
import StringUtils from './utils/Utils.js';
import MonthBar from './components/MonthBar.js'
import ColorBall from './components/ColorBall.js';

const CONVEX_LENGTH = 25;
const SCALABLE_BAR_WIDTH = 15;
const BALL_RADIUS = 15;

class Graph extends React.Component {
  constructor(){
    super();
    this.state = {
        width : screen.width,
    }
  }
  componentDidMount() {
        window.addEventListener("resize", this.updateDimensions.bind(this));
  }
  updateDimensions() {
        this.setState({width: window.innerWidth});
  }
  render(){
    let monthNum = 5;
    let {monthAry, preBalls, actBalls} = this.props;
    let title = this.getTitleList(monthAry);

    let preBallAry = this.getPreBallList(preBalls, monthAry);
    let actBallAry = this.getActBallList(actBalls, monthAry);
    let descAry = this.getDescList(preBalls);

    return(
        <div style={{backgroundColor: 'white', border: '1px solid gray'}}>
          <svg height="500px" width={this.state.width}>
            <defs>
                <radialGradient id="red" cx=".4" cy=".4" r=".6">
                  <stop offset="0%" style={{stopColor: "#FF0066"}}></stop>
                  <stop offset="60%" style={{stopColor: "#E6005C"}}></stop>
                  <stop offset="80%" style={{stopColor: "#B30047"}}></stop>
                  <stop offset="100%" style={{stopColor: "#800033"}}></stop>
                </radialGradient>
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
            <line x1="0" y1="135" x2={this.state.width} y2="135"></line>
            <line x1="0" y1="215" x2={this.state.width} y2="215"></line>
            {preBallAry}
            {actBallAry}

            {descAry}
          </svg>
      </div>
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
      ary.push(<ColorBall key={key} x={x} y={120}
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
      ary.push(<ColorBall key={key} x={x} y={200}
        color={value.color} desc={value.desc} text={value.sort}/>);
    }
    return ary;
  }

  _adjustBallCord(date, monthAry){

    let x = monthAry.findIndex(
      element => element.y === date.y && element.m === date.m
    );
    let translate = (SCALABLE_BAR_WIDTH * this.scale  + CONVEX_LENGTH) * x + CONVEX_LENGTH;
    let distance = ((date.d - 1) / monthAry[x].daysInMonth) * (SCALABLE_BAR_WIDTH * this.scale + CONVEX_LENGTH);

    return translate + distance;
  }

  getTitleList(monthAry=[]){
    // w-25(n+1)/sbw * n
    let scale = (this.state.width - CONVEX_LENGTH * (monthAry.length + 1)) / (SCALABLE_BAR_WIDTH * monthAry.length);
    this.scale = scale;

    let ary = [];
    for(let [key, value] of monthAry.entries()){
      console.log(`${key}, ${value}`);
      let title = `t-${key}`;
      ary.push(<MonthBar key={title} index={key} title={value.mstr} scale={this.scale}/>);
    }
    // monthAry.forEach((ele,index) => {
    //     console.log(ele);
    //     ary.push(<MonthBar index={index} title={ele} scale={this.scale}/>);
    // });
    return ary;
  }

}

function mapStateToProps(state) {
  console.log(`calling mSTPs: monthAry=${state.updateBar.monthAry}`);
  console.log(state);
  return {
    monthAry: state.updateBar.monthAry,
    actBalls: state.updateBall.actBalls,
    preBalls: state.updateBall.preBalls
  };
}

Graph = connect(mapStateToProps)(Graph);

export { Graph };
