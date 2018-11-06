import { LEETCODE_ALL_PROBLEMS, LEETCODE_ALL_PROBLEMS_SUCCESS, LEETCODE_ALL_PROBLEMS_FAILED } from './types';
import { LEETCODE_PROBLEM, LEETCODE_PROBLEM_SUCCESS, LEETCODE_PROBLEM_FAILED } from './types';
import { LEETCODE_RUN_CODE, LEETCODE_RUN_CODE_SUCCESS, LEETCODE_RUN_CODE_FAILED } from './types';
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
                '           titleSlug',
                '           title',
                '           content',
                '           questionId',
                '           judgeType',
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
            // TODO: Seems that only return json if status = 200?
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

export const runCode = (problemInput, titleSlug, csrftoken, LEETCODE_SESSION) => {
    
    const headers = {
        credentials: 'omit',
        referer: Config.Url.runCodeRefer(titleSlug),
        cookie: `csrftoken=${csrftoken}; LEETCODE_SESSION=${LEETCODE_SESSION};`,
        'X-csrftoken': csrftoken,
        'Content-Type': 'application/json'
    };

    return dispatch => {
        dispatch({type: LEETCODE_RUN_CODE});
        fetch(Config.Url.runCode(titleSlug), {
            method: 'post',
            headers,
            body: JSON.stringify(problemInput)
        }).then(resp => {
            if (resp.status === 200) {
                return resp.json()
            } else {
                // TODO: Handle errors here.
                let error = resp.status === 429 ? 'Sorry but you are sending requests too fast. Please try again later.' : 'Unknown errors.';
                return Promise.reject({runcodeError: error});                
            }
        })
        .then(json => {
            console.log(`========== interpret_id: ${json.interpret_id}: ${JSON.stringify(json)}`);
            queryResult(dispatch, headers, json.interpret_id);
        })
        .catch(error => {
            if (error.runcodeError) {
                dispatch({type: LEETCODE_RUN_CODE_FAILED, error: error.runcodeError});
            } else {
                dispatch({type: LEETCODE_RUN_CODE_FAILED, error});
            }
        })
    };
}

const queryResult = (dispatch, headers, interpret_id) => {
    if (!headers) {
        console.log('headers is NULL');
    }
    
    if (!interpret_id) {
        console.log('interpret_id is NULL');
        return;
    }
    fetch(Config.Url.runCodeResult(interpret_id), {
        method: 'get',
        headers
    })
    .then(resp => {
        if (resp.status === 200) {
            return resp.json();
        } else {
            dispatch({type: LEETCODE_RUN_CODE_FAILED});
        }
    })
    .then(json => {
        console.log(`query state: ${json.state}`);
        if (json.state === 'PENDING' || json.state === 'STARTED') {
            setTimeout(queryResult, 1000, dispatch, headers, interpret_id);
        } else if (json.state === 'SUCCESS') {
            dispatch({type: LEETCODE_RUN_CODE_SUCCESS, payload: json})
        } else {
            dispatch({type: LEETCODE_RUN_CODE_FAILED});
        }
    })
    .catch(error => {
        dispatch({type: LEETCODE_RUN_CODE_FAILED, error});
    })
}