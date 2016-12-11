
import React, {Component, PropTypes} from 'react';
import {StepTitle, StepDescription, StepTextContent,} from './StepTextContent.js';
import {StepButton, StepFooter} from './StepFooter.js';

class Step extends Component{

    static defaultProps = {

    };
    static propTypes = {
        stepIndex: PropTypes.string.isRequired,
        activeStep: PropTypes.string.isRequired
    };

    constructor(props){
        super(props);
    }

    render(){
        let {stepIndex, activeStep} = this.props;
        if (stepIndex === activeStep){
            return(
                <div className="wiz-wrapper">
                    {this.props.children}
                </div>
            );
        }
        else{
            return null;
        }
    }
}

class StepPlainContent extends Component{
    constructor(props){
        super(props);
    }
    render(){
        // Mainly preserve for style
        // Use style or div.wiz-plain-content to adjust Layout
        let {...other} = this.props;
        return(
            <div {...other} className="wiz-plain-content">
                {this.props.children}
            </div>
        );
    }
}

module.exports = {
    Step,
    StepTitle,
    StepDescription,
    StepTextContent,
    StepPlainContent,
    StepButton,
    StepFooter
}
