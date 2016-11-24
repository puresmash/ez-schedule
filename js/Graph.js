
import React from 'react';
import {connect} from 'react-redux';
// Actions
import {RefSvg} from './actions/index.js';
// Date String Validate
import StringUtils from './utils/Utils.js';
import MonthBar from './components/MonthBar.js'
import ColorBall from './components/ColorBall.js';

const CONVEX_LENGTH = 25;
const SCALABLE_BAR_WIDTH = 15;
const BALL_RADIUS = 15;
const MAX_WIDTH = 600-2;

class Graph extends React.Component {
  constructor(){
    super();
    this.state = {
        width : screen.width,
        download: ''
    }
    console.log(navigator.userAgent);
    console.log(navigator.platform);

  }
  componentDidMount() {
        window.addEventListener("resize", this.updateDimensions.bind(this));
        this.props.dispatch(RefSvg(this.refs.canvas));
  }
  updateDimensions() {
        this.setState({width: window.innerWidth});
  }
  render(){
    let {width} = this.state;
    // this.width = (width>MAX_WIDTH)? MAX_WIDTH : width;
    this.width = MAX_WIDTH - 2;

    let {monthAry, preBalls, actBalls} = this.props;
    let title = this.getTitleList(monthAry);

    let preBallAry = this.getPreBallList(preBalls, monthAry);
    let actBallAry = this.getActBallList(actBalls, monthAry);
    let descAry = this.getDescList(preBalls);


    return(
        <div style={{backgroundColor: 'white', border: '1px solid gray',
                    borderRadius: '5px', marginTop: '8px', marginLeft: 'auto', marginRight: 'auto',
                    boxSizing: 'border-box', maxWidth: '600px', width: width, overflowX: 'scroll'}}>
          <svg xmlns="http://www.w3.org/2000/svg" ref="canvas" height="500px" width={this.width}>
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
            <text x={CONVEX_LENGTH} y="100" style={{fill: 'lightslategray'}}>Predict Schedule</text>
            <line x1={CONVEX_LENGTH} y1="135" x2={this.width} y2="135" stroke="gray" strokeWidth="8px"></line>
            <text x={CONVEX_LENGTH} y="180" style={{fill: 'lightslategray'}}>Actual Schedule</text>
            <line x1={CONVEX_LENGTH} y1="215" x2={this.width} y2="215" stroke="gray" strokeWidth="8px"></line>
            {preBallAry}
            {actBallAry}

            {descAry}
          </svg>
      </div>
    );
  }

  getDescList(preBalls=[]){
    let x = CONVEX_LENGTH;
    let y= 275;

    let ary=[];

    preBalls.forEach((value, key)=>{
        let text = `${value.sort}. ${value.desc}`;
        if(value.sort!==0 && value.sort%6 === 0){
          x += 225;
          y = 300;
        }
        else{
          y +=25;
        }
        ary.push(<text x={x} y={y}>{text}</text>);
    })

    return ary;
  }

  getPreBallList(preBalls=[], monthAry=[]){
    let ary = [];

    preBalls.forEach((value, key)=>{
        let date = StringUtils.validDate(value.date);
        if(!date){
            return;
        }
        let x = this._adjustBallCord(date, monthAry);
        ary.push(<ColorBall key={key} x={x} y={120}
        color={value.color} desc={value.desc} text={value.sort}/>);
    });

    return ary;
  }

  getActBallList(actBalls=[], monthAry=[]){
    let ary = [];

    actBalls.forEach((value, key)=>{
        let date = StringUtils.validDate(value.date);
        if(!date){
            return;
        }
        let x = this._adjustBallCord(date, monthAry);
        ary.push(<ColorBall key={key} x={x} y={200}
        color={value.color} desc={value.desc} text={value.sort}/>);
    });

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
    let scale = (this.width - CONVEX_LENGTH * (monthAry.length + 1)) / (SCALABLE_BAR_WIDTH * monthAry.length);
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
