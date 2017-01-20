
require('../scss/style.scss');

import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import rootReducer from './reducers';
import App from './components/App.js';

const store = createStore(
    rootReducer,
    applyMiddleware(thunk)
);

function setup(){
  return(
    <Provider store={store}>
      <App />
    </Provider>
  );
}

ReactDOM.render(setup(), document.body.querySelector('div#svg'))
