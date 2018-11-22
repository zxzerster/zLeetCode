/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './store';

import LeetCodeRoutes from './routes';

export default () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor} >
        <LeetCodeRoutes />
      </PersistGate>
    </Provider>
  );
};
