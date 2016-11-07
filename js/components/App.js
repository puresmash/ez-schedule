import React from 'react';
import {Graph} from '../BlueBall.js';
import {EditBox} from '../EditBox.js';
import {Surface} from './Surface.js';

const App = () => (
  <div id="App">
    <Surface />
    <Graph />
    <EditBox visible={false}/>
  </div>
)

export default App;
