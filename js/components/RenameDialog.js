
import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';

import {LoadScheduleArray} from '../actions/index.js';

import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

export default class RenameDialog extends Component{

    static defaultProps = {
        sid: ''
    };
    static propTypes = {
        sid: PropTypes.string.isRequired,
    };

    constructor(props){
        super(props);
        this.state = {
            openRenameDialog: false
        }
    }

    handleOpen = ()=>{
        this.setState({openRenameDialog: true});
    }

    handleClose = ()=>{
        this.setState({openRenameDialog: false});
    }

    render(){
        const {fileId} = this.props;
        const actions = [
          <FlatButton
            label="Cancel"
            primary={true}
            onTouchTap={this.handleClose}
          />,
          <FlatButton
            label="Submit"
            primary={true}
            keyboardFocused={true}
            onTouchTap={()=>{
                this._rename(fileId, this.refs.newName);
                this.handleClose();
            }}
          />,
        ];

        return(
            <div>
                <Dialog
                  title="Rename This File"
                  actions={actions}
                  modal={false}
                  open={this.state.openRenameDialog}
                  onRequestClose={this.handleClose}
                >
                <input type="text" ref="newName" placeholder="new name" />
                </Dialog>
            </div>
        );
    }

    _rename = (fileId, newName) => {
        // console.error(newName.value);
        const { firebase, dispatch } = this.props;
        const user = firebase.auth().currentUser;
        var fileNameRef = firebase.database().ref(`users/${user.uid}/files/${fileId}/name`);
        fileNameRef.transaction(function(name) {
          return newName.value;
        })
        .then(()=>{
            dispatch(LoadScheduleArray(firebase, dispatch));
        });
    }

}

// export default connect()(RenameDialog);
