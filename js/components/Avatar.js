
import React from 'react';

export default class Avatar extends React.Component{

    constructor(props){
        super(props);
    }

    render(){
        let {src} = this.props;
        if(src){
            src += '?sz=48';
            return(
                <img className="avatar" src={src} style={{borderRadius: '50%'}}></img>
            );
        }
        else{
            return(
                <div style={{
                    backgroundColor: 'aliceblue',
                    height: '48px',
                    width: '48px',
                    borderRadius: '50%',
                    textAlign: 'center',
                }}>
                    <i className="fa fa-user-secret" aria-hidden="true"
                        style={{
                            lineHeight: '48px',
                            fontSize: '24px'
                    }}></i>
                </div>
            );
        }
    }
}
