import {
    LEETCODE_USERPROFILE, LEETCODE_USERPROFILE_SUCCESS, LEETCODE_USERPROFILE_FAILED,
    LEETCODE_USER_PROGRESS, LEETCODE_USER_PROGRESS_SUCCESS, LEETCODE_USER_PROGRESS_FAILED,
} from './types';
import {
    URLs,
    ERRs,
    leetcodeNetworkRequester,
    leetcodeGraphqlFetch,
    leetcodeGetFetch,
} from '../network';
import { UserProfile } from '../network/query';

export const leetcodeUserProfile = (completionHandler, errorHandler) => {
    return ({ csrftoken, LEETCODE_SESSION }) => dispatch => {
        leetcodeNetworkRequester(
            leetcodeGraphqlFetch,
            { csrftoken, LEETCODE_SESSION },
            [UserProfile],
            {
                callback: () => {
                    dispatch({ type: LEETCODE_USERPROFILE });
                },
                successCallback: json => {
                    dispatch({ type: LEETCODE_USERPROFILE_SUCCESS, payload: json.data });
                    if (completionHandler) {
                        completionHandler(true);
                    }
                },
                failCallback: error => {
                    dispatch({ type: LEETCODE_USERPROFILE_FAILED, error });
                    if (errorHandler) {
                        errorHandler(error);
                    }
                },
            },
        );
    };
};

export const leetcodeUserProgress = (completionHandler, errorHandler) => {
    return ({ csrftoken, LEETCODE_SESSION }) => dispatch => {
        leetcodeNetworkRequester(
            leetcodeGetFetch,
            { csrftoken, LEETCODE_SESSION },
            [URLs.progress],
            {
                callback: () => {
                    dispatch({ type: LEETCODE_USER_PROGRESS });
                },
                successCallback: json => {
                    dispatch({ type: LEETCODE_USER_PROGRESS_SUCCESS, payload: json });
                    if (completionHandler) {
                        completionHandler(true);
                    }
                },
                failCallback: error => {
                    dispatch({ type: LEETCODE_USER_PROGRESS_FAILED, error });
                    if (errorHandler) {
                        errorHandler(error);
                    }
                },
            },
        );
    };
};
