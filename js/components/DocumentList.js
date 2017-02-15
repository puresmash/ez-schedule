// @flow
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
// Types
import FileInfo from '../types/FileInfo';
import { SyncFromStroageEx } from '../actions/index';
import RenameDialog from './RenameDialog';

class DocumentList extends Component {

  props: {
    fileInfos: {
      [key: string]: FileInfo
    },
    sid: string,
    dispatch: () => void,
  }

  state: {
    selectFile: string,
    expandFilesFlag: boolean,
  }

  static defaultProps = {
    fileInfos: {},
    sid: '',
  };

  constructor(props) {
    super(props);
    this.state = {
      expandFilesFlag: false,
      selectFile: '',
    };
  }

  render() {
    const { expandFilesFlag } = this.state;
    const expandIcon = expandFilesFlag ? <ExpandLessIcon /> : <ExpandMoreIcon />;

    return (
      <div>
        <RenameDialog ref="renameDialog" fileId={this.state.selectFile} />
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
            {this.renderFileList()}
          </div>
        </List>
        <Divider style={{ marginTop: expandFilesFlag ? 0 : -1 }} />
      </div>
    );
  }

  renderFileList = () => {
    const { fileInfos, sid, dispatch } = this.props;
    return Object.keys(fileInfos).map((fileId) => {
      const fileInfo = fileInfos[fileId];
      const filename = fileInfo.name || fileId;
      return (
        <ListItem
          value={fileId}
          leftAvatar={
            <Avatar
              icon={<EditorInsertChart />}
              backgroundColor={blue500} />
          }
          rightIcon={
            <IconMenu
              iconButtonElement={
                <IconButton style={{ margin: '-12px' }}>
                  <MoreVertIcon color={grey600} />
                </IconButton>
              } >
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
          style={{ backgroundColor: (sid === fileId) ? '#CCCCCC' : 'white' }} />
      );
    });
  }

}

export default connect()(DocumentList);
