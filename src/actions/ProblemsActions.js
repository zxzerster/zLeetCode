import { LEETCODE_ALL_PROBLEMS, LEETCODE_ALL_PROBLEMS_SUCCESS, LEETCODE_ALL_PROBLEMS_FAILED } from './types';
import { LEETCODE_PROBLEM, LEETCODE_PROBLEM_SUCCESS, LEETCODE_PROBLEM_FAILED } from './types';
import { LEETCODE_RUN_CODE, LEETCODE_RUN_CODE_SUCCESS, LEETCODE_RUN_CODE_FAILED } from './types';
import { LEETCODE_EXPECTED_RESULT_SUCCESS, LEETCODE_EXPECTED_RESULT_FAILED } from './types';
import { LEETCODE_SUBMIT_CODE, LEETCODE_SUBMIT_CODE_SUCCESS, LEETCODE_SUBMIT_CODE_FAILED } from './types';
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
            // queryResult(dispatch, headers, json.interpret_id)
            queryExpectedResult(dispatch, headers, json.interpret_expected_id);
            queryRuncodeResult(dispatch, headers, json.interpret_id);
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

export const submitCode = (problemInput, titleSlug, csrftoken, LEETCODE_SESSION) => {
    const headers = {
        credentials: 'omit',
        referer: Config.Url.runCodeRefer(titleSlug),
        cookie: `csrftoken=${csrftoken}; LEETCODE_SESSION=${LEETCODE_SESSION};`,
        'X-csrftoken': csrftoken,
        'Content-Type': 'application/json'
    };

    return dispatch => {
        dispatch({type: LEETCODE_SUBMIT_CODE});
        fetch(Config.Url.submitCode(titleSlug), {
            method: 'post',
            headers,
            body: JSON.stringify(problemInput)
        }).then(resp => {
            if (resp.status === 200) {
                return resp.json();
            } else {
                let error = resp.status === 429 ? 'Sorry but you are sending requests too fast. Please try again later.' : 'Unknown errors.';
                return Promise.reject({runcodeError: error}); 
            }
        })
        .then(json => {
            // query submit result
            console.log(`submission_id: ${json.submission_id}`);
            querySubmissionResult(dispatch, headers, json.submission_id);
        })
        .catch(error => {
            if (error.runcodeError) {
                dispatch({type: LEETCODE_SUBMIT_CODE_FAILED, error: error.runcodeError});
            } else {
                dispatch({type: LEETCODE_SUBMIT_CODE_FAILED, error});
            }
        })
    }
}

const querySubmissionResult = (dispatch, headers, submission_id) => {
    queryResult(dispatch, LEETCODE_SUBMIT_CODE_SUCCESS, LEETCODE_SUBMIT_CODE_FAILED, headers, submission_id);
}

const queryExpectedResult = (dispatch, headers, interpret_expected_id) => {
    queryResult(dispatch, LEETCODE_EXPECTED_RESULT_SUCCESS, LEETCODE_EXPECTED_RESULT_FAILED, headers, interpret_expected_id);
}

const queryRuncodeResult = (dispatch, headers, interpret_id) => {
    queryResult(dispatch, LEETCODE_RUN_CODE_SUCCESS, LEETCODE_RUN_CODE_FAILED, headers, interpret_id);
}

const queryResult = (dispatch, successType, failedType, headers, id) => {

    if (!id) {
        return;
    }
    fetch(Config.Url.runCodeResult(id), {
        method: 'get',
        headers
    })
    .then(resp => {
        if (resp.status === 200) {
            return resp.json();
        } else {
            dispatch({type: successType});
        }
    })
    .then(json => {
        console.log(`query state: ${json.state}`);
        if (json.state === 'PENDING' || json.state === 'STARTED') {
            setTimeout(queryResult, 1000, dispatch, successType, failedType, headers, id);
        } else if (json.state === 'SUCCESS') {
            dispatch({type: successType, payload: json})
        } else {
            dispatch({type: failedType});
        }
    })
    .catch(error => {
        dispatch({type: LEETCODE_RUN_CODE_FAILED, error});
    })
}