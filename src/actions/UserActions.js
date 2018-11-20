import {
    LEETCODE_USERPROFILE, LEETCODE_USERPROFILE_SUCCESS, LEETCODE_USERPROFILE_FAILED,
} from './types';
import {
    leetcodeGraphqlFetch,
} from '../network';
import { UserProfile } from '../network/query';

export const leetcodeUserProfile = () => {
    return ({ csrftoken, LEETCODE_SESSION }) => dispatch => {
        dispatch({ type: LEETCODE_USERPROFILE });
        leetcodeGraphqlFetch(csrftoken, LEETCODE_SESSION, UserProfile)
        .then(resp => {
            if (resp.status !== 200) {
                dispatch({ type: LEETCODE_USERPROFILE_FAILED });

                return Promise.resolve();
            }

            resp.json().then(json => {
                dispatch({ type: LEETCODE_USERPROFILE_SUCCESS, payload: json.data });

                return Promise.resolve();
            });

            return Promise.resolve();
        })
        .catch(error => {
            dispatch({ type: LEETCODE_USERPROFILE_FAILED, error });
        });
    };
};
