
import React, { Component } from 'react';
import { connect } from 'react-redux';
// import moment from 'moment';

// import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
// import DatePicker from 'material-ui/DatePicker';
// import TextField from 'material-ui/TextField';
import injectTapEventPlugin from 'react-tap-event-plugin';

// import { UpdDate, CreateCanvas, SyncFromStroage } from '../actions/index';
import Wizard from './Wizard';

injectTapEventPlugin();

class Surface extends Component {

  constructor() {
    super();
    this.state = {
      openModal: true,
      openBtnClose: false,
    };
  }

  // componentDidMount() {}

  render() {
    const { openModal, openBtnClose } = this.state;

    return (
      <div id="surface" className="flex-center" style={this.getVisible(openModal)}>
        <div className="modal">
          <div className="wiz-header">
            <h2>Wizard</h2>
            <i className="fa fa-times"
              aria-hidden="true"
              style={this.getVisible(openBtnClose)}
              onClick={() => this.closeWindow()} />
          </div>
          <Wizard onComplete={this.closeWindow} />
        </div>
      </div>
    );
  }

  closeWindow = () => {
    this.setState({ openModal: false });
  }

  getVisible(state) {
    if (state) {
      return {};
    }
    return { display: 'none' };
  }


}

export default connect()(Surface);
