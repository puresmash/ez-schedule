
require('../scss/style.scss');

let React = require('react');
let ReactDOM = require('react-dom');
import {createStore} from 'redux';
import {Provider} from 'react-redux';
import svgApp from './reducers/reducer.js';
// SVG-React Components
// let SimpleComponent = require('./SimpleComponent.js');
import Graph from './Graph.js';
import EditBox from './EditBox.js'
import Surface from './components/Surface.js';
import App from './components/App.js';
// document.write(require("./content.js"));

// ReactDOM.render(<FirstComponent />, document.body);
const store = createStore(svgApp);

function render(){
  ReactDOM.render(
    <Provider store={store}>
      <App />
    </Provider>, document.body.querySelector('div#svg')
  );
  // ReactDOM.render(, document.body.querySelector('div#editbox'));
}

render();
store.subscribe(render);
