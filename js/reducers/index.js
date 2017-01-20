
import { combineReducers } from 'redux';

import internalRef from './internalRef';
import updateBall from './updateBall';
import updateBar from './updateBar';

const svgApp = combineReducers({
  updateBall,
  updateBar,
  internalRef
});

export default svgApp;
