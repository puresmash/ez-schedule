
import React from 'react';
import {connect} from 'react-redux';
import {UpdDate, CreateCanvas, AddActBall, UpdActBall, UpdPreBall, UpdDesc} from '../actions/index.js'

class Surface extends React.Component {
    constructor(){
      super();
      this.state = { closeComponent: false };
    }

    render(){
      let {sDate, eDate} = this.props;
      let wizard = this.getWizard(sDate, eDate);
      return(
        <div id="surface" className="flex-center" style={this.getVisWindow()}>
          <div className="window">
              <div className="state">
                    <i className="fa fa-times" aria-hidden="true" onClick={
                        ()=>this.closeWindow()
                    }></i>
              </div>
              <div className="wizard">
                {wizard}
                <div className="btn-panel">
                  <div className="button">
                    <i className="fa fa-cloud-download" aria-hidden="true">
                      <span style={{paddingLeft: '0.5em'}}>Sync Cloud</span>
                    </i>
                  </div>
                  <div className="button" style={{marginLeft: '1em'}} onClick={
                    (event) => this._createCanvas()
                  }>
                    <i className="fa fa-paint-brush" aria-hidden="true">
                      <span style={{paddingLeft: '0.5em'}}>Draw Graph</span>
                    </i>
                  </div>
                </div>
              </div>
          </div>
        </div>
      );
    }

    _createCanvas(){
      this.props.dispatch(CreateCanvas());
    }
    _handleChangeDateS(){
      let sDate = ReactDOM.findDOMNode(this.refs.sDate).value;
      console.log(`change sDate by wizard: ${sDate}`);
      this.props.dispatch(UpdDate(sDate, 'start'));
    }
    _handleChangeDateE(){
        let eDate = ReactDOM.findDOMNode(this.refs.eDate).value;
        console.log(`change eDate by wizard: ${eDate}`);
        this.props.dispatch(UpdDate(eDate, 'end'));
    }

    closeWindow(){
        this.setState({closeComponent: true});
    }

    getVisWindow(){
        if(this.state.closeComponent)
            return {display: 'none'};
        return {};
    }

    getWizardStep(sDate, eDate){
        // if(sDate && )
    }

    getWizard(sDate, eDate){
        console.log(`sDate=${sDate}, eDate=${eDate}`);

        return(
            <div>
                <div>
                    <label style={{fontSize: '1.2em'}}>Insert End Date</label>
                    <input id="datepicker" ref="eDate" type="text" name="eDate" placeholder="mm/dd/yyyy" defaultValue=""/>
                    <i className="fa fa-plane" aria-hidden="true" onClick={
                      () => this._handleChangeDateE()
                    } style={{fontSize: '1.2em', paddingLeft: '1em'}}></i>
                </div>
                <div>
                    <label style={{fontSize: '1.2em'}}>Insert Start Date</label>
                    <input id="datepicker" ref="sDate" type="text" name="sDate" placeholder="mm/dd/yyyy" />
                    <i className="fa fa-plane" aria-hidden="true" onClick={
                      () => this._handleChangeDateS()
                    } style={{fontSize: '1.2em', paddingLeft: '1em'}}></i>
                </div>        
            </div>
        );


    }
}

function mapStateToProps(state) {
  const {sDate, eDate} = state.updateBar;
  console.log(`calling mSTPs: sDate=${sDate}, eDate=${eDate}`);
  console.log(state);
  return {
    sDate,
    eDate
  };
}

Surface = connect(mapStateToProps)(Surface);

export {Surface};
