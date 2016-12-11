
import React, {Component, PropTypes} from 'react';

class StepTitle extends Component{
    constructor(props){
        super(props);
    }
    render(){
        return(
            <p style={{paddingTop: '8px'}}>
                {this.props.children}
            </p>
        );
    }
}

class StepDescription extends Component{
    constructor(props){
        super(props);
    }
    render(){
        return(
            <p style={{paddingBottom: '8px', lineHeight: '24px'}}>
                {this.props.children}
            </p>
        );
    }
}

class StepTextContent extends Component{
    constructor(props){
        super(props);
    }
    render(){
        return(
            <div className="wiz-text-content">
                <div className="blockquote">
                    <div className="content">
                        {this.props.children}
                    </div>
                </div>
            </div>
        );
    }
}

module.exports = {
    StepTitle,
    StepDescription,
    StepTextContent,
}
