import thunk from 'redux-thunk';
import { createStore, applyMiddleware } from 'redux';
import { persistStore } from 'redux-persist';
import rootReducer from './src/reducers';
import leetcodeMiddleware from './middleware';
import { composeWithDevTools } from 'redux-devtools-extension';
import { createLogger } from 'redux-logger';

const logger = createLogger({ collapsed: true });
let middleware;
let store;

if (__DEV__) {
  middleware = [leetcodeMiddleware, thunk, logger];
  store = createStore(rootReducer, {}, composeWithDevTools(
      applyMiddleware(...middleware)
  ));
} else {
  middleware = [leetcodeMiddleware, thunk];
  store = createStore(rootReducer, {}, applyMiddleware(...middleware));
}

export { store };
export const persistor = persistStore(store);
