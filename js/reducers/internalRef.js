
const initState = {
  svgRef: {},
  userAgent: {},
  sid: '',
  user: {},
  fileIds: [],
  fileInfos: [],
};

export default function internalRef(state = initState, action) {
  switch (action.type) {
    case 'REF_SVG': {
      return Object.assign({}, state, {
        svgRef: action.ref,
      });
    }
    case 'SET_UA': {
      return Object.assign({}, state, {
        userAgent: action.userAgent,
      });
    }
    case 'SET_SID': {
      return Object.assign({}, state, {
        sid: action.sid,
      });
    }
    case 'SET_USER': {
      const user = {};
      user.uid = action.uid;
      user.email = action.email;
      user.name = action.name;
      user.avatarSrc = action.avatarSrc;
      return Object.assign({}, state, {
        user,
      });
    }
    case 'SET_FILE_IDS': {
      let fileIds = [];
      fileIds = [...action.fileIds];
      return Object.assign({}, state, {
        fileIds,
      });
    }
    case 'SET_FILE_INFOS': {
      let fileInfos = {};
      fileInfos = { ...action.fileInfos };
      return Object.assign({}, state, {
        fileInfos,
      });
    }

    default:
      return state;
  }
}
