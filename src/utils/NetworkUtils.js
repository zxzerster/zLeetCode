import _ from 'lodash';

export const getCookieValue = (respHeaders, key) => {
    if (!respHeaders) return null;

    let value = null;
    const cookies = respHeaders['set-cookie'].split(';');
    _.forEach(cookies, (cookie, i) => {
        const pair = cookie.trim().split('=');
        if (pair.length === 2 && pair[0].indexOf(key) >= 0) {
            value = pair[1];
            return false;
        } 
    })
    
    return value;
}