import { LEETCODE_LOGIN, LEETCODE_LOGIN_SUCCESS, LEETCODE_LOGIN_FAILED } from './types';
import { LEETCODE_LOGOUT, LEETCODE_LOGOUT_SUCCESS, LEETCODE_LOGOUT_FAILED } from './types';
import _ from 'lodash';
import { Actions } from 'react-native-router-flux';

import * as NetworkUtils from '../utils/NetworkUtils';
import Config from '../utils/Config';

const { Url } = Config;

export const leetcodeLogin = (username, password, csrftoken, LEETCODE_SESSION) => {
    return (dispatch) => {
        // Load spinner
        dispatch({type:LEETCODE_LOGIN});
        verifyLoginStatus(csrftoken || '', LEETCODE_SESSION || '')
        .then(resp => {
            if (resp.status != 200) {
                return postLogin(username || '', password || '')
            } else {
                // Still need check crsftoken / LEETCODE valid or not
                const userStatus = JSON.parse(resp._bodyText).data.userStatus;
                if (userStatus && userStatus.isSignedIn) {
                    console.log('log 1');
                    dispatch({type: LEETCODE_LOGIN_SUCCESS, payload: {
                        csrftoken, LEETCODE_SESSION, username
                    }});
                    return Promise.reject();
                } else {
                    return postLogin(username || '', password || '');
                }
            }
        })
        .then(resp => {
            if (resp && resp.status === 200) {
                const csrftoken = NetworkUtils.getCookieValue(resp.headers.map, 'csrftoken');
                const LEETCODE_SESSION = NetworkUtils.getCookieValue(resp.headers.map, 'LEETCODE_SESSION');
                console.log('log 2');
                dispatch({type: LEETCODE_LOGIN_SUCCESS, payload: {
                    csrftoken, LEETCODE_SESSION, username
                }});
                // Jump to App main
                Actions.main();
            } else {
                let errs = _.reduce(JSON.parse(resp._bodyText).form.errors, (errors, error) => {
                    errors += `${error} `;
                    return errors;
                }, '');

                errs += _.reduce(JSON.parse(resp._bodyText).form.fields.login.errors, (errors, error) => {
                    errors += `${error} [Username]`
                    return errors;
                }, errs);

                errs += _.reduce(JSON.parse(resp._bodyText).form.fields.password.errors, (errors, error) => {
                    errors += `${error} [Password]`
                    return errors;
                }, errs);

                dispatch({type: LEETCODE_LOGIN_FAILED, payload: {
                    errors: errs
                }})
            }            
        })
        .catch(error => {
            if (error) {
                console.log(`error: ${error}`);
                const errors = 'Unknown errors!';
                dispatch({type: LEETCODE_LOGIN_FAILED, payload: {
                    errors
                }})
            }   
        });
    }
}

export const leetcodeLogout = (csrftoken, LEETCODE_SESSION) => {
    return (dispatch) => {
        dispatch({type: LEETCODE_LOGOUT});
        const headers = {
            'Origin': Url.base,
            'Referer': Url.login,
            'Cookie': `csrftoken=${csrftoken};LEETCODE_SESSION=${LEETCODE_SESSION}`
        }
        fetch(Url.logout, {
            method: 'get',
            credentials: 'omit',
            redirect: 'manual',
            headers
        })
        .then(resp => {
            console.log(`logout resp: ${resp}`);
            debugger;
            dispatch({type:LEETCODE_LOGOUT_SUCCESS, payload: {csrftoken: '', LEETCODE_SESSION: ''}});
        })
        .catch(error => {
            console.log(`logout error: ${error}`);
            debugger;
            dispatch({type:LEETCODE_LOGOUT_FAILED, payload: {csrftoken: '', LEETCODE_SESSION: ''}});
        });
    }
}


const verifyLoginStatus = (csrftoken, LEETCODE_SESSION) => {
    const headers = {
        credentials: 'omit',
        origin: Url.base,
        referer: Url.login,
        cookie: `csrftoken=${csrftoken}; LEETCODE_SESSION=${LEETCODE_SESSION};`,
        'X-csrftoken': csrftoken,
        'Content-Type': 'application/json'
    };

    const query = {
        query: [
            '{',
            '   userStatus {',
            '       isSignedIn',
            '       username',
            '       realName',
            '   }',
            '}'
        ].join('\n'),
        variables: {}
    }
    

    return fetch(Url.graphql, {
        method: 'post',
        headers,
        body: JSON.stringify(query)
    });
}

const postLogin = (username, password) => {
    return fetch(Url.login, {
        method: 'get',
        credentials: 'omit'
    })
    .then(resp => {
        var csrftoken = '';
        let find = false;
        const csrftoken = NetworkUtils.getCookieValue(resp.headers.map, 'csrftoken');

        return csrftoken;
    })
    .then(csrftoken => {
        formData = new FormData();
        formData.append('csrfmiddlewaretoken', csrftoken);
        formData.append('login', username);
        formData.append('password', password);

        const headers = {
            'Origin': Url.base,
            'Referer': Url.login,
            'X-Requested-With': 'XMLHttpRequest',
            'Cookie': `csrftoken=${csrftoken};`
        }

        return fetch(Url.login, {
            method: 'post',
            headers,
            body: formData
        })
    });
}  


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

