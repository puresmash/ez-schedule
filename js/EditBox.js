
import React from 'react';
import {connect} from 'react-redux';
import {UpdDate, CreateCanvas, AddActBall, UpdActBall, UpdPreBall, UpdDesc} from './actions/index.js'

class EditBox extends React.Component {
  constructor(){
    super();
  }

  render(){
    let {actBalls} = this.props;
    let ballPanel = this.getBallPanel(actBalls);
    console.log('Rendering editbox');
    return(
      <div id="editbox" className="editbox">
        <div className="edit-row edit-date">
          <label className="edit-lbl">Start</label>

          <input type="month" name="sDate" id="sDate" onChange={
            (event) => this._handleChangeDateS(event)
          }/>

          <label className="edit-lbl">End</label>
          <input type="month" name="eDate" id="eDate" onChange={
            (event) => this._handleChangeDateE(event)
          }/>

          <div className="btn-canvas" onClick={
            (event) => this._createCanvas()
          }>genCanvas</div>

        </div>
        {ballPanel}
        <div className="btn-action" onClick={
          () => this._addBall()
        }>
          <span className="circle btn-plus" >+</span>
        </div>
      </div>
    );
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
      // <div className="edit-row ball-panel">
      //   <span id={a} className="circle edit-ball">{value.sort}</span>
      //   <input type="text" id="datepicker" key={a} placeholder="mm/dd/yyyy"
      //     onChange={ (event) => this._updActBall(event, {a})}/>
      //
      //   <span id={b} className="circle edit-ball">{value.sort}</span>
      //   <input type="text" id="datepicker" key={b} placeholder="mm/dd/yyyy"
      //     onChange={ (event) => this._updPreBall(event, {b})}/>
      //
      //   <input type="text" defaultValue=""
      //     onChange={ (event) => this._updDesc(event, {b})}/>
      // </div>
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
  console.log(`calling mSTPs: monthAry=${state.monthAry}`);
  console.log(state);
  return {
    monthAry: state.updateBar.monthAry,
    actBalls: state.updateBall.actBalls,
    preBalls: state.updateBall.preBalls
  };
}

EditBox = connect(mapStateToProps)(EditBox);
EditRow = connect(mapStateToProps)(EditRow);

export {EditBox};
