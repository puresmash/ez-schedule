
import React from 'react';
import {connect} from 'react-redux';
import {UpdDate, CreateCanvas, SetFireBase, SyncFromStroage} from '../actions/index.js';
import Wizard from './Wizard.js';
import moment from 'moment';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import DatePicker from 'material-ui/DatePicker';
import TextField from 'material-ui/TextField';
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();
// import MyDialog from './Window.js'

const MAX_MONTH = 6;
const MIN_MONTH = -3;

class Surface extends React.Component {

    constructor(){
      super();
      this.state = {
          closeComponent: false,
      };

    }
    componentDidMount(){
        this.props.dispatch(SetFireBase());
    }

    render(){
       let {sDate, eDate} = this.props;
       let { step } = this.state;
    //   let wizard = this.getWizard(sDate, eDate);

      return(
        //   <MyDialog></MyDialog>
        <div id="surface" className="flex-center" style={this.getVisWindow()}>
          <div className="window">
              <div className="state">
                    <h2>Wizard</h2>
                    <i className="fa fa-times" aria-hidden="true" onClick={
                        ()=>this.closeWindow()
                    }></i>
              </div>
              <Wizard></Wizard>
          </div>
        </div>
      );
    }


    // _handleChangeDateS(){
    //   let sDate = ReactDOM.findDOMNode(this.refs.sDate).value;
    //   console.log(`change sDate by wizard: ${sDate}`);
    //   this.props.dispatch(UpdDate(sDate, 'start'));
    // }
    // _handleChangeDateE(){
    //     let eDate = ReactDOM.findDOMNode(this.refs.eDate).value;
    //     console.log(`change eDate by wizard: ${eDate}`);
    //     this.props.dispatch(UpdDate(eDate, 'end'));
    // }

    closeWindow(){
        this.setState({closeComponent: true});
    }

    getVisWindow(){
        if(this.state.closeComponent)
            return {display: 'none'};
        return {};
    }


}

function mapStateToProps(state) {
  const {sDate, eDate} = state.updateBar;
  console.log(`calling mSTPs: sDate=${sDate}, eDate=${eDate}`);
  console.log(state);
  return {
    sDate,
    eDate,
    firebase: state.internalRef.firebase
  };
}

Surface = connect(mapStateToProps)(Surface);

export {Surface};
