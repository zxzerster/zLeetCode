import {
    LEETCODE_LOGIN, LEETCODE_LOGIN_SUCCESS, LEETCODE_LOGIN_FAILED,
    LEETCODE_LOGOUT, LEETCODE_LOGOUT_SUCCESS, LEETCODE_LOGOUT_FAILED,
} from './types';
import { UserStatus } from '../network/query';
import {
    URLs,
    getCookieValue,
    leetcodeGetFetch,
    leetcodePostFetch,
    leetcodeGraphqlFetch,
} from '../network';

export const leetcodeLogin = (username, password) => {
    return ({ csrftoken, LEETCODE_SESSION }) => dispatch => {
        dispatch({ type: LEETCODE_LOGIN });

        // Check validation of saved csrftoken & LEETCODE_SESSION first
        leetcodeGraphqlFetch(csrftoken, LEETCODE_SESSION, UserStatus)
        .then(resp => {
            if (resp.status !== 200) {
                return leetcodeGetFetch(URLs.login);
            }

            resp.json().then(json => {
                const { isSignedIn } = json.data.userStatus;

                if (isSignedIn) {
                    dispatch({ type: LEETCODE_LOGIN_SUCCESS });

                    return Promise.resolve();
                }

                return leetcodeGetFetch(URLs.login);
            });

            return Promise.resolve();
        })
        .then(resp => {
            return getCookieValue(resp.headers.map, 'csrftoken');
        })
        .then(token => {
            if (token) {
                return leetcodePostFetch(URLs.login, csrftoken, LEETCODE_SESSION, {
                    csrfmiddlewaretoken: token,
                    login: username,
                    password,
                }, true, {
                    Cookie: `csrftoken=${token};`,
                });
            }

            return Promise.resolve();
        })
        .then(resp => {
            if (resp) {
                // Extract csrftoken & LEETCODE_SESSION
                const t = getCookieValue(resp.headers.map, 'csrftoken');
                const s = getCookieValue(resp.headers.map, 'LEETCODE_SESSION');
                const payload = {
                    csrftoken: t,
                    LEETCODE_SESSION: s,
                };

                if (t && s) {
                    dispatch({ type: LEETCODE_LOGIN_SUCCESS, payload });
                } else {
                    dispatch({ type: LEETCODE_LOGIN_FAILED });
                }
            }
        })
        .catch(error => {
            dispatch({ type: LEETCODE_LOGIN_FAILED, error });
        });
    };
};

export const leetcodeLogout = () => {
    return ({ csrftoken, LEETCODE_SESSION }) => dispatch => {
        dispatch({ type: LEETCODE_LOGOUT });
        leetcodeGetFetch(URLs.logout, csrftoken, LEETCODE_SESSION)
        .then(resp => {
            if (resp.status !== 200) {
                dispatch({ type: LEETCODE_LOGOUT_FAILED });

                return Promise.resolve();
            }

            dispatch({ type: LEETCODE_LOGOUT_SUCCESS });

            return Promise.resolve();
        })
        .catch(error => {
            dispatch({ type: LEETCODE_LOGOUT_FAILED, error });
        });
    };
};

/** I don't use this because I failed to handle 302 reidrect on iOS */
// const getLogin = (csrftoken, LEETCODE_SESSION) => {
//     return (dispatch) => {
//         dispatch({type: LEETCODE_LOGIN});

//         const headers = {
//             'Cookie': `csrftoken=${csrftoken};LEETCODE_SESSION=${LEETCODE_SESSION};`
//         };
//         fetch(Url.login, {
//             method: 'get',
//             credentials: 'omit',
//             redirect: 'manual',
//             headers
//         })
//         .then(resp => {
//             debugger;
//         })
//         .then(error => {
//             debugger;
//         })
//     }
// }
