import { LEETCODE_USER_PROGRESS, LEETCODE_USER_PROGRESS_SUCCESS, LEETCODE_USER_PROGRESS_FAILED } from '../actions/types';

const INITIAL_STATE = {
    XP: 0,
    attempted: 0,
    leetCoins: 0,
    questionTotal: 0,
    sessionList: [],
    sessionName: '',
    solvedPerDifficulty: {
        Easy: 0,
        Hard: 0,
        Medium: 0,
    },
    solvedTotal: 0,
    unsolved: 0,
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case LEETCODE_USER_PROGRESS:
            return { ...state };
        case LEETCODE_USER_PROGRESS_SUCCESS:
            return { ...state, ...action.payload };
        case LEETCODE_USER_PROGRESS_FAILED:
            return { ...INITIAL_STATE };
        default:
            return state;
    }
};
