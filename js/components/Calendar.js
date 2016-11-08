
import React from 'react';
import { DateField, DatePicker } from 'react-date-picker';
import 'react-date-picker/index.css';

export default class Calendar extends React.Component{

    static defaultProps = {
      dateFormat: 'YYYY-MM',
      minDate: '2016-05',
      maxDate: '2017-01',
      placeholder: 'Insert Start Date test',
      onChange: ()=>{
          console.error('Should specify onChange callback function for Calendar component.');
      },
    };
    static propTypes = {
          onChange: React.PropTypes.func,
    };

    constructor(props){
        super(props);
        this.state = {

        }
    }

    render(){
        return(
            <DateField
              dateFormat={this.props.dateFormat}
              forceValidDate={false}
              minDate={this.props.minDate}
              maxDate={this.props.maxDate}
              placeholder={this.props.placeholder}
              value={this.props.value}
              onChange={
                  (dateString, id)=>this.props.onChange(dateString, id)
              }
              style={{marginLeft: '1em'}}
              clearIcon={this.props.clearIcon}
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
        );

    }
}
