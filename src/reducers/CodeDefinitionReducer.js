import { LEETCODE_CODE_DEFINITION, LEETCODE_CODE_DEFINITION_SUCCESS, LEETCODE_CODE_DEFINITION_FAILED } from '../actions/types';

const INITIAL_STATE = {
    // UI
    loading: false,
    error: null,
    // Data
    allQuestions: null,
    selectedIndex: null,
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case LEETCODE_CODE_DEFINITION:
            return { ...INITIAL_STATE, loading: true, error: null };
        case LEETCODE_CODE_DEFINITION_SUCCESS:
        return {
            ...state,
            allQuestions: action.payload,
            loading: false,
            error: null,
        };
        case LEETCODE_CODE_DEFINITION_FAILED:
            return { ...INITIAL_STATE, loading: false, error: action.error };
        default:
            return state;
    }
};
