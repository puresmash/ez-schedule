
import React from 'react';
import {connect} from 'react-redux';
import {UpdDate, CreateCanvas} from '../actions/index.js';
import moment from 'moment';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import DatePicker from 'material-ui/DatePicker';
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();
// import MyDialog from './Window.js'

const MAX_MONTH = 6;
const MIN_MONTH = -3;

class Surface extends React.Component {
    constructor(){
      super();
      this.state = {
          open: true,
          autoOk: true,
          disableYearSelection: true,
          closeComponent: false,
      };
      this.constructMap();
    }
    onChange(dateString){
      console.log(dateString);
    }
    handleOpen(){
        this.setState({open: true});
    }

    handleClose(){
        this.setState({open: false});
    }
    render(){
       let {sDate, eDate} = this.props;
    //   let wizard = this.getWizard(sDate, eDate);

      return(
        //   <MyDialog></MyDialog>
        <div id="surface" className="flex-center" style={this.getVisWindow()}>
          <div className="window">
              <div className="state">
                    <h2>Sync or Create</h2>
                    <i className="fa fa-times" aria-hidden="true" onClick={
                        ()=>this.closeWindow()
                    }></i>
              </div>
              <div className="wizard">
                <MuiThemeProvider>
                  <DatePicker
                      className="datepicker-wizard"
                      onChange={this._handleChangeDateS.bind(this)}
                      shouldDisableDate={(date)=>{return date.getDate() != 1}}
                      floatingLabelText="Insert Start Date"
                      minDate={moment().add(MIN_MONTH, 'M').toDate()}
                      maxDate={moment().add(MAX_MONTH, 'M').toDate()}
                      autoOk={this.state.autoOk}
                      disableYearSelection={this.state.disableYearSelection}/>
                </MuiThemeProvider>
                <MuiThemeProvider>
                  <DatePicker
                      className="datepicker-wizard"
                      onChange={this._handleChangeDateE.bind(this)}
                      shouldDisableDate={(date)=>{
                          return date.getDate() != moment(date).daysInMonth()
                      }}
                      floatingLabelText="Insert End Date"
                      minDate={moment().add(MIN_MONTH, 'M').toDate()}
                      maxDate={moment().add(MAX_MONTH, 'M').toDate()}
                      autoOk={this.state.autoOk}
                      disableYearSelection={this.state.disableYearSelection}/>
                </MuiThemeProvider>

                <div className="btn-panel">
                  <div className="button" style={{marginRight: '1em'}}>
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
    getDisableDate(date){
        return date.getDate() != 1;
    }
    _handleChangeDateS(event, dateString){
      this.props.dispatch(UpdDate(moment(dateString).format('YYYY-MM-DD'), 'start'));
    }
    _handleChangeDateE(event, dateString){
      this.props.dispatch(UpdDate(moment(dateString).format('YYYY-MM-DD'), 'end'));
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
