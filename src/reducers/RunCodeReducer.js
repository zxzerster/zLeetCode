import { LEETCODE_RUN_CODE, LEETCODE_RUN_CODE_SUCCESS, LEETCODE_RUN_CODE_FAILED } from '../actions/types';

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
    }
}

export default (state, action) => {
    switch(action.type) {
        case LEETCODE_RUN_CODE:
            return { ...initialState, loading: true };
        case LEETCODE_RUN_CODE_SUCCESS:
            return { loading: false, error: null, result: action.payload };
        case LEETCODE_RUN_CODE_FAILED:
            return { ...initialState, loading: false, error: action.error };
        default:
            return initialState;
    }
};