import {
    LEETCODE_CODE_DEFINITION, LEETCODE_CODE_DEFINITION_SUCCESS, LEETCODE_CODE_DEFINITION_FAILED, LEETCODE_CODE_DEFINITION_SELECTED_INDEX
} from '../actions/types';

const INITIAL_STATE = {
    // Data
    allQuestions: [],
    selectedIndex: 0,
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case LEETCODE_CODE_DEFINITION:
            return { ...state };
        case LEETCODE_CODE_DEFINITION_SUCCESS:
            return {
                ...state,
                allQuestions: action.payload,
            };
        case LEETCODE_CODE_DEFINITION_SELECTED_INDEX:
            return {
                ...state,
                selectedIndex: action.payload,
                loading: false,
                error: null,
            };
        case LEETCODE_CODE_DEFINITION_FAILED:
            return { ...INITIAL_STATE };
        default:
            return state;
    }
};
