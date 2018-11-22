import { LEETCODE_ALL_PROBLEMS, LEETCODE_ALL_PROBLEMS_SUCCESS, LEETCODE_ALL_PROBLEMS_FAILED } from '../actions/types';

const INITIAL_STATE = {
    // UI
    loading: false,
    error: null,
    // Data
    allQuestions: null,
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case LEETCODE_ALL_PROBLEMS:
            return { ...INITIAL_STATE, loading: true, error: null };
        case LEETCODE_ALL_PROBLEMS_SUCCESS:
        return {
            ...state,
            allQuestions: action.payload,
            loading: false,
            error: null,
        };
        case LEETCODE_ALL_PROBLEMS_FAILED:
            return { ...INITIAL_STATE, loading: false, error: action.error };
        default:
            return state;
    }
};
