import _ from 'lodash';

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
            '   feature {',
            '       questionTranslation',
            '       subscription',
            '   }',
            '   userStatus {',
            '       isSignedIn',
            '       username',
            '       realName',
            '       region',
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
