
import React from 'react';
import {connect} from 'react-redux';
import {UpdActBall, UpdPreBall, UpdDesc} from '../actions/index.js'
import moment from 'moment';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import DatePicker from 'material-ui/DatePicker';

class EditRow extends React.Component {
    static defaultProps = {
        autoOk: true,
        disableYearSelection: true,
    };
    static propTypes = {
        autoOk: React.PropTypes.bool,
        disableYearSelection: React.PropTypes.bool,
    };
  constructor(props){
      super(props);
  }
  componentWillMount(){
    console.log('EditRow will mount');
  }
  componentDidMount(){
    console.log('EditRow mounted');
    // console.log(ReactDOM.findDOMNode(this));
    // ReactDOM.findDOMNode().findDOMNode(`${a}`).datepicker();
  }
  componentWillReceiveProps(){
      console.log('EditRow receive props');
  }
  componentWillUpdate(){
      console.log('EditRow will update' + this.props.eDate);
  }
  render(){
    let {sort, a, b, sDate, eDate} = this.props;
    return(
      <div className="edit-row ball-panel">
        <div className="edit-row-detail" style={{marginBottom: '8px'}}>
            <span id={a} className="circle edit-ball">{sort}</span>
            <MuiThemeProvider>
                <DatePicker
                    className="datepicker-ball"
                    style={{display: 'inline'}}
                    onChange={(event, dateString) => this._updActBall(event, dateString, a)}
                    floatingLabelText="Insert Actual Date"
                    minDate={moment(sDate).toDate()}
                    maxDate={moment(eDate).toDate()}
                    autoOk={this.props.autoOk}
                    disableYearSelection={this.props.disableYearSelection}/>
            </MuiThemeProvider>
        </div>
        <div className="edit-row-detail" style={{marginBottom: '8px'}}>
            <span id={b} className="circle edit-ball">{sort}</span>
            <MuiThemeProvider>
                <DatePicker
                    className="datepicker-ball"
                    style={{display: 'inline'}}
                    onChange={(event, dateString) => this._updPreBall(event, dateString, b)}
                    floatingLabelText="Insert Predict Date"
                    minDate={moment(sDate).toDate()}
                    maxDate={moment(eDate).toDate()}
                    autoOk={this.props.autoOk}
                    disableYearSelection={this.props.disableYearSelection}/>
            </MuiThemeProvider>
        </div>
        <div className="edit-row-detail" style={{marginBottom: '8px'}}>
            <label className="edit-lbl">Desc</label>
            <input type="text" defaultValue="" placeholder="description"
              onChange={ (event) => this._updDesc(event, {b})}/>
        </div>
      </div>
    );
  }
  _updActBall(event, dateString, id){
    this.props.dispatch(UpdActBall(id, moment(dateString).format('MM/DD/YYYY')));
    console.log(`UpdActBall-id: ${id}, dateString: ${dateString}`);
  }
  // _updActBall(event, id){
  //   id = id.a;
  //   this.props.dispatch(UpdActBall(id, event.target.value));
  //   console.log(`UpdActBall-id: ${id}`);
  //   console.log(id);
  // }
  _updPreBall(event, dateString, id){
    this.props.dispatch(UpdPreBall(id, moment(dateString).format('MM/DD/YYYY')));
    console.log(`UpdPreBall-id: ${id}, dateString: ${dateString}`);
  }
  // _updPreBall(event, id){
  //   id = id.b;
  //   this.props.dispatch(UpdPreBall(id, event.target.value));
  // }
  _updDesc(event, id){
    id = id.b;
    this.props.dispatch(UpdDesc(id, event.target.value));
  }

}

// function mapStateToProps(state) {
//   const {sDate, eDate} = state.updateBar;
//   console.log(`calling mSTPs in EditRow: sDate=${sDate}, eDate=${eDate}`);
//   return {
//     sDate,
//     eDate
//   };
// }

export default connect()(EditRow)
