import {
    LEETCODE_RUN_CODE, LEETCODE_RUN_CODE_SUCCESS, LEETCODE_RUN_CODE_FAILED,
    LEETCODE_EXPECTED_RESULT_SUCCESS, LEETCODE_EXPECTED_RESULT_FAILED,
} from '../actions/types';

const INITIAL_STATE = {
    loading: false,
    error: null,
    result: {
        code_output: null,
        status_code: null,
        lang: null,
        run_success: false,
        runtime_error: null,
        total_correct: null,
        total_testcase: null,
        status_rumtime: null,
        runtime_percentile: null,
        pretty_lang: null,
        submission_id: null,
        status_msg: null,
        state: null,
    },
    expected: {
        status_code: null,
        lang: null,
        code_output: null,
        code_answer: null,
        status_runtime: null,
        display_runtime: null,
        run_success: null,
        total_correct: null,
        total_testcase: null,
        runtime_percentile: null,
        pretty_lang: null,
        submission_id: null,
        status_msg: null,
        state: null,
    },
};

export default (state = INITIAL_STATE, action) => {
    const expected = state.expected.state;
    const runcodeLoading = !(expected === 'SUCCESS');
    const result = state.result.state;
    const expectedLoading = !(result === 'SUCCESS');

    switch (action.type) {
        case LEETCODE_RUN_CODE:
            return { ...INITIAL_STATE, loading: true, error: null };
        case LEETCODE_RUN_CODE_SUCCESS:
            return {
                ...state,
                loading: runcodeLoading,
                error: null,
                result: action.payload,
            };
        case LEETCODE_EXPECTED_RESULT_SUCCESS:
            return {
                ...state,
                loading: expectedLoading,
                error: null,
                expected: action.payload,
            };
        case LEETCODE_RUN_CODE_FAILED:
        case LEETCODE_EXPECTED_RESULT_FAILED:
            return {
                ...INITIAL_STATE,
                loading: false,
                error: action.error,
                result: INITIAL_STATE.result,
                expected: INITIAL_STATE.expected,
            };
        default:
            return state;
    }
};
