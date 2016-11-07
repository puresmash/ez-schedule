
import React from 'react';
import {connect} from 'react-redux';
import {UpdDate, CreateCanvas, AddActBall, UpdActBall, UpdPreBall, UpdDesc} from './actions/index.js'
import moment from 'moment';

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
        visibleFlag :  eval(visibleFlag)
    }
  }

  render(){
    let {sDate, eDate, actBalls} = this.props;
    let {visibleFlag} = this.state;
    let ballPanel = this.getBallPanel(actBalls);
    console.log('Rendering editbox');
    return(
      <div id="editbox" className="editbox">
        <div style={{fontSize: '3em', display: 'flex', justifyContent: 'flex-end'}}>
            <i className="fa fa-minus-square-o" aria-hidden="true" onClick={
                () => this.toggleVisible()
            }>
            </i>
        </div>
        <div id="container" style={{visibility: this.getVisible(visibleFlag)}}>
            <div className="edit-row edit-date">
                <div>
                    <div className="edit-row-detail" style={{marginBottom: '8px'}}>
                        <label className="edit-lbl">Start</label>
                        <input type="month" name="sDate" id="sDate" value={sDate}
                        min={moment().add(MIN_MONTH, 'M').format('YYYY-MM')}
                        max={moment().add(MAX_MONTH, 'M').format('YYYY-MM')}
                        onChange={
                          (event) => this._handleChangeDateS(event)
                        }/>
                    </div>

                    <div className="edit-row-detail">
                        <label className="edit-lbl">End</label>
                        <input type="month" name="eDate" id="eDate" value={eDate}
                        min={moment().add(MIN_MONTH, 'M').format('YYYY-MM')}
                        max={moment().add(MAX_MONTH, 'M').format('YYYY-MM')}
                        onChange={
                          (event) => this._handleChangeDateE(event)
                        }/>
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
      this.setState({visibleFlag: this.state.visibleFlag ^ true});
  }
  getVisible(flag){
      return (flag ? 'visible':'hidden');
  }
  _createCanvas(){
    this.props.dispatch(CreateCanvas());
  }
  _handleChangeDateS(event){
    this.props.dispatch(UpdDate(event.target.value, 'start'));
  }
  _handleChangeDateE(event){
    this.props.dispatch(UpdDate(event.target.value, 'end'));
  }
  _addBall(){
    this.props.dispatch(AddActBall());
  }

  getBallPanel(ballAry=[]){
    let ary = [];
    for(let [key, value] of ballAry.entries()){
      console.log(`${key}, ${value}`);
      let a = `act-${key}`;
      let b = `pre-${key}`;
      ary.push(
        <EditRow sort={value.sort} a={a} b={b}/>
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
    let a = this.props.a;
    let b = this.props.b;
    console.log(`${a} ${b}`);
    console.log(ReactDOM.findDOMNode(this));
    ReactDOM.findDOMNode(this).findDOMNode(`${a}`).datepicker();
  }
  render(){
    let {sort, a, b} = this.props;
    return(
      <div className="edit-row ball-panel">
        <span id={a} className="circle edit-ball">{sort}</span>
        <input type="text" id="datepicker" ref={a} placeholder="mm/dd/yyyy"
          onChange={ (event) => this._updActBall(event, {a})}/>

        <span id={b} className="circle edit-ball">{sort}</span>
        <input type="text" id="datepicker" ref={b} placeholder="mm/dd/yyyy"
          onChange={ (event) => this._updPreBall(event, {b})}/>

        <input type="text" defaultValue=""
          onChange={ (event) => this._updDesc(event, {b})}/>
      </div>
    );
  }
  _updActBall(event, id){
    id = id.a;
    this.props.dispatch(UpdActBall(id, event.target.value));
    console.log(`UpdActBall-id: ${id}`);
    console.log(id);
  }
  _updPreBall(event, id){
    id = id.b;
    this.props.dispatch(UpdPreBall(id, event.target.value));
  }
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
