import { LEETCODE_SUBMISSIONS, LEETCODE_SUBMISSIONS_SUCCESS, LEETCODE_SUBMISSIONS_FAILED } from '../actions/types';

const INITIAL_STATE = {
    // Data
    submissionList: {
        hasNext: false,
        lastKey: '',
        submissions: [],
    },
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case LEETCODE_SUBMISSIONS:
            return { ...state };
        case LEETCODE_SUBMISSIONS_SUCCESS:
        return {
            ...state,
            submissionList: action.payload,
        };
        case LEETCODE_SUBMISSIONS_FAILED:
            return { ...INITIAL_STATE };
        default:
            return state;
    }
};
