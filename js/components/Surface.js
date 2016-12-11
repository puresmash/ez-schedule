
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

class Surface extends React.Component {

    constructor(){
      super();
      this.state = {
          openModal: true,
          enableBtnClose: false
      };

    }
    componentDidMount(){
        this.props.dispatch(SetFireBase());
    }

    render(){
        let { openModal, openBtnClose } = this.state;

        return(
            <div id="surface" className="flex-center" style={this.getVisible(openModal)}>
              <div className="modal">
                  <div className="wiz-header">
                        <h2>Wizard</h2>
                        <i className="fa fa-times"
                           aria-hidden="true"
                           style={this.getVisible(openBtnClose)}
                           onClick={()=>this.closeWindow()}>
                        </i>
                  </div>
                  <Wizard onComplete={this.closeWindow}></Wizard>
              </div>
            </div>
        );
    }

    closeWindow = () => {
        this.setState({openModal: false});
    }

    getVisible(state){
        if(state)
            return {};
        return {display: 'none'};
    }


}

function mapStateToProps(state) {
  return {
    firebase: state.internalRef.firebase
  };
}

Surface = connect(mapStateToProps)(Surface);

export {Surface};
