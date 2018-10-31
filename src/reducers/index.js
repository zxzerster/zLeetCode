import { combineReducers } from 'redux';
import SessionReducer from './SessionReducer';
import UserProfileReducer from './UserProfileReducer';

export default combineReducers({
   session: SessionReducer,
   profile: UserProfileReducer
//    route: RouteReducer
});