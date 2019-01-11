import {
    LEETCODE_ALL_PROBLEMS, LEETCODE_ALL_PROBLEMS_SUCCESS, LEETCODE_ALL_PROBLEMS_FAILED, LEETCODE_CLEAN_ALL_PROBLEMS,
} from '../actions/types';

const INITIAL_STATE = {
    // Data
    allQuestions: null,
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case LEETCODE_ALL_PROBLEMS_FAILED:
            return state;
        case LEETCODE_ALL_PROBLEMS:
            return state;
        case LEETCODE_ALL_PROBLEMS_SUCCESS:
            return {
                ...state,
                allQuestions: action.payload,
            };
        case LEETCODE_CLEAN_ALL_PROBLEMS:
            return { ...INITIAL_STATE };
        default:
            return state;
    }
};
