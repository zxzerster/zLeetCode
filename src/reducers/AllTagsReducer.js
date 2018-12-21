import { LEETCODE_ALL_TAGS, LEETCODE_ALL_TAGS_SUCCESS, LEETCODE_ALL_TAGS_FAILED } from '../actions/types';

const INITIAL_STATE = {
    companies: [],
    topics: [],
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case LEETCODE_ALL_TAGS:
            return { ...state };
        case LEETCODE_ALL_TAGS_SUCCESS:
            return { ...state, ...action.payload };
        case LEETCODE_ALL_TAGS_FAILED:
            return { ...INITIAL_STATE };
        default:
            return { ...state };
    }
};
