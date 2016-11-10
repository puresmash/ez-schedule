
import React from 'react';
import {connect} from 'react-redux';
import {UpdDate, CreateCanvas, AddBall, UpdActBall, UpdPreBall, UpdDesc} from './actions/index.js'
import Calendar from './components/Calendar.js'
import moment from 'moment';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import DatePicker from 'material-ui/DatePicker';
import injectTapEventPlugin from 'react-tap-event-plugin';

const MAX_MONTH = 6;
const MIN_MONTH = -3;

class EditBox extends React.Component {

  static defaultProps = {
    sDate: '',
    eDate: '',
    visible : false,
  };
  static propTypes = {
        visible: React.PropTypes.bool,
  };

  constructor(props){
    super(props);
    let visibleFlag = props.visible || EditBox.defaultProps.visible;
    this.state = {
        open: true,
        autoOk: true,
        disableYearSelection: true,
        visibleFlag
    }
  }

  render(){
    let {sDate, eDate, actBalls} = this.props;
    let {visibleFlag} = this.state;
    let ballPanel = this.getBallPanel(actBalls, visibleFlag);
    console.log('Rendering editbox');
    return(
      <div id="editbox" className="editbox">
        <MuiThemeProvider>
        <AppBar
          title="Paint Schedule"
          iconElementLeft={
              <i
                className="fa fa-bars"
                aria-hidden="true"
                style={{lineHeight: '46px', paddingLeft: '6px',
                        paddingRight: '6px', fontSize: '20px', color: 'white'}}
                onClick={
                  () => this.toggleVisible()
              }>
              </i>
          }
          iconClassNameRight="muidocs-icon-navigation-expand-more"
          style={{zIndex: '0'}}
        />
        </MuiThemeProvider>
        {/* <div style={{fontSize: '3em', display: 'flex', justifyContent: 'flex-end'}}>
            <i className="fa fa-minus-square-o" aria-hidden="true" onClick={
                () => this.toggleVisible()
            }>
            </i>
        </div> */}
        <div id="container" style={{visibility: this.getVisible(visibleFlag)}}>
            <div className="edit-row edit-date">
                <div>
                    <div className="edit-row-detail" style={{marginBottom: '8px'}}>
                        <label className="edit-lbl">Start</label>
                        <MuiThemeProvider>
                          <DatePicker
                              className="datepicker-bar"
                              onChange={this._handleChangeDateS.bind(this)}
                              shouldDisableDate={(date)=>{return date.getDate() != 1}}
                              value={sDate? moment(sDate).toDate(): ''}
                              hintText="Insert Start Date"
                              minDate={moment().add(MIN_MONTH, 'M').toDate()}
                              maxDate={moment().add(MAX_MONTH, 'M').toDate()}
                              autoOk={this.state.autoOk}
                              disableYearSelection={this.state.disableYearSelection}/>
                        </MuiThemeProvider>
                        {/* <Calendar onChange={this._handleChangeDateS.bind(this)} placeholder={'Insert Start Date'}
                                  maxDate={moment().add(MAX_MONTH, 'M').format('YYYY-MM')}
                                  minDate={moment().add(MIN_MONTH, 'M').format('YYYY-MM')}
                                  value={sDate} clearIcon={visibleFlag}></Calendar> */}
                    </div>
                    <div className="edit-row-detail" style={{marginBottom: '8px'}}>
                        <label className="edit-lbl">End</label>
                        <MuiThemeProvider>
                          <DatePicker
                              className="datepicker-bar"
                              onChange={this._handleChangeDateE.bind(this)}
                              shouldDisableDate={(date)=>{
                                  return date.getDate() != moment(date).daysInMonth()
                              }}
                              value={eDate? moment(eDate).toDate(): ''}
                              hintText="Insert End Date"
                              minDate={moment().add(MIN_MONTH, 'M').toDate()}
                              maxDate={moment().add(MAX_MONTH, 'M').toDate()}
                              autoOk={this.state.autoOk}
                              disableYearSelection={this.state.disableYearSelection}/>
                        </MuiThemeProvider>
                        {/* <Calendar onChange={this._handleChangeDateE.bind(this)} placeholder={'Insert End Date'}
                                  maxDate={moment().add(MAX_MONTH, 'M').format('YYYY-MM')}
                                  minDate={moment().add(MIN_MONTH, 'M').format('YYYY-MM')}
                                  value={eDate} clearIcon={visibleFlag}></Calendar> */}
                    </div>
                </div>

                <div style={{display: 'inline-flex',alignItems: 'center'}}>
                    <div className="btn-canvas" onClick={
                        (event) => this._createCanvas()
                    }>
                        <i className="fa fa-repeat" aria-hidden="true"></i>
                    </div>
                </div>
            </div>
            {ballPanel}
            <div className="btn-action" onClick={
              () => this._addBall()
            }>
              <span className="circle btn-plus" >+</span>
            </div>
        </div>
      </div>
    );
  }

  toggleVisible(){
      let flag = Boolean(this.state.visibleFlag ^ true);
      this.setState({visibleFlag: flag});
  }
  getVisible(flag){
      return (flag ? 'visible':'hidden');
  }
  _createCanvas(){
    this.props.dispatch(CreateCanvas());
  }
  _handleChangeDateS(event, dateString){
    this.props.dispatch(UpdDate(moment(dateString).format('YYYY-MM-DD'), 'start'));
  }
  _handleChangeDateE(event, dateString){
    this.props.dispatch(UpdDate(moment(dateString).format('YYYY-MM-DD'), 'end'));
  }
  _addBall(){
    this.props.dispatch(AddBall());
  }

  getBallPanel(ballAry=[], visibleFlag){
    let ary = [];
    for(let [key, value] of ballAry.entries()){
      console.log(`${key}, ${value}`);
      let a = `act-${key}`;
      let b = `pre-${key}`;
      ary.push(
        <EditRow sort={value.sort} a={a} b={b} visibleFlag={visibleFlag}/>
      );
    }
    return ary;
  }
}

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
    // let a = this.props.a;
    // let b = this.props.b;
    // console.log(`${a} ${b}`);
    console.log(ReactDOM.findDOMNode(this));
    // ReactDOM.findDOMNode().findDOMNode(`${a}`).datepicker();
  }
  render(){
    let {sort, a, b, visibleFlag, sDate, eDate} = this.props;
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
            {/* <input type="text" id="datepicker" ref={a} placeholder="mm/dd/yyyy"
              onChange={ (event) => this._updActBall(event, {a})}/> */}
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
            {/* <input type="text" id="datepicker" ref={b} placeholder="mm/dd/yyyy"
              onChange={ (event) => this._updPreBall(event, {b})}/> */}
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

function mapStateToProps(state) {
  const {sDate, eDate} = state.updateBar;
  console.log(`calling mSTPs: monthAry=${state.monthAry}`);
  return {
    sDate,
    eDate,
    monthAry: state.updateBar.monthAry,
    actBalls: state.updateBall.actBalls,
    preBalls: state.updateBall.preBalls
  };
}

EditBox = connect(mapStateToProps)(EditBox);
EditRow = connect(mapStateToProps)(EditRow);

export {EditBox};
