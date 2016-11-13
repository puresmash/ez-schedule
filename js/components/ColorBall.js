
import React from 'react';

const BALL_RADIUS = 15;

export default class ColorBall extends React.Component {

    constructor(){
        super();
    }

    render(){
        let {x, y, color} = this.props;
        x = x - BALL_RADIUS;
        let trans = `translate(${x}, ${this.props.y})`;
        let text = this.props.text;
        return(
            <g className="ball" transform={trans}>
                <circle cx="15" cy="15" r="15" className={color} fill={`url(#${color})`}/>
                <text x="15" y="22" fill="white" textAnchor="middle" fontSize="18px">{text}</text>
            </g>
        );
    }
}
