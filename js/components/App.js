import React from 'react';
import Graph from '../Graph';
import EditBox from '../EditBox';
import Surface from './Surface';

const App = () => (
  <div id="App">
    <Surface />
    <EditBox visible={false} />
    <Graph />
  </div>
);

export default App;
