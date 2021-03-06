import {
    LEETCODE_LOGIN, LEETCODE_LOGIN_SUCCESS, LEETCODE_LOGIN_FAILED,
    LEETCODE_SOCIAL_LOGIN,
    LEETCODE_LOGOUT, LEETCODE_LOGOUT_SUCCESS, LEETCODE_LOGOUT_FAILED,
} from './types';
import { UserStatus } from '../network/query';
import {
    URLs,
    ERRs,
    getCookieValue,
    leetcodeNetworkRequester,
    leetcodeGetFetch,
    leetcodePostFetch,
    leetcodeGraphqlFetch,
} from '../network';

export const leetcodeVerfifySession = (completionHandler, errorHandler) => {
    return ({ csrftoken, LEETCODE_SESSION }) => () => {
        leetcodeNetworkRequester(
            leetcodeGraphqlFetch,
            { csrftoken, LEETCODE_SESSION },
            [UserStatus],
            {
                callback: () => { },
                successCallback: json => {
                    const { isSignedIn } = json.data.userStatus;

                    if (isSignedIn) {
                        completionHandler(true);
                    } else {
                        completionHandler(false);
                    }
                },
                failCallback: error => {
                    errorHandler(error);
                },
            },
        );
    };
};

export const leetcodeSocialLogin = (csrftoken, LEETCODE_SESSION) => {
    return {
        type: LEETCODE_SOCIAL_LOGIN,
        payload: { csrftoken, LEETCODE_SESSION },
    };
};

export const leetcodeLogin = (username, password, completionHandler, errorHandler) => {
    return ({ csrftoken, LEETCODE_SESSION }) => dispatch => {
        dispatch({ type: LEETCODE_LOGIN });
        // Check validation of saved csrftoken & LEETCODE_SESSION first
        leetcodeGetFetch(null, null, URLs.login)
        .then(resp => {
            return getCookieValue(resp.headers.map, 'csrftoken');
        })
        .then(token => {
            if (token) {
                return leetcodePostFetch(csrftoken, LEETCODE_SESSION, URLs.login, {
                    csrfmiddlewaretoken: token,
                    login: username,
                    password,
                }, 1000 * 60 * 2, true, {
                    Cookie: `;csrftoken=${token};`,
                    'X-CSRFTOKEN': token,
                });
            }

            return Promise.resolve();
        })
        .then(resp => {
            if (resp) {
                if (resp.status !== 200) {
                    try {
                        return resp.json();
                    } catch (error) {
                        Promise.reject(Error('Unknown error'));
                    }
                }
                // Extract csrftoken & LEETCODE_SESSION
                const t = getCookieValue(resp.headers.map, 'csrftoken');
                const s = getCookieValue(resp.headers.map, 'LEETCODE_SESSION');

                if (t && s) {
                    const payload = {
                        csrftoken: t,
                        LEETCODE_SESSION: s,
                        username,
                    };

                    dispatch({ type: LEETCODE_LOGIN_SUCCESS, payload });
                    completionHandler();

                    return null;
                }

                if (!s) {
                    errorHandler('Try Again');

                    return null;
                }

                return resp.json();
            }
        })
        .then(json => {
            if (json) {
                // Handle errors here
                const { errors, fields } = json.form;
                let error = 'Unknown errors';

                if (errors) {
                    if (errors.length >= 1) {
                        [error] = errors;
                    } else if (errors.length === 0 && fields) {
                        const { login } = fields;

                        if (login.errors && login.errors.length > 0) {
                            error = 'User name and/or Password are required';
                        }

                        if (fields.password.errors && fields.password.errors.length > 0) {
                            error = 'User name and/or Password are required';
                        }
                    }
                }

                dispatch({ type: LEETCODE_LOGIN_FAILED, error });
                errorHandler(`${error}`);
            }
        })
        .catch(error => {
            dispatch({ type: LEETCODE_LOGIN_FAILED, error });
            errorHandler(`${error}`);
        });
    };
};

export const leetcodeLogout = (completionHandler, errorHandler) => {
    return ({ csrftoken, LEETCODE_SESSION }) => dispatch => {
        dispatch({ type: LEETCODE_LOGOUT });
        leetcodeGetFetch(csrftoken, LEETCODE_SESSION, URLs.logout)
        .then(resp => {
            if (resp.status !== 200) {
                dispatch({ type: LEETCODE_LOGOUT_FAILED });
                if (errorHandler) {
                    errorHandler(ERRs.ERR_NETWORK);
                }

                return;
            }

            dispatch({ type: LEETCODE_LOGOUT_SUCCESS });
            if (completionHandler) {
                completionHandler(true);
            }
        })
        .catch(error => {
            dispatch({ type: LEETCODE_LOGOUT_FAILED, error });
            if (errorHandler) {
                errorHandler(`${error}`);
            }
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
