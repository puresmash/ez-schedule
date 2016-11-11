
import React from 'react';
import ReactDOM from 'react-dom';
import {connect} from 'react-redux';
import {UpdDate, CreateCanvas, AddBall, UpdActBall, UpdPreBall, UpdDesc} from './actions/index.js'
import Calendar from './components/Calendar.js'
import moment from 'moment';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import DatePicker from 'material-ui/DatePicker';

import StringUtils from './utils/Utils.js';
import EditRow from './components/EditRow.js';

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
  componentDidMount(){
    this.getImage();
  }

  render(){
    let {sDate, eDate, actBalls} = this.props;
    let {visibleFlag} = this.state;
    let ballPanel = this.getBallPanel(actBalls, sDate, eDate);
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

  getBallPanel(ballMap , sDate, eDate){
    let ary = [];

    ballMap.forEach((value, key)=>{
        console.log(`${key}, ${value}`);
        key = StringUtils.extractIndexFromId(key);
        let a = `act-${key}`;
        let b = `pre-${key}`;
        ary.push(
          <EditRow key={`row-${key}`} sort={value.sort} a={a} b={b} sDate={sDate} eDate={eDate}/>
        );
    })

    return ary;
  }

  getImage(){
    //   var html = $('#svg').html();
    let html = ReactDOM.findDOMNode(this.refs.canvas);
    console.log(this.refs)
      console.log(html);
  }
}

function mapStateToProps(state) {
  const {sDate, eDate} = state.updateBar;
  console.log(`calling mSTPs: sDate=${sDate}, eDate=${eDate}`);
  return {
    sDate,
    eDate,
    monthAry: state.updateBar.monthAry,
    actBalls: state.updateBall.actBalls,
    preBalls: state.updateBall.preBalls
  };
}

EditBox = connect(mapStateToProps)(EditBox);

export {EditBox};
