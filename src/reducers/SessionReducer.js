import { LEETCODE_LOGIN, LEETCODE_LOGIN_SUCCESS, LEETCODE_LOGIN_FAILED } from '../actions/types';

const INITIAL_STATE = {
    // UI
    loading: null,
    errors: null,
    // Data
    LEETCODE_SESSION: null,
    csrftoken: null,
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case LEETCODE_LOGIN:
            return { ...INITIAL_STATE, loading: true, error: null };
        case LEETCODE_LOGIN_SUCCESS:
            return {
                ...state,
                ...action.payload,
                loading: false,
                error: null,
            };
        case LEETCODE_LOGIN_FAILED:
            return { ...INITIAL_STATE, loading: false, error: action.error };
        default:
            return state;
    }
};
