import { LEETCODE_PROBLEM, LEETCODE_PROBLEM_SUCCESS, LEETCODE_PROBLEM_FAILED } from '../actions/types';

const INITIAL_STATE = {
    // UI
    loading: false,
    error: null,
    // Data
    question: null,
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case LEETCODE_PROBLEM:
            return { ...INITIAL_STATE, loading: true, error: null };
        case LEETCODE_PROBLEM_SUCCESS:
            return {
                ...state,
                ...action.payload,
                loading: false,
                error: null,
            };
        case LEETCODE_PROBLEM_FAILED:
            return { ...INITIAL_STATE, loading: false, error: action.error };
        default:
            return state;
    }
};
