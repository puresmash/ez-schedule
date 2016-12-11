
import React, {Component, PropTypes} from 'react';

class StepButton extends Component{

    static defaultProps = {
        iconId: 'fa fa-cloud-download',
    };
    static propTypes = {
        wording: PropTypes.string.isRequired,
        iconId: PropTypes.string.isRequired,
    };

    constructor(props){
        super(props);
    }

    render(){
        let {wording, iconId, ...other} = this.props;

        return(
            <div {...other} className="button" >
                <i className={iconId} aria-hidden="true">
                  <span style={{paddingLeft: '0.5em'}}>{wording}</span>
                </i>
            </div>
        );
    }
}

class StepFooter extends Component{
    constructor(props){
        super(props);
    }
    render(){
        return(
            <div className="wiz-footer">
                {this.props.children}
            </div>
        );
    }
}

module.exports = {
    StepButton,
    StepFooter
}
