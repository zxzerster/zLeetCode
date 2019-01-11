import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import autoMergeLevel2 from 'redux-persist/es/stateReconciler/autoMergeLevel2';
import storage from 'redux-persist/lib/storage';

import SessionReducer from './SessionReducer';
import UserProfileReducer from './UserProfileReducer';
import ProblemsReducer from './ProblemsReducer';
import ProblemDetailsReducer from './ProblemDetailsReducer';
import RunCodeReducer from './RunCodeReducer';
import SubmitCodeReducer from './SubmitCodeReducer';
import SubmissionsReducer from './SubmissionsReducer';
import CodeDefinitionReducer from './CodeDefinitionReducer';
import UserProgressReducer from './UserProgressReducer';
import AllTagsReducer from './AllTagsReducer';
import FavoriteProblemsReducer from './FavoriteProblemsReducers';

const rootPersistConfig = {
  key: 'root',
  storage,
  whitelist: ['session.csrftoken', 'session.LEETCODE_SESSION'],
  stateReconciler: autoMergeLevel2,
};

const sessionPersistConfig = {
    key: 'session',
    storage,
    whitelist: ['csrftoken', 'LEETCODE_SESSION', 'username'],
    blacklist: ['error'],
};

const problemsPersistConfig = {
    key: 'problems',
    storage,
    whitelist: ['allQuestions'],
};

const profilePersistConfig = {
    key: 'profile',
    storage,
    stateReconciler: autoMergeLevel2,
};

const progressPersistConfig = {
    key: 'progress',
    storage,
};

const tagsPersistConfig = {
    key: 'tags',
    storage,
};

export default persistReducer(rootPersistConfig, combineReducers({
    session: persistReducer(sessionPersistConfig, SessionReducer),
    profile: persistReducer(profilePersistConfig, UserProfileReducer),
    progress: persistReducer(progressPersistConfig, UserProgressReducer),
    tags: persistReducer(tagsPersistConfig, AllTagsReducer),
    problems: persistReducer(problemsPersistConfig, ProblemsReducer),
    problem: ProblemDetailsReducer,
    runcode: RunCodeReducer,
    submitcode: SubmitCodeReducer,
    submissions: SubmissionsReducer,
    codeDefinition: CodeDefinitionReducer,
    favorites: FavoriteProblemsReducer,
}));
