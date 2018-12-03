import { LEETCODE_SUBMISSIONS, LEETCODE_SUBMISSIONS_SUCCESS, LEETCODE_SUBMISSIONS_FAILED } from '../actions/types';

const INITIAL_STATE = {
    // UI
    loading: false,
    error: null,
    // Data
    submissionList: null,
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case LEETCODE_SUBMISSIONS:
            return { ...INITIAL_STATE, loading: true, error: null };
        case LEETCODE_SUBMISSIONS_SUCCESS:
        return {
            ...state,
            submissionList: action.payload,
            loading: false,
            error: null,
        };
        case LEETCODE_SUBMISSIONS_FAILED:
            return { ...INITIAL_STATE, loading: false, error: action.error };
        default:
            return state;
    }
};
