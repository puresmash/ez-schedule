
import React from 'react';

export default class MonthBar extends React.Component {
  constructor(){
    super();
  }
  render(){
    const CONVEX_LENGTH = 25;
    const SCALABLE_BAR_WIDTH = 15;
    //scale(5)
    let { scale, index } = this.props;
    // let x0 = scale*5;
    let x0 = CONVEX_LENGTH;
    // let x1 = scale*20;
    let x1 = scale * SCALABLE_BAR_WIDTH + CONVEX_LENGTH;
    // let x2 = scale*25;
    let x2 = scale * SCALABLE_BAR_WIDTH + CONVEX_LENGTH * 2;

    // let transX = (scale * 20) * index;
    let transX = (scale * SCALABLE_BAR_WIDTH + CONVEX_LENGTH) * index;
    // let textX = scale * 12.5;
    let textX = scale * 7.5 + CONVEX_LENGTH;

    let trans = `translate(${transX}, 0)`;
    let title = this.props.title;
    //points="0,0 20,0 25,5 20,10 0,10 5,5"
    let points =`0,0 ${x1},0 ${x2},25 ${x1},50 0,50 ${x0},25`;

    let clipWidth = scale * SCALABLE_BAR_WIDTH;

    return(
      <g id="month" className="month" transform={trans}>
        <defs>
          <clipPath id="textClip">
            <rect x={x0} y="0" width={clipWidth} height="50"/>
          </clipPath>
        </defs>

        <polygon points={points} fill="orange" stroke="white" strokeWidth="1"/>

        <text className="clip-path" x={textX} y="32.5" clipPath="url(#textClip)">{title}</text>
      </g>
    );
  }
}
