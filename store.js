import thunk from 'redux-thunk';
import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { createLogger } from 'redux-logger';
import { persistStore } from 'redux-persist';
import rootReducer from './src/reducers';
import leetcodeMiddleware from './middleware';

const logger = createLogger({ collapsed: true });
const middleware = [leetcodeMiddleware, thunk, logger];

export const store = createStore(rootReducer, {}, composeWithDevTools(
  applyMiddleware(...middleware)
));
export const persistor = persistStore(store);
