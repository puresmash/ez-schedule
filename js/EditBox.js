
import React from 'react';
import {connect} from 'react-redux';
import {UpdDate, CreateCanvas, AddActBall, UpdActBall, UpdPreBall, UpdDesc} from './actions/index.js'
import Calendar from './components/Calendar.js'
import moment from 'moment';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';

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
                        <Calendar onChange={this._handleChangeDateS.bind(this)} placeholder={'Insert Start Date'}
                                  maxDate={moment().add(MAX_MONTH, 'M').format('YYYY-MM')}
                                  minDate={moment().add(MIN_MONTH, 'M').format('YYYY-MM')}
                                  value={sDate} clearIcon={visibleFlag}></Calendar>
                    </div>
                    <div className="edit-row-detail" style={{marginBottom: '8px'}}>
                        <label className="edit-lbl">End</label>
                        <Calendar onChange={this._handleChangeDateE.bind(this)} placeholder={'Insert End Date'}
                                  maxDate={moment().add(MAX_MONTH, 'M').format('YYYY-MM')}
                                  minDate={moment().add(MIN_MONTH, 'M').format('YYYY-MM')}
                                  value={eDate} clearIcon={visibleFlag}></Calendar>
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
   // _handleChangeDateS(event){
   //   this.props.dispatch(UpdDate(event.target.value, 'start'));
   // }
  _handleChangeDateS(dateString){
    this.props.dispatch(UpdDate(dateString, 'start'));
  }
   // _handleChangeDateE(event){
   //   this.props.dispatch(UpdDate(event.target.value, 'end'));
   // }
  _handleChangeDateE(dateString){
    this.props.dispatch(UpdDate(dateString, 'end'));
  }
  _addBall(){
    this.props.dispatch(AddActBall());
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
  constructor(){
      super();
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
    let {sort, a, b, visibleFlag} = this.props;
    return(
      <div className="edit-row ball-panel">
        <div className="edit-row-detail" style={{marginBottom: '8px'}}>
            <span id={a} className="circle edit-ball">{sort}</span>
            <Calendar onChange={(dateString) => this._updActBall(dateString, a)} placeholder={'Insert Actual Date'}
                      maxDate={moment().add(MAX_MONTH, 'M').format('MM/DD/YYYY')}
                      minDate={moment().add(MIN_MONTH, 'M').format('MM/DD/YYYY')}
                      dateFormat={'MM/DD/YYYY'}
                      clearIcon={visibleFlag}></Calendar>
            {/* <input type="text" id="datepicker" ref={a} placeholder="mm/dd/yyyy"
              onChange={ (event) => this._updActBall(event, {a})}/> */}
        </div>
        <div className="edit-row-detail" style={{marginBottom: '8px'}}>
            <span id={b} className="circle edit-ball">{sort}</span>
            <Calendar onChange={(dateString) => this._updPreBall(dateString, b)} placeholder={'Insert Predict Date'}
                      maxDate={moment().add(MAX_MONTH, 'M').format('MM/DD/YYYY')}
                      minDate={moment().add(MIN_MONTH, 'M').format('MM/DD/YYYY')}
                      dateFormat={'MM/DD/YYYY'}
                      clearIcon={visibleFlag}></Calendar>
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
  _updActBall(dateString, id){
    this.props.dispatch(UpdActBall(id, dateString));
    console.log(`UpdActBall-id: ${id}, dateString: ${dateString}`);
  }
  // _updActBall(event, id){
  //   id = id.a;
  //   this.props.dispatch(UpdActBall(id, event.target.value));
  //   console.log(`UpdActBall-id: ${id}`);
  //   console.log(id);
  // }
  _updPreBall(dateString, id){
    this.props.dispatch(UpdPreBall(id, dateString));
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
