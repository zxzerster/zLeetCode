import { LEETCODE_ALL_PROBLEMS, LEETCODE_ALL_PROBLEMS_SUCCESS, LEETCODE_ALL_PROBLEMS_FAILED } from '../actions/types';

const INITIAL_STATE = {
    // Data
    allQuestions: null,
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case LEETCODE_ALL_PROBLEMS_FAILED:
        case LEETCODE_ALL_PROBLEMS:
            return { ...INITIAL_STATE };
        case LEETCODE_ALL_PROBLEMS_SUCCESS:
        return {
            ...state,
            allQuestions: action.payload,
        };
        default:
            return state;
    }
};
