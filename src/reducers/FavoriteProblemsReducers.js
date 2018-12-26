import { LEETCODE_FAVORITES_PROBLEMS, LEETCODE_FAVORITES_PROBLEMS_SUCCESS, LEETCODE_FAVORITES_PROBLEMS_FAILED } from '../actions/types';

const INITIAL_STATE = {
    favoritesLists: {
        publicFavorites: [],
        privateFavorites: [],
    },
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case LEETCODE_FAVORITES_PROBLEMS:
            return { ...state };
        case LEETCODE_FAVORITES_PROBLEMS_SUCCESS:
            return { ...state, ...action.payload };
        case LEETCODE_FAVORITES_PROBLEMS_FAILED:
            return { ...INITIAL_STATE };
        default:
            return { ...state };
    }
};