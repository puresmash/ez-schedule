
import React from 'react';
import { connect } from 'react-redux';
import firebase from 'firebase';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import { MenuItem, IconMenu, IconButton, Snackbar, FloatingActionButton, Divider, Paper, Badge } from 'material-ui';
import CloudUploadIcon from 'material-ui/svg-icons/file/cloud-upload';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import ExpandMoreIcon from 'material-ui/svg-icons/navigation/expand-more';
import ExpandLessIcon from 'material-ui/svg-icons/navigation/expand-less';
import PhotoIcon from 'material-ui/svg-icons/image/photo';
import Timelapse from 'material-ui/svg-icons/image/timelapse';
import DateRange from 'material-ui/svg-icons/action/date-range';
import ContentAdd from 'material-ui/svg-icons/content/add';

import { AddBall, DownloadImage } from './actions';
import EditDate from './components/EditDate';
import EditTimeline from './components/EditTimeline';
import MyAccount from './components/MyAccount';
import DocumentList from './components/DocumentList';

import StringUtils from './utils/Utils';

class EditBox extends React.Component {

  static defaultProps = {
    sDate: '',
    eDate: '',
    visible: false,
  };
  static propTypes = {
    visible: React.PropTypes.bool,
  };

  constructor(props) {
    super(props);
    const visibleFlag = props.visible || EditBox.defaultProps.visible;
    this.state = {
      open: true,
      autoOk: true,
      disableYearSelection: true,
      visibleFlag,
      openMainSchedule: false,
      openTimeline: false,
      openSnackbar: false,
    };
  }

  // componentDidMount() {
  // }

  render() {
    const { sDate, eDate, actBalls, preBalls, svgRef, uid, sid, fileInfos, dispatch } = this.props;
    const { visibleFlag, openMainSchedule, openTimeline, openSnackbar } = this.state;
    const ballPanel = this.getBallPanel(actBalls, preBalls, sDate, eDate);
    console.log('Rendering editbox');

    return (
      <div id="editbox" className="editbox">

        <MuiThemeProvider>
          <AppBar
            title="Schedule Canvas"
            className="appbar"
            iconElementLeft={
              <i className="fa fa-bars"
                aria-hidden="true"
                style={{ lineHeight: '46px',
                  paddingLeft: '6px',
                  paddingRight: '6px',
                  fontSize: '20px',
                  color: 'white',
                }}
                onClick={
                  () => this.toggleVisible()
                } />
            }
            iconElementRight={
              <IconMenu
                iconButtonElement={
                  <IconButton><MoreVertIcon /></IconButton>
                }
                targetOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
              >
                <MenuItem
                  primaryText="Schedule Upload"
                  leftIcon={<CloudUploadIcon />}
                  onClick={() => {
                    this._updateStore();
                  }} />
                <MenuItem
                  primaryText="Download as PNG"
                  leftIcon={<PhotoIcon />}
                  onClick={() => {
                    dispatch(DownloadImage(svgRef));
                  }} />
              </IconMenu>
            }
            style={{ zIndex: '0' }}
          />
        </MuiThemeProvider>
        <div
          id="mask"
          style={this._getMaskVisible(visibleFlag)}
          onClick={() => {
            this.setState({ visibleFlag: false });
          }} />
        <div id="side-nav" style={this.getVisible(visibleFlag)}>
          <MuiThemeProvider>
            <Paper zDepth={1} className="side-nav-wrapper">
              <nav>
                <MyAccount />
                <DocumentList fileInfos={fileInfos} sid={sid} />
                <MenuItem
                  primaryText="Main Schedule"
                  leftIcon={<DateRange />}
                  rightIcon={openMainSchedule ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                  onClick={() => {
                    this.setState({ openMainSchedule: !openMainSchedule });
                  }} />
                <EditDate openMainSchedule={openMainSchedule} />
                <Divider />
                <MenuItem
                  className="menu-item"
                  primaryText={
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <span>Timeline</span>
                      <Badge
                        badgeContent={ballPanel.length}
                        secondary
                        style={{ marginLeft: '8px', padding: 0 }}
                        badgeStyle={{ position: 'relative' }}
                      />
                    </div>
                  }
                  leftIcon={<Timelapse />}
                  rightIcon={openTimeline ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                  onClick={() => {
                    this.setState({ openTimeline: !openTimeline })
                  }} />

                <div style={this._getTimelineVisible(openTimeline)}>
                  {ballPanel}
                </div>
                <Divider style={{ marginTop: openTimeline ? -1 : 0 }}/>
                <FloatingActionButton
                  mini
                  style={{ marginLeft: '70%',
                    marginTop: '-20px',
                    marginBottom: '-20px',
                    position: 'relative',
                    zIndex: '2',
                  }}
                  onClick={
                    () => this._addBall()
                  }>
                  <ContentAdd />
                </FloatingActionButton>

                <MenuItem
                  className="menu-item"
                  primaryText="Schedule Upload"
                  leftIcon={<CloudUploadIcon />}
                  onClick={() => {
                    this._updateStore();
                  }} />
                <MenuItem
                  className="menu-item"
                  primaryText="Download as PNG"
                  leftIcon={<PhotoIcon />}
                  onClick={() => {
                    dispatch(DownloadImage(svgRef));
                  }} />
              </nav>
            </Paper>
          </MuiThemeProvider>
          <MuiThemeProvider>
            <Snackbar
              open={openSnackbar}
              message="Save schedule to Cloud succeed"
              autoHideDuration={4000}
              onRequestClose={this.toogleSnack} />
          </MuiThemeProvider>
        </div>
      </div>
    );
  }

  toggleVisible() {
    const flag = Boolean(this.state.visibleFlag ^ true);
    this.setState({ visibleFlag: flag });
  }

  getVisible(flag) {
    const collapse = {
      left: '-100%',
      opacity: 0,
    };
    const visible = {};
    console.log('visibleFlag change');
    console.log(flag);
    return (flag ? visible : collapse);
  }
  _getMaskVisible(flag) {
    const collapse = {
      left: '-100%',
      opacity: 0,
    };
    const visible = {
      left: 0,
    };
    return (flag ? visible : collapse);
  }
  _getTimelineVisible(flag) {
    const collapse = {
      overflow: 'hidden',
      visibility: 'hidden',
      height: 0,
      opacity: 0,
    };
    const visible = {
      visibility: 'visible',
      height: 'auto',
      opacity: 1,
    };
    return (flag ? visible : collapse);
  }
  _addBall() {
    this.props.dispatch(AddBall());
  }

  getBallPanel(actBalls, preBalls, sDate, eDate) {
    const ary = [];
    actBalls.forEach((value, key) => {
      console.log(`${key}, ${value}`);
      key = StringUtils.extractIndexFromId(key);
      // preBalls always has same length with actBalls
      const act = value;
      const pre = preBalls.get(`pre-${key}`);
      ary.push(
        <EditTimeline
          key={`row-${key}`}
          sort={value.sort}
          act={act}
          pre={pre}
          sDate={sDate}
          eDate={eDate}
        />
      );
    });

    return ary;
  }

  toogleSnack = () => {
      const {openSnackbar} = this.state;
      this.setState({openSnackbar: !openSnackbar});
  }

  /**
   * Firebase
   */
  _updateStore = () => {
    const { sid, user } = this.props;
    const { monthAry, actBalls, preBalls, sDate, eDate } = this.props;
    const postData = {
      updateBall: {
        actBalls,
        preBalls,
      },
      updateBar: {
        sDate,
        eDate,
        monthAry,
      },
    };
    const updates = {};
    updates[`/schedule/${user.uid}/${sid}`] = postData;
    updates[`/users/${user.uid}/files/${sid}/time`] = firebase.database.ServerValue.TIMESTAMP;
    return firebase.database().ref().update(updates)
              .then(this.toogleSnack);
  }
  readFirebase = (path) => {
    return firebase.database().ref(path).once('value').then(
      snapshot => snapshot.val()
    );
  }
  updateFirebase = (path, payload) => {
    return firebase.database().ref(path).update(payload);
  }

}

function mapStateToProps(state) {
  const { sDate, eDate } = state.updateBar;
  const { svgRef, sid, user, fileInfos } = state.internalRef;
  console.log(`calling mSTPs: sDate=${sDate}, eDate=${eDate}`);
  return {
    sDate,
    eDate,
    monthAry: state.updateBar.monthAry,
    actBalls: state.updateBall.actBalls,
    preBalls: state.updateBall.preBalls,
    svgRef,
    sid,
    user,
    fileInfos,
  };
}

export default connect(mapStateToProps)(EditBox);
