/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Text, View} from 'react-native';
import { Router, Stack, Scene } from 'react-native-router-flux';
import { createStore, applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';

// for debug
import { composeWithDevTools } from 'redux-devtools-extension';
import { createLogger } from 'redux-logger'

import rootReducer from './src/reducers';
import Login from './src/components/Login';
import Logout from './src/components/Logout';

const loggerMiddleware = createLogger({collapsed:true});
const middleware = [thunk, loggerMiddleware];

const store = createStore(rootReducer, {}, composeWithDevTools(
  applyMiddleware(...middleware)
));

export default class App extends Component<Props> {
  render() { 
    return (
      <Provider store={store} >
        <Router>
          <Stack>
            <Scene key='login' component={Login} title='Login'/>
            <Scene key='logout' component={Logout} title='Logout' />
          </Stack>
        </Router>
        {/* <View style={styles.containserStyle}>
          <Login />  
        </View> */}
      </Provider>
    );
  }
}
  
const styles = {
  containserStyle: {
    marginTop: 45
  }
}
