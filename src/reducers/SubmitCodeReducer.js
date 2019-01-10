import { LEETCODE_SUBMIT_CODE, LEETCODE_SUBMIT_CODE_SUCCESS, LEETCODE_SUBMIT_CODE_FAILED } from '../actions/types';

const INITIAL_STATE = {
    result: {
        status_code: -1,
        code_output: '',
        std_output: '',
        compare_result: '',
        memory: 0,
        display_runtime: '',
        question_id: '',
        lang: '',
        judge_type: '',
        run_success: false,
        compile_error: '',
        full_compile_error: '',
        total_correct: null,
        total_testcase: null,
        status_runtime: '',
        runtime_percentile: null,
        pretty_lang: '',
        submission_id: '',
        input_formatted: '',
        input: '',
        expected_output: '',
        status_msg: '',
        state: '',
    },
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case LEETCODE_SUBMIT_CODE:
            return { ...state };
        case LEETCODE_SUBMIT_CODE_SUCCESS:
            return { ...state, result: action.payload };
        case LEETCODE_SUBMIT_CODE_FAILED:
            return { ...INITIAL_STATE, loading: false, error: action.error };
        default:
            return state;
    }
};
