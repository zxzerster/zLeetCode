import {
    LEETCODE_USERPROFILE, LEETCODE_USERPROFILE_SUCCESS, LEETCODE_USERPROFILE_FAILED,
} from './types';
import {
    ERRs,
    leetcodeGraphqlFetch,
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
