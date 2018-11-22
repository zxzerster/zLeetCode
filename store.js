import thunk from 'redux-thunk';
import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { createLogger } from 'redux-logger';
import { persistStore } from 'redux-persist';
// import storage from 'redux-persist/lib/storage';
import rootReducer from './src/reducers';
import leetcodeMiddleware from './middleware';

const logger = createLogger({ collapsed: true });
const middleware = [leetcodeMiddleware, thunk, logger];
// const persistConfig = {
//   key: 'root',
//   storage,
//   whitelist: ['session'],
// };
// const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = createStore(rootReducer, {}, composeWithDevTools(
  applyMiddleware(...middleware)
));
export const persistor = persistStore(store);
