
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { List, ListItem } from 'material-ui/List';
import MenuItem from 'material-ui/MenuItem';
import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton';
import Divider from 'material-ui/Divider';
import Subheader from 'material-ui/Subheader';
import Avatar from 'material-ui/Avatar';
import EditorInsertChart from 'material-ui/svg-icons/editor/insert-chart';
import FolderIcon from 'material-ui/svg-icons/file/folder';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import { blue500, grey600 } from 'material-ui/styles/colors';
import ExpandMoreIcon from 'material-ui/svg-icons/navigation/expand-more';
import ExpandLessIcon from 'material-ui/svg-icons/navigation/expand-less';

import { SyncFromStroageEx } from '../actions/index';
import RenameDialog from './RenameDialog';

class DocumentList extends Component {

  static defaultProps = {
    fileInfos: {},
    sid: '',
  };
  static propTypes = {
    fileInfos: PropTypes.object.isRequired,
    sid: PropTypes.string.isRequired,
    dispatch: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      expandFilesFlag: false,
      selectFile: '',
    };
  }

  render() {
    const { fileInfos, sid, dispatch } = this.props;
    const { expandFilesFlag } = this.state;
    const expandIcon = expandFilesFlag ? <ExpandLessIcon /> : <ExpandMoreIcon />;

    const items = [];

      // fileInfos.forEach((ele, index)=>{
    for (const fileId in fileInfos) {
      const fileInfo = fileInfos[fileId];
      const filename = fileInfo.name || fileId;
      items.push(
        <ListItem
          value={fileId}
          leftAvatar={<Avatar icon={<EditorInsertChart />} backgroundColor={blue500} />}
          rightIcon={
            <IconMenu
              iconButtonElement={
                <IconButton style={{ margin: '-12px' }}>
                  <MoreVertIcon color={grey600} />
                </IconButton>
              }
            >
              <MenuItem primaryText="Load File" onClick={() => {
                dispatch(SyncFromStroageEx(fileId));
              }} />
              <MenuItem primaryText="Rename" onClick={() => {
                this.refs.renameDialog.handleOpen();
                this.setState({ selectFile: fileId });
              }} />
            </IconMenu>
          }
          primaryText={filename}
          secondaryText={new Date(fileInfo.time).toDateString()}
          style={{ backgroundColor: (sid == fileId) ? '#CCCCCC' : 'white' }}
        />
      );
    }
        // });

    return (
      <div>
        <RenameDialog ref="renameDialog" fileId={this.state.selectFile} dispatch={dispatch} />
        <MenuItem
          onClick={() => {
            this.setState({ expandFilesFlag: !expandFilesFlag });
          }}
          primaryText="Files Management"
          leftIcon={<FolderIcon />}
          rightIcon={expandIcon} />
        <Divider />
        <List style={{ paddingTop: 0, paddingBottom: 0 }}>
          <div style={{ display: expandFilesFlag ? 'block' : 'none' }}>
            <Subheader inset>Files</Subheader>
            {items}
          </div>
        </List>
        <Divider style={{ marginTop: expandFilesFlag ? 0 : -1 }} />
      </div>
    );
  }

}

function mapStateToProps() {
  return {};
}

export default connect(mapStateToProps)(DocumentList);
