import { combineReducers } from 'redux';
import SessionReducer from './SessionReducer';
import UserProfileReducer from './UserProfileReducer';
import AllProblemsReducer from './AllProblemsReducer';
import ProblemReducer from './ProblemReducer';
import RunCodeReducer from './RunCodeReducer';

export default combineReducers({
    session: SessionReducer,
    profile: UserProfileReducer,
    allProblems: AllProblemsReducer,
    problem: ProblemReducer,
    runcode: RunCodeReducer
});