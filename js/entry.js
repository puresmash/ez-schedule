
require('../scss/style.scss');

let React = require('react');
let ReactDOM = require('react-dom');
import {createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import {Provider} from 'react-redux';
import rootReducer from './reducers/reducer.js';
// SVG-React Components
// let SimpleComponent = require('./SimpleComponent.js');
import App from './components/App.js';
// document.write(require("./content.js"));

// ReactDOM.render(<FirstComponent />, document.body);
const store = createStore(
    rootReducer,
    applyMiddleware(thunk)
);

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
