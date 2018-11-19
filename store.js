import thunk from 'redux-thunk';
import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { createLogger } from 'redux-logger';
import rootReducer from './src/reducers';
import leetcodeMiddleware from './middleware';

const logger = createLogger({ collapsed: true });
const middleware = [leetcodeMiddleware, thunk, logger];

const store = createStore(rootReducer, {}, composeWithDevTools(
  applyMiddleware(...middleware)
));

export default store;
