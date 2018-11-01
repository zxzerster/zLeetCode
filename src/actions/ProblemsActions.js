import { LEETCODE_ALL_PROBLEMS, LEETCODE_ALL_PROBLEMS_SUCCESS, LEETCODE_ALL_PROBLEMS_FAILED } from './types';
import { LEETCODE_PROBLEM, LEETCODE_PROBLEM_SUCCESS, LEETCODE_PROBLEM_FAILED } from './types';
import Config from '../utils/Config';

export const fetchAllProblems = (csrftoken, LEETCODE_SESSION) => {
    return (dispatch) => {
        const { Url } = Config;

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
                '   allQuestions {',
                '       title',
                '       titleSlug',
                '       questionId',
                '       difficulty',
                '       status',
                '       likes',
                '       dislikes',
                '   }',
                '}'
            ].join('\n'),
            variables: {}
        };
    
        dispatch({
            type: LEETCODE_ALL_PROBLEMS
        })
        fetch(Url.graphql, {
            method: 'post',
            headers,
            body: JSON.stringify(query)
        }).then(resp => {
            return resp.json()
        }).then(json => {
            dispatch({
                type: LEETCODE_ALL_PROBLEMS_SUCCESS,
                payload: json.data
            })
        }).catch(error => {
            dispatch({
                type: LEETCODE_ALL_PROBLEMS_FAILED,
                error
            })
        });
    };
}

export const fetchProblem = (titleSlug, csrftoken, LEETCODE_SESSION) => {
    // debugger;
    return (dispatch) => {
        const { Url } = Config;

        const headers = {
            credentials: 'omit',
            origin: Url.base,
            referer: Url.login,
            cookie: `csrftoken=${csrftoken}; LEETCODE_SESSION=${LEETCODE_SESSION};`,
            'X-csrftoken': csrftoken,
            'Content-Type': 'application/json'
        };

        const query = {
            operationName: "problemDetails",
            variables: {titleSlug: titleSlug},
            query: [
                '   query problemDetails($titleSlug: String) {',
                '       question(titleSlug: $titleSlug) {',
                '           title',
                '           content',
                '       }',
                '   }'
            ].join('\n')
        };
    
        dispatch({
            type: LEETCODE_PROBLEM
        })
        fetch(Url.graphql, {
            method: 'post',
            headers,
            body: JSON.stringify(query)
        }).then(resp => {
            return resp.json()
        }).then(json => {
            dispatch({
                type: LEETCODE_PROBLEM_SUCCESS,
                payload: json.data.question
            })
        }).catch(error => {
            debugger;
        });
    };
}