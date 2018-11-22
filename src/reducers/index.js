import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import autoMergeLevel2 from 'redux-persist/es/stateReconciler/autoMergeLevel2';
import storage from 'redux-persist/lib/storage';

import SessionReducer from './SessionReducer';
import VerificationReducer from './VerificationReducer';
import UserProfileReducer from './UserProfileReducer';
import ProblemsReducer from './ProblemsReducer';
import ProblemDetailsReducer from './ProblemDetailsReducer';
import RunCodeReducer from './RunCodeReducer';
import SubmitCodeReducer from './SubmitCodeReducer';


const rootPersistConfig = {
  key: 'root',
  storage,
  whitelist: ['session.csrftoken', 'session.LEETCODE_SESSION'],
  stateReconciler: autoMergeLevel2,
};

const sessionPersistConfig = {
    key: 'session',
    storage,
    whitelist: ['csrftoken', 'LEETCODE_SESSION'],
    blacklist: ['error'],
};

export default persistReducer(rootPersistConfig, combineReducers({
    session: persistReducer(sessionPersistConfig, SessionReducer),
    verification: VerificationReducer,
    profile: UserProfileReducer,
    problems: ProblemsReducer,
    problem: ProblemDetailsReducer,
    runcode: RunCodeReducer,
    submitcode: SubmitCodeReducer,
}));
