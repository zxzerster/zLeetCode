import _ from 'lodash';
import { LEETCODE_USERPROFILE, LEETCODE_USERPROFILE_SUCCESS, LEETCODE_USERPROFILE_FAILED } from '../actions/types';

const graphqlUrl = 'https://leetcode.com/graphql';
const origin = 'https://leetcode.com';
const referer = 'https://leetcode.com';

export const leetcodeGraphqlQuery = (csrftoken, LEETCODE_SESSION) => {
    const headers = {
        credentials: 'omit',
        origin,
        referer,
        cookie: `csrftoken=${csrftoken}; LEETCODE_SESSION=${LEETCODE_SESSION};`,
        'X-csrftoken': csrftoken,
        'Content-Type': 'application/json'
    };

    const query = {
        query: [
            '{',
            '   userStatus {',
            '       isSignedIn',
            '   }',
            '}'
        ].join('\n'),
        variables: {}
    }
    

    fetch(graphqlUrl, {
        method: 'post',
        headers,
        body: JSON.stringify(query)
    })
    .then(resp => {
        console.log(`resp: ${resp}`);
        debugger;
    })
    .catch(error => {
        console.log(`error: ${error}`);
    })
}

export const leetcodeGraphqlProfile = (csrftoken, LEETCODE_SESSION) => {
    const headers = {
        credentials: 'omit',
        origin,
        referer,
        cookie: `csrftoken=${csrftoken}; LEETCODE_SESSION=${LEETCODE_SESSION};`,
        'X-csrftoken': csrftoken,
        'Content-Type': 'application/json'
    };

    const query = {
        query: [
            '{',
            '   user {',
            '       profile {',
            '           userSlug',
            '           realName',
            '           birthday',
            '           aboutMe',
            '           reputation',
            '           occupation',
            '           country',
            '           school',
            '           company',
            '           lastModified',
            '           countryName',
            '           countryFlag',
            '           userAvatar',
            '           location',
            '           gender',
            '           privacyContact',
            '           websites',
            '           rewardStats',
            '           skillTags',
            '           age',
            '           education',
            '           yearsOfExperience',
            '           globalRanking',
            '           contestCount',
            '           acStats {',
            '               acQuestionCount',
            '               acSubmissionCount',
            '               totalSubmissionCount',
            '               acRate',
            '           }',
            '       }',
            '   }',
            '}'
        ].join('\n'),
        variables: {}
    }
    return (dispatch) => {
        dispatch({type: LEETCODE_USERPROFILE});
        fetch(graphqlUrl, {
            method: 'post',
            headers,
            body: JSON.stringify(query)
        })
        .then(resp => {
            console.log(`resp: ${resp}`);
            const profile = JSON.parse(resp._bodyText).data.user.profile || {};
            dispatch({type: LEETCODE_USERPROFILE_SUCCESS, payload: profile});
        })
        .catch(error => {
            console.log(`error: ${error}`);
            dispatch({type: LEETCODE_USERPROFILE_FAILED});
        })
    }
}
