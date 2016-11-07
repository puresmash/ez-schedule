
import React from 'react';
import {connect} from 'react-redux';
import {UpdDate, CreateCanvas} from '../actions/index.js';

import 'react-date-picker/index.css'
import { DateField, DatePicker } from 'react-date-picker';

class Surface extends React.Component {
    constructor(){
      super();
      this.state = { closeComponent: false };
      this.constructMap();
    }
    onChange(dateString){
      console.log(dateString);
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
                  {this.getWizardStep('paint')}
                </div>
              </div>
          </div>
        </div>
      );
    }

    constructMap(){
        let step = new Map();
        step.set('paint',
            <div className="button" onClick={
              (event) => this._createCanvas()
            }>
              <i className="fa fa-paint-brush" aria-hidden="true">
                <span style={{paddingLeft: '0.5em'}}>Draw Graph</span>
              </i>
            </div>
        );
        this.step = step;
    }

    _createCanvas(){
      this.props.dispatch(CreateCanvas());
    }

    _handleChangeDateS(dateString){
      this.props.dispatch(UpdDate(dateString, 'start'));
    }
    _handleChangeDateE(dateString){
      this.props.dispatch(UpdDate(dateString, 'end'));
    }

    // _handleChangeDateS(){
    //   let sDate = ReactDOM.findDOMNode(this.refs.sDate).value;
    //   console.log(`change sDate by wizard: ${sDate}`);
    //   this.props.dispatch(UpdDate(sDate, 'start'));
    // }
    // _handleChangeDateE(){
    //     let eDate = ReactDOM.findDOMNode(this.refs.eDate).value;
    //     console.log(`change eDate by wizard: ${eDate}`);
    //     this.props.dispatch(UpdDate(eDate, 'end'));
    // }

    closeWindow(){
        this.setState({closeComponent: true});
    }

    getVisWindow(){
        if(this.state.closeComponent)
            return {display: 'none'};
        return {};
    }

    getWizardStep(key){
        return this.step.get(key);
        // map.set('next',
        //     <div className="button" onClick={
        //       (event) => this._createCanvas()
        //     }>
        //       <i className="fa fa-paint-brush" aria-hidden="true">
        //         <span style={{paddingLeft: '0.5em'}}>Draw Graph</span>
        //       </i>
        //     </div>
        //     'fa-arrow-right'
        // );
    }

    getWizard(sDate, eDate){
        console.log(`sDate=${sDate}, eDate=${eDate}`);

        return(
            <div>
                <DateField
                  dateFormat="YYYY-MM"
                  forceValidDate={false}
                  minDate="2016-05"
                  maxDate="2017-01"
                  placeholder="Insert Start Date"
                  onChange={
                      (dateString)=>this._handleChangeDateS(dateString)
                  }
                  style={{marginLeft: '1em'}}
                >
                  <DatePicker
                    navigation={true}
                    locale="en"
                    forceValidDate={true}
                    highlightWeekends={false}
                    highlightToday={false}
                    weekNumbers={false}
                    weekStartDay={0}
                    footer={true}
                    weekDayNames={false}
                  />
                </DateField>

                <DateField
                  dateFormat="YYYY-MM"
                  forceValidDate={false}
                  minDate="2016-05"
                  maxDate="2017-01"
                  placeholder="Insert End Date"
                  onChange={
                      (dateString)=>this._handleChangeDateE(dateString)
                  }
                  style={{marginLeft: '1em'}}
                >
                  <DatePicker
                    navigation={true}
                    locale="en"
                    forceValidDate={true}
                    highlightWeekends={false}
                    highlightToday={false}
                    weekNumbers={false}
                    weekStartDay={0}
                    footer={true}
                    weekDayNames={false}
                  />
                </DateField>
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
