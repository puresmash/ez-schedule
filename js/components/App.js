import React from 'react';
import {Graph} from '../BlueBall.js';
import {EditBox} from '../EditBox.js';
import {Surface} from './Surface.js';

const App = () => (
  <div id="App">
    <Surface />
    <EditBox visible={false}/>
    <Graph />
  </div>
)

export default App;
