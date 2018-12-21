import {
    LEETCODE_ALL_PROBLEMS, LEETCODE_ALL_PROBLEMS_SUCCESS, LEETCODE_ALL_PROBLEMS_FAILED,
    LEETCODE_SET_FILTER_PROBLEMS_KEYWORD,
} from '../actions/types';

const INITIAL_STATE = {
    // Data
    allQuestions: null,
    filter: {
        searchKey: '',
        questionIds: [],
        tags: [],
    },
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case LEETCODE_ALL_PROBLEMS_FAILED:
            return { ...state };
        case LEETCODE_ALL_PROBLEMS:
            return state;
        case LEETCODE_ALL_PROBLEMS_SUCCESS:
            return {
                ...state,
                allQuestions: action.payload,
            };
        case LEETCODE_SET_FILTER_PROBLEMS_KEYWORD:
            return {
                ...state,
                ...{
                    filter: {
                        searchKey: action.payload,
                    },
                },
            };
        default:
            return state;
    }
};
