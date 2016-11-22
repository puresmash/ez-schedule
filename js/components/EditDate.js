
import React from 'react';
import {connect} from 'react-redux';

import {UpdDate, CreateCanvas} from '../actions/index.js'

import moment from 'moment';

import DatePicker from 'material-ui/DatePicker';

const MAX_MONTH = 6;
const MIN_MONTH = -3;

class EditDate extends React.Component{

    static defaultProps = {
      sDate: '',
      eDate: '',
    };
    static propTypes = {
          openMainSchedule: React.PropTypes.bool.isRequired,
    };

    constructor(props){
        super(props);
        this.state = {
            autoOk: true,
            disableYearSelection: true,
        }
    }

    render(){
        // Redux props
        let { sDate, eDate } = this.props;
        // From parent
        let { openMainSchedule } = this.props;
        return(
            <div className="edit-box-animation" style={this._getEditDateVisible(openMainSchedule)}>
                <div className="edit-row edit-date" >
                    <div>
                        <div className="edit-detail" style={{marginBottom: '8px'}}>
                            <label className="edit-lbl">Start</label>

                            <DatePicker
                                className="datepicker-bar"
                                onChange={this._handleChangeDateS.bind(this)}
                                shouldDisableDate={(date)=>{return date.getDate() != 1}}
                                value={sDate? moment(sDate).toDate(): ''}
                                hintText="Insert Start Date"
                                minDate={moment().add(MIN_MONTH, 'M').toDate()}
                                maxDate={moment().add(MAX_MONTH, 'M').toDate()}
                                autoOk={this.state.autoOk}
                                disableYearSelection={this.state.disableYearSelection}
                            />
                        </div>
                        <div className="edit-detail" style={{marginBottom: '8px'}}>
                            <label className="edit-lbl">End</label>

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
                                disableYearSelection={this.state.disableYearSelection}
                            />
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
            </div>
        );
    }

    _getEditDateVisible(flag){
        const collapse = {
            height: 0,
            overflow: 'hidden',
        }
        const visible = {
            height: '146px',
        }
        return (flag ? visible:collapse);
    }
    _handleChangeDateS(event, dateString){
      this.props.dispatch(UpdDate(moment(dateString).format('YYYY-MM-DD'), 'start'));
    }
    _handleChangeDateE(event, dateString){
      this.props.dispatch(UpdDate(moment(dateString).format('YYYY-MM-DD'), 'end'));
    }
    _createCanvas(){
      this.props.dispatch(CreateCanvas());
    }
}

function mapStateToProps(state) {
  const {sDate, eDate} = state.updateBar;
  // const {svgRef, uid, firebase} = state.internalRef;
  console.log(`calling mSTPs: sDate=${sDate}, eDate=${eDate}`);
  return {
    sDate,
    eDate,
  };
}

export default connect(mapStateToProps)(EditDate);
