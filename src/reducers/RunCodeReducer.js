import {
    LEETCODE_RUN_CODE, LEETCODE_RUN_CODE_SUCCESS, LEETCODE_RUN_CODE_FAILED,
    LEETCODE_EXPECTED_RESULT_SUCCESS, LEETCODE_EXPECTED_RESULT_FAILED,
} from '../actions/types';

const INITIAL_STATE = {
    result: {
        code_output: null,
        status_code: null,
        lang: null,
        run_success: false,
        status_rumtime: null,
        full_runtime_error: null,
        // total_correct: null,
        // total_testcase: null,
        // runtime_percentile: null,
        // pretty_lang: null,
        // submission_id: null,
        status_msg: null,
        state: null,
    },
    expected: {
        status_code: null,
        lang: null,
        code_output: null,
        code_answer: null,
        status_runtime: null,
        run_success: null,
        // display_runtime: null,
        // total_correct: null,
        // total_testcase: null,
        // runtime_percentile: null,
        // pretty_lang: null,
        // submission_id: null,
        status_msg: null,
        state: null,
    },
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case LEETCODE_RUN_CODE:
            return { ...state };
        case LEETCODE_RUN_CODE_SUCCESS:
            return {
                ...state,
                result: action.payload,
            };
        case LEETCODE_EXPECTED_RESULT_SUCCESS:
            return {
                ...state,
                expected: action.payload,
            };
        case LEETCODE_RUN_CODE_FAILED:
        case LEETCODE_EXPECTED_RESULT_FAILED:
            return {
                ...INITIAL_STATE,
                result: INITIAL_STATE.result,
                expected: INITIAL_STATE.expected,
            };
        default:
            return state;
    }
};
