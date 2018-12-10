import {
    LEETCODE_ALL_PROBLEMS, LEETCODE_ALL_PROBLEMS_SUCCESS, LEETCODE_ALL_PROBLEMS_FAILED,
    LEETCODE_PROBLEM, LEETCODE_PROBLEM_SUCCESS, LEETCODE_PROBLEM_FAILED,
    LEETCODE_RUN_CODE, LEETCODE_RUN_CODE_SUCCESS, LEETCODE_RUN_CODE_FAILED,
    LEETCODE_EXPECTED_RESULT_SUCCESS, LEETCODE_EXPECTED_RESULT_FAILED,
    LEETCODE_SUBMIT_CODE, LEETCODE_SUBMIT_CODE_SUCCESS, LEETCODE_SUBMIT_CODE_FAILED, LEETCODE_SUBMISSIONS, LEETCODE_SUBMISSIONS_FAILED, LEETCODE_SUBMISSIONS_SUCCESS,
    LEETCODE_CODE_DEFINITION, LEETCODE_CODE_DEFINITION_SUCCESS, LEETCODE_CODE_DEFINITION_FAILED, LEETCODE_CODE_DEFINITION_SELECTED_INDEX,
} from './types';
import {
    URLs,
    ERRs,
    leetcodeGetFetch,
    leetcodePostFetch,
    leetcodeGraphqlFetch,
} from '../network';
import {
    Problems, ProblemDetails, Submissions, CodeDefinition,
} from '../network/query';

const queryResult = (dispatch, successType, failedType, id) => {
    leetcodeGetFetch(URLs.runCodeResult(id))
    .then(resp => {
        if (resp.status !== 200) {
            dispatch({ type: failedType });

            return Promise.resolve();
        }

        resp.json().then(json => {
            const { state } = json;

            switch (state) {
                case 'STARTED':
                case 'PENDING':
                    setTimeout(queryResult, 1000, dispatch, successType, failedType, id);
                    break;
                case 'SUCCESS':
                    dispatch({ type: successType, payload: json });
                    break;
                default:
                    dispatch({ type: failedType });
            }
        });

        return Promise.resolve();
    })
    .catch(error => {
        dispatch({ type: failedType, error });
    });
};

const querySubmissionResult = (dispatch, submissionId) => {
    queryResult(dispatch, LEETCODE_SUBMIT_CODE_SUCCESS, LEETCODE_SUBMIT_CODE_FAILED, submissionId);
};

const queryExpectedResult = (dispatch, expectedId) => {
    queryResult(dispatch, LEETCODE_EXPECTED_RESULT_SUCCESS, LEETCODE_EXPECTED_RESULT_FAILED, expectedId);
};

const queryRuncodeResult = (dispatch, id) => {
    queryResult(dispatch, LEETCODE_RUN_CODE_SUCCESS, LEETCODE_RUN_CODE_FAILED, id);
};

export const leetcodeProblems = (completionHandler, errorHandler) => {
    return ({ csrftoken, LEETCODE_SESSION }) => dispatch => {
        dispatch({ type: LEETCODE_ALL_PROBLEMS });
        leetcodeGraphqlFetch(csrftoken, LEETCODE_SESSION, Problems)
        .then(resp => {
            if (resp.status !== 200) {
                dispatch({ type: LEETCODE_ALL_PROBLEMS_FAILED });
                errorHandler(ERRs.ERR_NETWORK);

                return;
            }

            resp.json().then(json => {
                const { allQuestions } = json.data;

                dispatch({ type: LEETCODE_ALL_PROBLEMS_SUCCESS, payload: allQuestions });
                completionHandler(true);
                // Keep it for simple test for error situation
                // errorHandler('Opps, error!');
            });
        })
        .catch(error => {
            dispatch({ type: LEETCODE_ALL_PROBLEMS_FAILED, error });
            errorHandler(`error: ${error}`);
        });
    };
};

export const leetcodeProblemDetail = titleSlug => {
    return ({ csrftoken, LEETCODE_SESSION }) => dispatch => {
        dispatch({ type: LEETCODE_PROBLEM });
        leetcodeGraphqlFetch(csrftoken, LEETCODE_SESSION, ProblemDetails(titleSlug))
        .then(resp => {
            if (resp.status !== 200) {
                dispatch({ type: LEETCODE_PROBLEM_FAILED });

                return Promise.resolve();
            }

            resp.json().then(json => {
                dispatch({ type: LEETCODE_PROBLEM_SUCCESS, payload: json.data });

                return Promise.resolve();
            });

            return Promise.resolve();
        })
        .catch(error => {
            dispatch({ type: LEETCODE_ALL_PROBLEMS_FAILED, error });
        });
    };
};

export const leetcodeCodeDefinition = titleSlug => {
    return ({ csrftoken, LEETCODE_SESSION }) => dispatch => {
        dispatch({ type: LEETCODE_CODE_DEFINITION });
        leetcodeGraphqlFetch(csrftoken, LEETCODE_SESSION, CodeDefinition(titleSlug))
        .then(resp => {
            if (resp.status !== 200) {
                dispatch({ type: LEETCODE_CODE_DEFINITION_FAILED });

                return Promise.resolve();
            }

            resp.json().then(json => {
                dispatch({ type: LEETCODE_CODE_DEFINITION_SUCCESS, payload: json.data.question.codeSnippets });

                return Promise.resolve();
            });

            return Promise.resolve();
        })
        .catch(error => {
            dispatch({ type: LEETCODE_CODE_DEFINITION_FAILED, error });
        });
    };
};

export const leetcodeSubmissions = (offset = 0, key = '') => {
    return ({ csrftoken, LEETCODE_SESSION }) => dispatch => {
        dispatch({ type: LEETCODE_SUBMISSIONS });
        leetcodeGraphqlFetch(csrftoken, LEETCODE_SESSION, Submissions(offset, key))
        .then(resp => {
            if (resp.status !== 200) {
                dispatch({ type: LEETCODE_SUBMISSIONS_FAILED });

                return Promise.resolve();
            }

            resp.json().then(json => {
                dispatch({ type: LEETCODE_SUBMISSIONS_SUCCESS, payload: json.data.submissionList });

                return Promise.resolve();
            });

            return Promise.resolve();
        })
        .catch(error => {
            dispatch({ type: LEETCODE_SUBMISSIONS_FAILED, error });
        });
    };
};

export const leetcodeRunCode = (input, titleSlug) => {
    return ({ csrftoken, LEETCODE_SESSION }) => dispatch => {
        dispatch({ type: LEETCODE_RUN_CODE });
        leetcodePostFetch(URLs.runCode(titleSlug), csrftoken, LEETCODE_SESSION, JSON.stringify(input))
        .then(resp => {
            if (resp.status !== 200) {
                const error = resp.status === 429 ? 'Sorry but you are sending requests too fast. Please try again later.' : 'Unknown errors.';

                dispatch({ type: LEETCODE_RUN_CODE_FAILED, error });

                return Promise.resolve();
            }

            resp.json().then(json => {
                /* eslint camelcase: ["error", {ignoreDestructuring: true}] */
                const { interpret_id, interpret_expected_id } = json;

                queryRuncodeResult(dispatch, interpret_id);
                queryExpectedResult(dispatch, interpret_expected_id);
            });

            return Promise.resolve();
        })
        .catch(error => {
            dispatch({ type: LEETCODE_RUN_CODE_FAILED, error });
        });
    };
};

export const leetcodeSubmitCode = (input, titleSlug) => {
    return ({ csrftoken, LEETCODE_SESSION }) => dispatch => {
        dispatch({ type: LEETCODE_SUBMIT_CODE });
        leetcodePostFetch(URLs.submitCode(titleSlug), csrftoken, LEETCODE_SESSION, JSON.stringify(input))
        .then(resp => {
            if (resp.status !== 200) {
                const error = resp.status === 429 ? 'Sorry but you are sending requests too fast. Please try again later.' : 'Unknown errors.';

                dispatch({ type: LEETCODE_SUBMIT_CODE_FAILED, error });

                return Promise.resolve();
            }

            resp.json().then(json => {
                /* eslint camelcase: ["error", {ignoreDestructuring: true}] */
                const { submission_id } = json;

                querySubmissionResult(dispatch, submission_id);
            });

            return Promise.resolve();
        })
        .then(error => {
            dispatch({ type: LEETCODE_SUBMIT_CODE_FAILED, error });
        });
    };
};

export const leetcodeSelectedIndex = index => {
    return {
        type: LEETCODE_CODE_DEFINITION_SELECTED_INDEX,
        payload: index || 0,
    };
};
