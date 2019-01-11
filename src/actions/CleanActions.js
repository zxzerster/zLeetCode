import {
    LEETCODE_CLEAN_ALL_PROBLEMS, LEETCODE_CLEAN_USERPROFILE, LEETCODE_CLEAN_USER_PROGRESS,
} from './types';

export const leetcodeCleanAllProblems = () => {
    return { type: LEETCODE_CLEAN_ALL_PROBLEMS };
};

export const leetcodeCleanUserProgress = () => {
    return { type: LEETCODE_CLEAN_USER_PROGRESS };
};

export const leetcodeCleanUserProfile = () => {
    return { type: LEETCODE_CLEAN_USERPROFILE };
};
