/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import { Provider } from 'react-redux';
import store from './store';
import LeetCodeRoutes from './routes';

export default () => {
  return (
    <Provider store={store}>
      <LeetCodeRoutes />
    </Provider>
  );
};
