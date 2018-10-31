import { LEETCODE_USERPROFILE, LEETCODE_USERPROFILE_SUCCESS, LEETCODE_USERPROFILE_FAILED } from '../actions/types';

const INITIAL_STATE = {
    loading: false,
    userSlug: '',
    realName: '',
    aboutMe: '',
    country: '',
    location: '',
    lastModified: '',
    userAvatar: '',
    acStats: {
        acQuestionCount: 0,
        acSubmissionCount: 0,
        totalSubmissionCount: 0,
        acRate: 0
    }
}

export default UserProfilerReducer = (state = INITIAL_STATE, action) => {
    switch(action.type) {
        case LEETCODE_USERPROFILE:
            return {...INITIAL_STATE, loading: true};
        case LEETCODE_USERPROFILE_SUCCESS:
            return {...state, ...action.payload, loading: false};
        case LEETCODE_USERPROFILE_FAILED:
            return {...INITIAL_STATE};
        default:
            return state;
    }
};    