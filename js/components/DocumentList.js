
import React, {Component, PropTypes} from 'react';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {List, ListItem} from 'material-ui/List';
import MenuItem from 'material-ui/MenuItem';
import Divider from 'material-ui/Divider';
import Subheader from 'material-ui/Subheader';
import Avatar from 'material-ui/Avatar';
import EditorInsertChart from 'material-ui/svg-icons/editor/insert-chart';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import {blue500} from 'material-ui/styles/colors';
import ExpandMoreIcon from 'material-ui/svg-icons/navigation/expand-more';
import ExpandLessIcon from 'material-ui/svg-icons/navigation/expand-less';

export default class DocumentList extends Component{

    static defaultProps = {

    };
    static propTypes = {
        fileIds: PropTypes.array.isRequired,
        sid: PropTypes.string.isRequired,
    };

    constructor(props){
        super(props);
        this.state = {
            expandFilesFlag: false,
            selectFile: 0,
        }
    }

    render(){
        let {fileIds, sid} = this.props;
        const {expandFilesFlag, selectFile} = this.state;
        let expandIcon = expandFilesFlag? <ExpandLessIcon/> : <ExpandMoreIcon/>

        const items = [];
        fileIds.forEach((ele, index)=>{
            items.push(
                <ListItem
                  value={index}
                  leftAvatar={<Avatar icon={<EditorInsertChart />} backgroundColor={blue500} />}
                  rightIcon={<MoreVertIcon />}
                  primaryText={ele}
                //   secondaryText="Jan 10, 2014"
                  style={{backgroundColor: (selectFile==index)?'#CCCCCC':'white'}}
                  onClick={()=>{
                      this.setState({selectFile: index})
                  }}
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
}
