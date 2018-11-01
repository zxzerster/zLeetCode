import { LEETCODE_PROBLEM, LEETCODE_PROBLEM_SUCCESS, LEETCODE_PROBLEM_FAILED } from '../actions/types';

const initialState = {
    loading: false,
    error: null,
    data: {title: '', content: ''}
}

export default (state = initialState, action) => {
    switch(action.type) {
        case LEETCODE_PROBLEM:
            return {...initialState, loading: true};
        case LEETCODE_PROBLEM_SUCCESS:
            return {loading: false, data: action.payload, error: null};
        case LEETCODE_PROBLEM_FAILED:
            return {...initialState, error: action.error};
        default:
            return state;
    }
}