import React from 'react';
import {Graph} from '../BlueBall.js';
import {EditBox} from '../EditBox.js';
import {Surface} from './Surface.js';

const App = () => (
  <div>
    <Surface />
    <Graph />
    <EditBox sDate="" eDate=""/>
  </div>
)

export default App;
