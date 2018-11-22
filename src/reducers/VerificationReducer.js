import { LEETCODE_VERIFY_SESSION, LEETCODE_VERIFY_SESSION_SUCCESS, LEETCODE_VERIFY_SESSION_FAILED } from '../actions/types';

const INITIAL_STATE = {
    // UI
    loading: true,
    error: null,
    // Data
    isLoggedIn: null,
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case LEETCODE_VERIFY_SESSION:
            return { ...INITIAL_STATE, loading: true, error: null };
        case LEETCODE_VERIFY_SESSION_SUCCESS:
            return {
                ...state,
                loading: false,
                error: null,
                isLoggedIn: true,
            };
        case LEETCODE_VERIFY_SESSION_FAILED:
            return {
                ...INITIAL_STATE,
                loading: false,
                error: action.error,
                isLoggedIn: false,
            };
        default:
            return state;
    }
};
