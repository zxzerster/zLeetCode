import _ from 'lodash';

const base = 'https://leetcode.com';

export const URLs = {
    login: `${base}/accounts/login/`,
    logout: `${base}/accounts/logout/`,
    graphql: `${base}/graphql/`,
    forgot: `${base}/accounts/password/reset/`,
    progress: `${base}/api/progress/all`,
    tags: `${base}/problems/api/tags`,
    premium: `${base}/subscribe/`,
    runCode: titleSlug => `https://leetcode.com/problems/${titleSlug}/interpret_solution/`,
    runCodeRefer: titleSlug => `https://leetcode.com/problems/${titleSlug}`,
    runCodeResult: interpretId => `https://leetcode.com/submissions/detail/${interpretId}/check/`,
    runCodeExpectedResult: expectedInterpretId => `https://leetcode.com/submissions/detail/${expectedInterpretId}/check/`,
    submitCode: titleSlug => `https://leetcode.com/problems/${titleSlug}/submit/`,
    submitCodeResult: submissionId => `https://leetcode.com/submissions/detail/${submissionId}/check/`,
};

export const ERRs = {
    ERR_NETWORK: 'Network errors',
    ERR_SESSION: 'Session expired',
    ERR_RELOGIN: 'Re-Login',
    ERR_CANCEL: 'Request cancelled',
    ERR_TIMEOUT: 'Request times out',
};

// Default timeout is 2 minutes
const DEFAULT_TIME_OUT = 1000 * 60 * 2;

const commons = {
    Origin: base,
    Referer: base,
};

const withTimeoutOrCancel = (fetch, timeout = DEFAULT_TIME_OUT) => {
    let timeoutFn = null;
    const timeoutPromise = new Promise((resolve, reject) => {
        timeoutFn = () => {
            reject(ERRs.ERR_TIMEOUT);
        };
    });

    let cancelFn = null;
    const cancelPromise = new Promise((resolve, reject) => {
        cancelFn = () => {
            reject(ERRs.ERR_CANCEL);
        };
    });

    const p = Promise.race([fetch, timeoutPromise, cancelPromise]);

    p.cancel = cancelFn;
    setTimeout(() => {
        timeoutFn();
    }, timeout);

    return p;
};

export const getCookieValue = (respHeaders, key) => {
    if (!respHeaders) return null;

    let value = null;
    const cookies = respHeaders['set-cookie'].split(';');

    _.forEach(cookies, cookie => {
        const pair = cookie.trim().split('=');

        if (pair.length === 2 && pair[0].indexOf(key) >= 0) {
            value = pair[1];

            return false;
        }
    });

    return value;
};

export const leetcodeGetFetch = (csrftoken, LEETCODE_SESSION, url, headers = null, timeout = DEFAULT_TIME_OUT) => {
    let getHeaders = { ...commons };

    if (csrftoken && LEETCODE_SESSION) {
        getHeaders = {
            ...commons,
            Cookie: `;csrftoken=${csrftoken};LEETCODE_SESSION=${LEETCODE_SESSION}`,
            'X-CSRFToken': csrftoken,
        };
    }

    if (headers) {
        getHeaders = {
            ...getHeaders,
            ...headers,
        };
    }

    return withTimeoutOrCancel(fetch(url, {
        method: 'get',
        credential: 'omit',
        redirect: 'manual',
        headers: getHeaders,
    }), timeout);
};

export const leetcodeGraphqlFetch = (csrftoken, LEETCODE_SESSION, query, timeout = DEFAULT_TIME_OUT) => {
    const postHeaders = {
        ...commons,
        Cookie: `;csrftoken=${csrftoken};LEETCODE_SESSION=${LEETCODE_SESSION}`,
        'X-csrftoken': csrftoken,
        'Content-Type': 'application/json',
    };

    return withTimeoutOrCancel(fetch('https://leetcode.com/graphql/', {
        method: 'post',
        headers: postHeaders,
        body: JSON.stringify(query),
    }), timeout);
};

export const leetcodePostFetch = (csrftoken, LEETCODE_SESSION, url, body, timeout = DEFAULT_TIME_OUT, form = false, headers = null) => {
    let postHeaders = {
        ...commons,
        'X-Requested-With': 'XMLHttpRequest',
    };

    if (csrftoken && LEETCODE_SESSION) {
        postHeaders = {
            ...commons,
            Cookie: `;csrftoken=${csrftoken};LEETCODE_SESSION=${LEETCODE_SESSION}`,
            'X-CSRFToken': csrftoken,
        };
    }

    if (headers) {
        postHeaders = {
            ...postHeaders,
            ...headers,
        };
    }

    let bodyData = body;

    if (form) {
        bodyData = new FormData();
        _.forEach(body, (value, key) => {
            bodyData.append(key, value);
        });
    }

    return withTimeoutOrCancel(fetch(url, {
        method: 'post',
        credentials: 'omit',
        redirect: 'manual',
        headers: postHeaders,
        body: bodyData,
    }), timeout);
};

export const leetcodeNetworkRequester = (
    requester, middlewrreParams, parameters, callbacks, timeout = DEFAULT_TIME_OUT,
) => {
    const {
        csrftoken, LEETCODE_SESSION,
    } = middlewrreParams;
    const {
        callback, successCallback, failCallback,
    } = callbacks;

    callback();
    requester(csrftoken, LEETCODE_SESSION, ...parameters, timeout)
    .then(resp => {
        if (resp.status !== 200) {
            let error = '';

            switch (resp.status) {
                case 429:
                    error = 'Sorry but you are sending requests too fast. Please try again later.';
                    failCallback(error);

                    return null;
                case 499:
                case 403:
                case 401:
                    failCallback(ERRs.ERR_RELOGIN);

                    return null;
                default:
                    error = 'Unknown errors.';
                    failCallback(error);

                    return null;
            }
        }

        return resp.json();
    })
    .then(json => {
        if (json) {
            successCallback(json);
        }
    })
    .catch(error => {
        failCallback(error);
    });
};
