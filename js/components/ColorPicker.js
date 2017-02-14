
import React, { Component, PropTypes } from 'react';

export default class ColorPicker extends Component {

  static Color = {
    RED: '#ff6782',
    GREEN: '#00f5a3',
    BLUE: '#0088ff',
  };

  static propTypes = {
    open: PropTypes.bool.isRequired,
    onClick: PropTypes.func.isRequired,
  };

  render() {
    const { open, onClick } = this.props;
    // const visibility = open ? 'visible' : 'hidden';
    // const zIndex = open ? 2 : -1;
    const width = open ? '100%' : '0px';
    return (
      <div className="colorpicker" style={{ width }}>
        <button className="brick" style={{ backgroundColor: ColorPicker.Color.RED }}
          onClick={() => {
            console.log(onClick);
            onClick('red');
          }} />
        <button className="brick" style={{ backgroundColor: ColorPicker.Color.GREEN }}
          onClick={() => {
            onClick('green');
          }} />
        <button className="brick" style={{ backgroundColor: ColorPicker.Color.BLUE }}
          onClick={() => {
            onClick('blue');
          }} />
      </div>
    );
  }

}
