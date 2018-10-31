/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Text, View} from 'react-native';
import { Router, Stack, Scene, Modal } from 'react-native-router-flux';
import { createStore, applyMiddleware, compose } from 'redux';
import { Provider, connect } from 'react-redux';
import thunk from 'redux-thunk';

// for debug
import { composeWithDevTools } from 'redux-devtools-extension';
import { createLogger } from 'redux-logger'

import rootReducer from './src/reducers';
import Login from './src/components/Login';
import Logout from './src/components/Logout';
import Profile from './src/components/Profile';
import Problems from './src/components/Problems';

const loggerMiddleware = createLogger({collapsed:true});
const middleware = [thunk, loggerMiddleware];

const store = createStore(rootReducer, {}, composeWithDevTools(
  applyMiddleware(...middleware)
));

export default class App extends Component {
  render() { 
    return (
      
      <Provider store={store} >
        <Router>
          <Scene key='root' hideNavBar modal>
            {/** Seperated view, only for Login */}
            <Scene key='loginwrapper' initial >
              <Scene key='login' component={Login} title='Login' />
            </Scene>

            {/** App main area */}
            <Scene key='main' hideNavBar tabs>
              <Scene key='problems' initial component={Problems} title='Problems' onEnter={() => {console.log('HELLO ONENTER`12'); Problems.onEnter()}}/>
              <Scene key='profile' component={Profile} title='Profile' onEnter={() => {console.log('HELLO ONENTER345')}}/>
            </Scene>
          </Scene>
        </Router>
      </Provider>
        
    );
  }
}
  
const styles = {
  containserStyle: {
    marginTop: 45
  }
}
