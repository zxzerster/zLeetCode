import { LEETCODE_RUN_CODE, LEETCODE_RUN_CODE_SUCCESS, LEETCODE_RUN_CODE_FAILED } from '../actions/types';
import { LEETCODE_EXPECTED_RESULT_SUCCESS, LEETCODE_EXPECTED_RESULT_FAILED } from '../actions/types';

const initialState = {
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
        state: null
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
        state: null
    }
}

export default (state = initialState, action) => {
    switch(action.type) {
        case LEETCODE_RUN_CODE:
            return { ...initialState, loading: true };
        case LEETCODE_RUN_CODE_SUCCESS:
            let expected = state.expected.state;
            let runcodeLoading = !(expected === 'SUCCESS');
            return { ...state, loading: runcodeLoading, error: null, result: action.payload };
        case LEETCODE_EXPECTED_RESULT_SUCCESS:
            let result = state.result.state;
            let expectedLoading = !(result === 'SUCCESS');
            return { ...state, loading: expectedLoading, error: null, expected: action.payload };
        case LEETCODE_RUN_CODE_FAILED:
        case LEETCODE_EXPECTED_RESULT_FAILED:
            return { ...initialState, loading: false, error: action.error, result: initialState.result, expected: initialState.expected };
        default:
            return state;
    }
};