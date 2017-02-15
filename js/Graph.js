// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
// Types
import Ball from './types/Ball';
import Bar from './types/Bar';
// Actions
import { RefSvg, DownloadImage } from './actions/index';
// Date String Validate
import StringUtils from './utils/Utils';
import MonthBar from './components/MonthBar';
import ColorBall from './components/ColorBall';

const CONVEX_LENGTH = 25;
const SCALABLE_BAR_WIDTH = 15;
// const BALL_RADIUS = 15;
const MAX_WIDTH = 600 - 2;

class Graph extends Component {

  scale: number;
  width: number;
  getPreBallList: () => Component;
  getActBallList: () => Component;
  getDescList: () => Element;

  props: {
    preBalls: Array<Ball>,
    actBalls: Array<Ball>,
    monthAry: Array<Bar>,
    svgRef: Element,
    dispatch: () => void,
  }

  state: {
    width: number,
  }

  static defaultProps = {
    preBalls: [],
    actBalls: [],
  };

  constructor() {
    super();
    this.state = {
      width: screen.width,
      download: '',
    };
    console.log(navigator.userAgent);
    console.log(navigator.platform);
  }

  componentDidMount() {
    window.addEventListener('resize', this.updateDimensions.bind(this));
    this.props.dispatch(RefSvg(this.refs.canvas));
  }

  updateDimensions() {
    this.setState({ width: window.innerWidth });
  }
  render() {
    const { width } = this.state;
    const { monthAry, preBalls, actBalls, dispatch, svgRef } = this.props;
    this.width = MAX_WIDTH - 2;
    const title = this.getTitleList(monthAry);
    const preBallAry = this.getPreBallList(preBalls, monthAry);
    const actBallAry = this.getActBallList(actBalls, monthAry);
    const descAry = this.getDescList(preBalls);

    return (
      <div id="graph">
        <div className="graph-wrapper" style={{ width }}>
          <div className="graph-header">
            <div className="graph-action"
              onClick={() => {
                dispatch(DownloadImage(svgRef));
              }}>
              <i className="fa fa-floppy-o" />
            </div>
          </div>
          <svg xmlns="http://www.w3.org/2000/svg" ref="canvas" height="500px" width={this.width}>
            <defs>
              <radialGradient id="red" cx=".4" cy=".4" r=".6">
                <stop offset="0%" style={{ stopColor: '#FF0066' }} />
                <stop offset="60%" style={{ stopColor: '#E6005C' }} />
                <stop offset="80%" style={{ stopColor: '#B30047' }} />
                <stop offset="100%" style={{ stopColor: '#800033' }} />
              </radialGradient>
              <radialGradient id="blue" cx=".4" cy=".4" r=".6">
                <stop offset="0%" style={{ stopColor: '#0066FF' }} />
                <stop offset="60%" style={{ stopColor: '#005CE6' }} />
                <stop offset="80%" style={{ stopColor: '#0047B3' }} />
                <stop offset="100%" style={{ stopColor: '#003380' }} />
              </radialGradient>
              <radialGradient id="green" cx=".4" cy=".4" r=".6">
                <stop offset="0%" style={{ stopColor: '#33CC33' }} />
                <stop offset="60%" style={{ stopColor: '#2EB82E' }} />
                <stop offset="80%" style={{ stopColor: '#248F24' }} />
                <stop offset="100%" style={{ stopColor: '#196619' }} />
              </radialGradient>
            </defs>
            {title}
            <text x={CONVEX_LENGTH} y="100" style={{ fill: 'lightslategray' }}>Predict Schedule</text>
            <line x1={CONVEX_LENGTH} y1="135" x2={this.width} y2="135" stroke="gray" strokeWidth="8px" />
            <text x={CONVEX_LENGTH} y="180" style={{ fill: 'lightslategray' }}>Actual Schedule</text>
            <line x1={CONVEX_LENGTH} y1="215" x2={this.width} y2="215" stroke="gray" strokeWidth="8px" />
            {preBallAry}
            {actBallAry}

            {descAry}
          </svg>
        </div>
      </div>
    );
  }

  getDescList(preBalls = []) {
    let x = CONVEX_LENGTH;
    let y = 275;

    const ary = [];

    preBalls.forEach((value) => {
      const text = `${value.sort}. ${value.desc}`;
      if (value.sort !== 0 && value.sort % 6 === 0) {
        x += 225;
        y = 300;
      } else {
        y += 25;
      }
      ary.push(<text x={x} y={y}>{text}</text>);
    });

    return ary;
  }

  getPreBallList(preBalls = [], monthAry = []) {
    const ary = [];

    preBalls.forEach((value, key) => {
      const date = StringUtils.validDate(value.date);
      if (!date) {
        return;
      }
      const x = this.adjustBallCord(date, monthAry);
      ary.push(<ColorBall key={key} x={x} y={120}
        color={value.color} desc={value.desc} text={value.sort} />);
    });

    return ary;
  }

  getActBallList(actBalls = [], monthAry = []) {
    const ary = [];

    actBalls.forEach((value, key) => {
      const date = StringUtils.validDate(value.date);
      if (!date) {
        return;
      }
      const x = this.adjustBallCord(date, monthAry);
      ary.push(<ColorBall key={key} x={x} y={200}
        color={value.color} desc={value.desc} text={value.sort} />);
    });

    return ary;
  }

  adjustBallCord(date, monthAry) {
    const x = monthAry.findIndex(
      element => element.y === date.y && element.m === date.m,
    );
    const translate = (x * (SCALABLE_BAR_WIDTH * this.scale)) + ((x + 1) * CONVEX_LENGTH);
    const distance = ((date.d - 1) / monthAry[x].daysInMonth)
                        * ((SCALABLE_BAR_WIDTH * this.scale) + CONVEX_LENGTH);

    return translate + distance;
  }

  getTitleList(monthAry = []) {
    // w-25(n+1)/sbw * n
    const scale = (this.width - (CONVEX_LENGTH * (monthAry.length + 1)))
                    / (SCALABLE_BAR_WIDTH * monthAry.length);
    this.scale = scale;

    const ary = monthAry.map((ele, index) => {
      const title = `t-${index}`;
      return <MonthBar key={title} index={index} title={ele.mstr} scale={this.scale} />;
    });
    // for (const [key, value] of monthAry.entries())

    return ary;
  }

}

function mapStateToProps(state) {
  return {
    monthAry: state.updateBar.monthAry,
    actBalls: state.updateBall.actBalls,
    preBalls: state.updateBall.preBalls,
    svgRef: state.internalRef.svgRef,
  };
}

export default connect(mapStateToProps)(Graph);
