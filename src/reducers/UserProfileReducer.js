import {
    LEETCODE_USERPROFILE, LEETCODE_USERPROFILE_SUCCESS, LEETCODE_USERPROFILE_FAILED, LEETCODE_CLEAN_USERPROFILE,
} from '../actions/types';

const INITIAL_STATE = {
    // Data
    user: {
        isCurrentUserPremium: false,
        profile: {
            userSlug: '--',
            realName: '---',
            aboutMe: '--',
            reputation: 0,
            occupation: '--',
            countryName: '--',
            school: '--',
            company: '--',
            location: '--',
            lastModified: '--',
            userAvatar: '--',
            gender: '--',
            acStats: {
                acQuestionCount: 0,
                acSubmissionCount: 0,
                totalSubmissionCount: 0,
                acRate: 0,
            },
        },
    },
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case LEETCODE_USERPROFILE:
            return { ...state };
        case LEETCODE_USERPROFILE_SUCCESS:
            if (!action.payload.user) {
                return INITIAL_STATE;
            }

            return {
                ...state,
                ...action.payload,
            };
        case LEETCODE_USERPROFILE_FAILED:
            return { ...INITIAL_STATE };
        case LEETCODE_CLEAN_USERPROFILE:
            return { ...INITIAL_STATE };
        default:
            return state;
    }
};
