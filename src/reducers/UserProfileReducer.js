import { LEETCODE_USERPROFILE, LEETCODE_USERPROFILE_SUCCESS, LEETCODE_USERPROFILE_FAILED } from '../actions/types';

const INITIAL_STATE = {
    // UI
    loading: true,
    error: null,
    // Data
    user: {
        userSlug: null,
        realName: null,
        aboutMe: null,
        country: null,
        location: null,
        lastModified: null,
        userAvatar: null,
        acStats: {
            acQuestionCount: null,
            acSubmissionCount: null,
            totalSubmissionCount: null,
            acRate: null,
        },
    },
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case LEETCODE_USERPROFILE:
            return { ...INITIAL_STATE, loading: true, error: null };
        case LEETCODE_USERPROFILE_SUCCESS:
            return {
                ...state,
                ...action.payload,
                loading: false,
                error: null,
            };
        case LEETCODE_USERPROFILE_FAILED:
            return { ...INITIAL_STATE, loading: false, error: action.error };
        default:
            return state;
    }
};    