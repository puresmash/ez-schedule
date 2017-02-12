
import React, { PropTypes } from 'react';

const BALL_RADIUS = 15;

const ColorBall = ({ x, y, color, text }) => {
  const trans = `translate(${x - BALL_RADIUS}, ${y})`;
  return (
    <g className="ball" transform={trans}>
      <circle cx="15" cy="15" r="15" className={color} fill={`url(#${color})`} />
      <text x="15" y="22" fill="white" textAnchor="middle" fontSize="18px">{text}</text>
    </g>
  );
};

ColorBall.propTypes = {
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  color: PropTypes.string.isRequired,
  text: PropTypes.number.isRequired,
};

export default ColorBall;
