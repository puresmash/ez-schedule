
import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import firebase from 'firebase';

import '../scss/style.scss';
import rootReducer from './reducers';
import App from './components/App';

const store = createStore(
    rootReducer,
    applyMiddleware(thunk),
);

function setup() {
  return (
    <Provider store={store}>
      <App />
    </Provider>
  );
}

const config = {
  apiKey: 'AIzaSyAjC9U69Tq534yHFz8TfUOJ2M37se5ITyI',
  authDomain: 'ez-schedule-2fd88.firebaseapp.com',
  databaseURL: 'https://ez-schedule-2fd88.firebaseio.com',
  storageBucket: 'ez-schedule-2fd88.appspot.com',
  messagingSenderId: '413243052956',
};
firebase.initializeApp(config);

ReactDOM.render(setup(), document.body.querySelector('div#svg'));
