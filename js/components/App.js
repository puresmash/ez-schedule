import React from 'react';
import { Graph } from '../Graph.js';
import EditBox from '../EditBox';
import { Surface } from './Surface.js';

const App = () => (
  <div id="App">
    <Surface />
    <EditBox visible={false}/>
    <Graph />
  </div>
)

export default App;
