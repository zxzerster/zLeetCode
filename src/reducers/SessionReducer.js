import {
    LEETCODE_LOGIN, LEETCODE_LOGIN_SUCCESS, LEETCODE_LOGIN_FAILED,
    LEETCODE_LOGOUT, LEETCODE_LOGOUT_SUCCESS, LEETCODE_LOGOUT_FAILED,
} from '../actions/types';

const INITIAL_STATE = {
    // UI
    loading: null,
    error: null,
    // Data
    LEETCODE_SESSION: null,
    csrftoken: null,
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case LEETCODE_LOGIN:
            return { ...INITIAL_STATE, loading: true, error: null };
        case LEETCODE_LOGOUT:
            return { ...state, loading: true, error: null };
        case LEETCODE_LOGIN_SUCCESS:
            return {
                ...state,
                ...action.payload,
                loading: false,
                error: null,
            };
        case LEETCODE_LOGIN_FAILED:
            return { ...INITIAL_STATE, loading: false, error: action.error };
        case LEETCODE_LOGOUT_SUCCESS:
        case LEETCODE_LOGOUT_FAILED:
            // Please notice that theoratically it's impossible that failed to logout.
            return { ...INITIAL_STATE };
        default:
            return state;
    }
};
