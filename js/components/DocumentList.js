
import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {List, ListItem} from 'material-ui/List';
import MenuItem from 'material-ui/MenuItem';
import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton';
import Divider from 'material-ui/Divider';
import Subheader from 'material-ui/Subheader';
import Avatar from 'material-ui/Avatar';
import EditorInsertChart from 'material-ui/svg-icons/editor/insert-chart';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import {blue500, grey600} from 'material-ui/styles/colors';
import ExpandMoreIcon from 'material-ui/svg-icons/navigation/expand-more';
import ExpandLessIcon from 'material-ui/svg-icons/navigation/expand-less';

// import FirebaseHelper from '../utils/FirebaseHelper.js';
import {SyncFromStroageEx} from '../actions/index.js';

class DocumentList extends Component{

    static defaultProps = {
        fileIds: [],
        sid: '',
    };
    static propTypes = {
        fileIds: PropTypes.array.isRequired,
        sid: PropTypes.string.isRequired,
    };

    constructor(props){
        super(props);
        this.state = {
            expandFilesFlag: false,
        }
    }

    render(){
        let {fileIds, sid, dispatch, firebase} = this.props;
        const {expandFilesFlag} = this.state;
        let expandIcon = expandFilesFlag? <ExpandLessIcon/> : <ExpandMoreIcon/>

        const items = [];
        fileIds.forEach((ele, index)=>{
            items.push(
                <ListItem
                  value={index}
                  leftAvatar={<Avatar icon={<EditorInsertChart />} backgroundColor={blue500} />}
                  rightIcon={
                      <IconMenu
                        iconButtonElement={
                            <IconButton style={{margin: '-12px'}}>
                                <MoreVertIcon color={grey600}/>
                            </IconButton>
                        }
                      >
                        <MenuItem primaryText="Load File" onClick={()=>{
                            dispatch(SyncFromStroageEx(ele, firebase));
                        }}/>
                        <MenuItem primaryText="Rename"/>
                      </IconMenu>
                  }
                  primaryText={ele}
                //   secondaryText="Jan 10, 2014"
                  style={{backgroundColor: (sid==ele)?'#CCCCCC':'white'}}
                />
            );
        });

        return(
            <div>
                <MenuItem
                    onClick={()=>{
                        this.setState({expandFilesFlag: !expandFilesFlag});
                    }}
                    primaryText={sid}
                    rightIcon={expandIcon}>
                </MenuItem>
                <Divider />
                <List style={{paddingTop: 0, paddingBottom: 0}}>
                     <div style={{display: expandFilesFlag? 'block':'none'}}>
                        <Subheader inset={true}>Files</Subheader>
                        {items}
                     </div>
                </List>
                <Divider style={{marginTop: expandFilesFlag?0:-1}}/>
            </div>
        );
    }

    // rename = (fileId, newName) => {
    //     const { firebase } = this.props;
    //     const user = firebase.auth().currentUser;
    //     var fileNameRef = firebase.database().ref(`users/${user.uid}/files/${fileId}/name`);
    //     fileNameRef.transaction(function(name) {
    //
    //       return newName;
    //     });
    // }
}

function mapStateToProps(state) {
  return {
    firebase: state.internalRef.firebase,
  };
}

export default connect(mapStateToProps)(DocumentList);
