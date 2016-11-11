
import React from 'react';
// import {UpdActBallColor, UpdPreBallColor} from '../actions/index.js'

export default class ColorPicker extends React.Component {

    static Color = {
        red: '#ff6782',
        green: '#00f5a3',
        blue: '#0088ff'
    };

    static defaultProps = {
        color: 'blue'
    };
    static propTypes = {
        open: React.PropTypes.bool.isRequired,
        color: React.PropTypes.string,
        onClick: React.PropTypes.func.isRequired,
    };

    constructor(props){
        super(props)
    }

    render(){
        let {open, onClick} = this.props;
        let visibility = open? 'visible': 'hidden';
        let zIndex = open? 2: -1;
        let width = open? '100%':'0px';
        return(
            <div className="colorpicker" style={{width: width}}>
                <div className="brick" style={{backgroundColor: ColorPicker.Color['red']}} onClick={()=>{
                    console.log(onClick);
                    onClick('red');
                }}></div>
                <div className="brick" style={{backgroundColor: ColorPicker.Color['green']}} onClick={()=>{
                    onClick('green');
                }}></div>
                <div className="brick" style={{backgroundColor: ColorPicker.Color['blue']}} onClick={()=>{
                    onClick('blue');
                }}></div>
            </div>
        );

    }

}
