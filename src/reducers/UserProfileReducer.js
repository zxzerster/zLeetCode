import { LEETCODE_USERPROFILE, LEETCODE_USERPROFILE_SUCCESS, LEETCODE_USERPROFILE_FAILED } from '../actions/types';

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
                acQuestionCount: -1,
                acSubmissionCount: -1,
                totalSubmissionCount: -1,
                acRate: -1,
            },
        },
    },
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case LEETCODE_USERPROFILE:
            return { ...INITIAL_STATE };
        case LEETCODE_USERPROFILE_SUCCESS:
            return {
                ...state,
                ...action.payload,
            };
        case LEETCODE_USERPROFILE_FAILED:
            return { ...INITIAL_STATE };
        default:
            return state;
    }
};    