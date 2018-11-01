import { LEETCODE_ALL_PROBLEMS, LEETCODE_ALL_PROBLEMS_SUCCESS, LEETCODE_ALL_PROBLEMS_FAILED } from '../actions/types';

const initialState = {
    loading: false,
    error: null,
    data: []
}

export default (state = initialState, action) => {
    switch(action.type) {
        case LEETCODE_ALL_PROBLEMS:
            return {...initialState, loading: true};
        case LEETCODE_ALL_PROBLEMS_SUCCESS:
            return {loading: false, data: action.payload, error: null};
        case LEETCODE_ALL_PROBLEMS_FAILED:
            return {...initialState, error: action.error};
        default:
            return state;
    }
}