import { LEETCODE_SUBMIT_CODE, LEETCODE_SUBMIT_CODE_SUCCESS, LEETCODE_SUBMIT_CODE_FAILED } from '../actions/types';

const initialState = {
    loading: false,
    error: null,
    result: {
        code_output: null,
        compare_result: null,
        display_runtime: null,
        judge_type: null,
        lang: null,
        pretty_lang: null,
        question_id: null,
        run_success: null,
        runtime_percentile: null,
        state: null,
        status_code: null,
        status_msg: null,
        status_runtime: null,
        std_output: null,
        submission_id: null,
        total_correct: null,
        total_testcase: null
    }
}

export default (state = initialState, action) => {
    switch(action.type) {
        case LEETCODE_SUBMIT_CODE:
            return { ...initialState, loading: true };
        case LEETCODE_SUBMIT_CODE_SUCCESS:
            return { loading: false, error: null, result: action.payload };
        case LEETCODE_SUBMIT_CODE_FAILED:
            return { ...initialState, loading: false, error: action.error };
        default:
            return state;
    }
};