import {
    LEETCODE_LOGIN, LEETCODE_LOGIN_SUCCESS, LEETCODE_LOGIN_FAILED,
    LEETCODE_SOCIAL_LOGIN,
    LEETCODE_LOGOUT, LEETCODE_LOGOUT_SUCCESS, LEETCODE_LOGOUT_FAILED,
} from '../actions/types';

const INITIAL_STATE = {
    // Data
    LEETCODE_SESSION: '',
    csrftoken: '',
    username: '',
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case LEETCODE_LOGIN:
            return { ...state };
        case LEETCODE_LOGOUT:
            return { ...state };
        case LEETCODE_LOGIN_SUCCESS:
            return {
                ...state,
                ...action.payload,
            };
        case LEETCODE_LOGIN_FAILED:
            return { ...INITIAL_STATE };
        case LEETCODE_SOCIAL_LOGIN: {
            const { csrftoken, LEETCODE_SESSION } = action.payload;

            return { ...state, csrftoken, LEETCODE_SESSION };
        }
        case LEETCODE_LOGOUT_SUCCESS:
        case LEETCODE_LOGOUT_FAILED:
            // Please note that theoratically it's impossible that failed to logout.
            return { ...state, ...{ LEETCODE_SESSION: '', csrftoken: '' } };
        default:
            return state;
    }
};
