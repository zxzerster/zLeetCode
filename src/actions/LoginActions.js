import {
    LEETCODE_LOGIN, LEETCODE_LOGIN_SUCCESS, LEETCODE_LOGIN_FAILED,
    LEETCODE_LOGOUT, LEETCODE_LOGOUT_SUCCESS, LEETCODE_LOGOUT_FAILED,
} from './types';
import { UserStatus } from '../network/query';
import {
    URLs,
    ERRs,
    getCookieValue,
    leetcodeGetFetch,
    leetcodePostFetch,
    leetcodeGraphqlFetch,
} from '../network';

export const leetcodeVerfifySession = (completionHandler, errorHandler) => {
    return ({ csrftoken, LEETCODE_SESSION }) => () => {
        leetcodeGraphqlFetch(csrftoken, LEETCODE_SESSION, UserStatus)
        .then(resp => {
            /** For some unknown reason, network call failed */
            if (resp.status !== 200) {
                errorHandler(ERRs.ERR_NETWORK`: ${resp.status}`);

                return;
            }

            resp.json().then(json => {
                const { isSignedIn } = json.data.userStatus;

                if (isSignedIn) {
                    completionHandler(true);

                    return;
                }
                completionHandler(false);
            })
            .catch(error => {
                errorHandler(`error: ${error}`);
            });
        })
        .catch(error => {
            /** This error should never happned, we need investigate this kind of error if it happens */
            errorHandler(`${error}`);
        });
    };
};

export const leetcodeLogin = (username, password, completionHandler, errorHandler) => {
    return ({ csrftoken, LEETCODE_SESSION }) => dispatch => {
        dispatch({ type: LEETCODE_LOGIN });
        // Check validation of saved csrftoken & LEETCODE_SESSION first
        leetcodeGetFetch(URLs.login)
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

                if (t && s) {
                    const payload = {
                        csrftoken: t,
                        LEETCODE_SESSION: s,
                    };

                    dispatch({ type: LEETCODE_LOGIN_SUCCESS, payload });
                    completionHandler();

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
            errorHandler(`error: ${error}`);
        });
    };
};

export const leetcodeLogout = (completionHandler, errorHandler) => {
    return ({ csrftoken, LEETCODE_SESSION }) => dispatch => {
        dispatch({ type: LEETCODE_LOGOUT });
        leetcodeGetFetch(URLs.logout, csrftoken, LEETCODE_SESSION)
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
                errorHandler(`error: ${error}`);
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
