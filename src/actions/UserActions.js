import {
    LEETCODE_USERPROFILE, LEETCODE_USERPROFILE_SUCCESS, LEETCODE_USERPROFILE_FAILED,
    LEETCODE_USER_PROGRESS, LEETCODE_USER_PROGRESS_SUCCESS, LEETCODE_USER_PROGRESS_FAILED,
} from './types';
import {
    URLs,
    ERRs,
    leetcodeGraphqlFetch,
    leetcodeGetFetch,
} from '../network';
import { UserProfile } from '../network/query';

export const leetcodeUserProfile = (completionHandler, errorHandler) => {
    return ({ csrftoken, LEETCODE_SESSION }) => dispatch => {
        dispatch({ type: LEETCODE_USERPROFILE });
        leetcodeGraphqlFetch(csrftoken, LEETCODE_SESSION, UserProfile)
        .then(resp => {
            if (resp.status !== 200) {
                dispatch({ type: LEETCODE_USERPROFILE_FAILED });
                if (errorHandler) {
                    errorHandler(ERRs.ERR_NETWORK);
                }

                return;
            }

            resp.json().then(json => {
                dispatch({ type: LEETCODE_USERPROFILE_SUCCESS, payload: json.data });
                if (completionHandler) {
                    completionHandler(true);
                }
            });
        })
        .catch(error => {
            dispatch({ type: LEETCODE_USERPROFILE_FAILED, error });
            if (errorHandler) {
                errorHandler(`error: ${error}`);
            }
        });
    };
};

export const leetcodeUserProgress = (completionHandler, errorHandler) => {
    return ({ csrftoken, LEETCODE_SESSION }) => dispatch => {
        dispatch({ type: LEETCODE_USER_PROGRESS });
        leetcodeGetFetch(URLs.progress, csrftoken, LEETCODE_SESSION)
        .then(resp => {
            if (resp.status !== 200) {
                dispatch({ type: LEETCODE_USER_PROGRESS_FAILED, error: ERRs.ERR_NETWORK });
                if (errorHandler) {
                    errorHandler(ERRs.ERR_NETWORK);
                }
            } else {
                return resp.json();
            }
        })
        .then(json => {
            dispatch({ type: LEETCODE_USER_PROGRESS_SUCCESS, payload: json });
            if (completionHandler) {
                completionHandler(true);
            }
        })
        .catch(error => {
            dispatch({ type: LEETCODE_USER_PROGRESS_FAILED, error });
            if (errorHandler) {
                errorHandler(`error: ${error}`);
            }
        });
    };
};
