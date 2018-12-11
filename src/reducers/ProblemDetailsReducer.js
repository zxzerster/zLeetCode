import { LEETCODE_PROBLEM, LEETCODE_PROBLEM_SUCCESS, LEETCODE_PROBLEM_FAILED } from '../actions/types';

const INITIAL_STATE = {
    // Data
    question: {
        titleSlug: '',
        title: '',
        content: '',
        questionId: '',
        judgeType: '',
        difficulty: '',
        likes: 0,
        dislikes: 0,
        categoryTitle: '',
        stats: '',
        similarQuestions: '',
        topicTags: [],
    },
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case LEETCODE_PROBLEM:
        case LEETCODE_PROBLEM_FAILED:
            return { ...INITIAL_STATE };
        case LEETCODE_PROBLEM_SUCCESS:
            return {
                ...state,
                ...action.payload,
            };
        default:
            return state;
    }
};
