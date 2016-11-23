
import React from 'react';
import {connect} from 'react-redux';
import {UpdActBall, UpdPreBall, UpdDesc, UpdActBallColor, UpdPreBallColor} from '../actions/index.js'
import moment from 'moment';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import DatePicker from 'material-ui/DatePicker';
import ColorPicker from './ColorPicker.js';

class EditTimeline extends React.Component {
    static defaultProps = {
        autoOk: true,
        disableYearSelection: true
    };
    static propTypes = {
        autoOk: React.PropTypes.bool,
        disableYearSelection: React.PropTypes.bool,
    };
  constructor(props){
      super(props);
      this.state = {
          openActBallColorPicker: false,
          openPreBallColorPicker: false,
          preBallColor: props.pre.color? ColorPicker.Color[props.pre.color]:ColorPicker.Color['blue'],
          actBallColor: props.act.color? ColorPicker.Color[props.act.color]:ColorPicker.Color['blue'],
      }
  }
  componentWillMount(){
    console.log('EditTimeline will mount');
  }
  componentDidMount(){
    console.log('EditTimeline mounted');
    // console.log(ReactDOM.findDOMNode(this));
    // ReactDOM.findDOMNode().findDOMNode(`${a}`).datepicker();
  }
  componentWillReceiveProps(){
      console.log('EditTimeline receive props');
  }
  componentWillUpdate(){
      console.log('EditTimeline will update' + this.props.eDate);
  }
  render(){
    let {sort, act, pre, sDate, eDate} = this.props;
    let {openActBallColorPicker, openPreBallColorPicker, actBallColor, preBallColor} = this.state;
    return(
      <div className="edit-row edit-timeline">
        <div className="edit-detail" style={{marginBottom: '8px'}}>
            <ColorPicker open={openPreBallColorPicker} onClick={this.chgPreBallColor.bind(this)}></ColorPicker>
            <span
                id={pre.id}
                className="circle edit-ball"
                style={{backgroundColor: preBallColor}}
                onClick={this.togglePreBallColorPicker.bind(this)}
            >{sort}</span>
            <MuiThemeProvider>
                <DatePicker
                    className="datepicker-ball"
                    style={{display: 'inline'}}
                    onChange={(event, dateString) => this._updPreBall(event, dateString, pre.id)}
                    value={pre.date? moment(pre.date).toDate(): ''}
                    floatingLabelText="Insert Predict Date"
                    minDate={moment(sDate).toDate()}
                    maxDate={moment(eDate).toDate()}
                    autoOk={this.props.autoOk}
                    disableYearSelection={this.props.disableYearSelection}/>
            </MuiThemeProvider>
        </div>
        <div className="edit-detail" style={{marginBottom: '8px'}}>
            <ColorPicker open={openActBallColorPicker} onClick={this.chgActBallColor.bind(this)}></ColorPicker>
            <span
                id={act.id}
                className="circle edit-ball"
                style={{backgroundColor: actBallColor}}
                onClick={this.toggleActBallColorPicker.bind(this)}
            >{sort}</span>
            <MuiThemeProvider>
                <DatePicker
                    className="datepicker-ball"
                    style={{display: 'inline'}}
                    onChange={(event, dateString) => this._updActBall(event, dateString, act.id)}
                    value={act.date? moment(act.date).toDate(): ''}
                    floatingLabelText="Insert Actual Date"
                    minDate={moment(sDate).toDate()}
                    maxDate={moment(eDate).toDate()}
                    autoOk={this.props.autoOk}
                    disableYearSelection={this.props.disableYearSelection}/>
            </MuiThemeProvider>
        </div>
        <div className="edit-detail" style={{marginBottom: '8px'}}>
            <label className="edit-lbl">Desc</label>
            <input type="text" defaultValue="" placeholder="description"
              value={pre.desc}
              onChange={ (event) => this._updDesc(event, pre.id)}/>
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
    this.props.dispatch(UpdDesc(id, event.target.value));
  }
  chgActBallColor(color){
      let {act} = this.props;
      this.props.dispatch(UpdActBallColor(act.id, color));
      this.toggleActBallColorPicker();
      this.setState({actBallColor: ColorPicker.Color[color]})
  }
  chgPreBallColor(color){
      let {pre} = this.props;
      this.props.dispatch(UpdPreBallColor(pre.id, color));
      this.togglePreBallColorPicker();
      this.setState({preBallColor: ColorPicker.Color[color]})
  }
  togglePreBallColorPicker(){
      let {openPreBallColorPicker} = this.state;
      this.setState({openPreBallColorPicker: !openPreBallColorPicker});
  }
  toggleActBallColorPicker(){
      let {openActBallColorPicker} = this.state;
      this.setState({openActBallColorPicker: !openActBallColorPicker});
  }

}

function mapStateToProps(state) {
  const {actBalls, preBalls} = state.updateBall;
  return {
    actBalls,
    preBalls,
  };
}

export default connect(mapStateToProps)(EditTimeline)
