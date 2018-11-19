import {
    LEETCODE_LOGIN, LEETCODE_LOGIN_SUCCESS, LEETCODE_LOGIN_FAILED,
    LEETCODE_LOGOUT, LEETCODE_LOGOUT_SUCCESS, LEETCODE_LOGOUT_FAILED,
} from './types';
import { UserStatus } from '../network/query';
import {
    getCookieValue,
    leetcodeGetFetch,
    leetcodePostFetch,
    leetcodeGraphqlFetch,
} from '../network';

export const login = (username, password) => {
    return ({ csrftoken, LEETCODE_SESSION }) => dispatch => {
        dispatch({ type: LEETCODE_LOGIN });

        // Check validation of saved csrftoken & LEETCODE_SESSION first
        leetcodeGraphqlFetch(csrftoken, LEETCODE_SESSION, UserStatus)
        .then(resp => {
            if (resp.status !== 200) {
                return leetcodeGetFetch('https://leetcode.com/accounts/login/');
            }

            resp.json().then(json => {
                const { isSignedIn } = json.data.userStatus;

                if (isSignedIn) {
                    dispatch({ type: LEETCODE_LOGIN_SUCCESS });
                } else {
                    return leetcodeGetFetch('https://leetcode.com/accounts/login/');
                }
            });

            return Promise.resolve();
        })
        .then(resp => {
            return getCookieValue(resp.headers.map, 'csrftoken');
        })
        .then(token => {
            if (token) {
                return leetcodePostFetch('https://leetcode.com/accounts/login/', csrftoken, LEETCODE_SESSION, {
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
                }

                if (t && s) {
                    dispatch({ type: LEETCODE_LOGIN_SUCCESS, payload });
                } else {
                    dispatch({ type: LEETCODE_LOGIN_FAILED });
                }
            }
        })
        .catch(err => {
            dispatch({ type: LEETCODE_LOGIN_FAILED });
        });
    };
};

export const logout = () => {
    return ({ csrftoken, LEETCODE_SESSION }) => dispatch => {
        dispatch({ type: LEETCODE_LOGOUT });
        debugger;
        leetcodeGetFetch('https://leetcode.com/accounts/logout/', csrftoken, LEETCODE_SESSION)
        .then(resp => {
            debugger;
        })
        .catch(err => {
            debugger;
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

