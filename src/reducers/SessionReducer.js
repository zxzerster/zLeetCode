import { LEETCODE_LOGIN, LEETCODE_LOGIN_SUCCESS, LEETCODE_LOGIN_FAILED } from '../actions/types';

const INITIAL_STATE = {
    loading: false,
    username: '',
    LEETCODE_SESSION: '',
    csrftoken: '',
    errors: ''
}

export default SessionReducer = (state = INITIAL_STATE, action) => {
    switch(action.type) {
        case LEETCODE_LOGIN:
            return {...INITIAL_STATE, loading: true};
        case LEETCODE_LOGIN_SUCCESS:
            return {...state, ...action.payload, loading: false};
        case LEETCODE_LOGIN_FAILED:
            return {...INITIAL_STATE};
        default:
            return state;
    }
};    