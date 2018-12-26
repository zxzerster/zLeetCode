import {
    LEETCODE_FAVORITES_PROBLEMS, LEETCODE_FAVORITES_PROBLEMS_SUCCESS, LEETCODE_FAVORITES_PROBLEMS_FAILED,
    LEETCODE_ALL_PROBLEMS, LEETCODE_ALL_PROBLEMS_SUCCESS, LEETCODE_ALL_PROBLEMS_FAILED,
    LEETCODE_PROBLEM, LEETCODE_PROBLEM_SUCCESS, LEETCODE_PROBLEM_FAILED,
    LEETCODE_RUN_CODE, LEETCODE_RUN_CODE_SUCCESS, LEETCODE_RUN_CODE_FAILED,
    LEETCODE_EXPECTED_RESULT_SUCCESS, LEETCODE_EXPECTED_RESULT_FAILED,
    LEETCODE_SUBMIT_CODE, LEETCODE_SUBMIT_CODE_SUCCESS, LEETCODE_SUBMIT_CODE_FAILED, LEETCODE_SUBMISSIONS, LEETCODE_SUBMISSIONS_FAILED, LEETCODE_SUBMISSIONS_SUCCESS,
    LEETCODE_CODE_DEFINITION, LEETCODE_CODE_DEFINITION_SUCCESS, LEETCODE_CODE_DEFINITION_FAILED, LEETCODE_CODE_DEFINITION_SELECTED_INDEX,
    LEETCODE_ALL_TAGS, LEETCODE_ALL_TAGS_SUCCESS, LEETCODE_ALL_TAGS_FAILED,
    LEETCODE_SET_FILTER_PROBLEMS_KEYWORD, LEETCODE_SET_FILTER_PROBLEMS_IDS,
} from './types';
import {
    URLs,
    ERRs,
    leetcodeGetFetch,
    leetcodePostFetch,
    leetcodeGraphqlFetch,
} from '../network';
import {
    Problems, ProblemDetails, Submissions, CodeDefinition, FavoritesLists,
} from '../network/query';

const queryResult = (dispatch, successType, failedType, id, completionHandler, errorHandler) => {
    leetcodeGetFetch(URLs.runCodeResult(id))
    .then(resp => {
        if (resp.status !== 200) {
            dispatch({ type: failedType });
            errorHandler(`error: ${failedType}`);
            // return Promise.reject(new Error(ERRs.ERR_NETWORK));
        }

        resp.json().then(json => {
            const { state } = json;

            switch (state) {
                case 'STARTED':
                case 'PENDING':
                    setTimeout(queryResult, 1000, dispatch, successType, failedType, id, completionHandler, errorHandler);
                    break;
                case 'SUCCESS':
                    dispatch({ type: successType, payload: json });
                    completionHandler(true);
                    break;
                    // return Promise.resolve({ payload: json });
                default:
                    dispatch({ type: failedType });
                    errorHandler('Unknown error');
                    // return Promise.reject(new Error('Unknown errors'));
            }
        });
    });
};

const querySubmissionResult = (dispatch, submissionId, completionHandler, errorHandler) => {
    queryResult(dispatch, LEETCODE_SUBMIT_CODE_SUCCESS, LEETCODE_SUBMIT_CODE_FAILED, submissionId, completionHandler, errorHandler);
};

const queryExpectedResult = (dispatch, expectedId, completionHandler, errorHandler) => {
    queryResult(dispatch, LEETCODE_EXPECTED_RESULT_SUCCESS, LEETCODE_EXPECTED_RESULT_FAILED, expectedId, completionHandler, errorHandler);
};

const queryRuncodeResult = (dispatch, id, completionHandler, errorHandler) => {
    queryResult(dispatch, LEETCODE_RUN_CODE_SUCCESS, LEETCODE_RUN_CODE_FAILED, id, completionHandler, errorHandler);
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

export const leetcodeProblemDetail = (titleSlug, completionHandler, errorHandler) => {
    return ({ csrftoken, LEETCODE_SESSION }) => dispatch => {
        dispatch({ type: LEETCODE_PROBLEM });
        leetcodeGraphqlFetch(csrftoken, LEETCODE_SESSION, ProblemDetails(titleSlug))
        .then(resp => {
            if (resp.status !== 200) {
                dispatch({ type: LEETCODE_PROBLEM_FAILED });
                errorHandler(ERRs.ERR_NETWORK);

                return;
            }

            resp.json().then(json => {
                dispatch({ type: LEETCODE_PROBLEM_SUCCESS, payload: json.data });
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

export const leetcodeCodeDefinition = (titleSlug, completionHandler, errorHandler) => {
    return ({ csrftoken, LEETCODE_SESSION }) => dispatch => {
        dispatch({ type: LEETCODE_CODE_DEFINITION });
        leetcodeGraphqlFetch(csrftoken, LEETCODE_SESSION, CodeDefinition(titleSlug))
        .then(resp => {
            if (resp.status !== 200) {
                dispatch({ type: LEETCODE_CODE_DEFINITION_FAILED });
                errorHandler(ERRs.ERR_NETWORK);

                return;
            }

            resp.json().then(json => {
                dispatch({ type: LEETCODE_CODE_DEFINITION_SUCCESS, payload: json.data.question.codeSnippets });
                completionHandler(true);
                // Keep it for simple test for error situation
                // errorHandler('Opps, error!');
            });
        })
        .catch(error => {
            dispatch({ type: LEETCODE_CODE_DEFINITION_FAILED, error });
            errorHandler(`error: ${error}`);
        });
    };
};

export const leetcodeSubmissions = (offset = 0, key = '', completionHandler, errorHandler) => {
    return ({ csrftoken, LEETCODE_SESSION }) => dispatch => {
        dispatch({ type: LEETCODE_SUBMISSIONS });
        leetcodeGraphqlFetch(csrftoken, LEETCODE_SESSION, Submissions(offset, key))
        .then(resp => {
            if (resp.status !== 200) {
                dispatch({ type: LEETCODE_SUBMISSIONS_FAILED });
                errorHandler(ERRs.ERR_NETWORK);

                return;
            }

            resp.json().then(json => {
                dispatch({ type: LEETCODE_SUBMISSIONS_SUCCESS, payload: json.data.submissionList });
                completionHandler(true);
            });
        })
        .catch(error => {
            dispatch({ type: LEETCODE_SUBMISSIONS_FAILED, error });
            errorHandler(`error: ${error}`);
        });
    };
};

export const leetcodeRunCode = (input, titleSlug, runCompletionHandler, runErrorHandler, expectedCompletionHandler, expectedErrorHandler) => {
    const handler1 = runCompletionHandler;
    const handler2 = expectedCompletionHandler;
    const error1 = runErrorHandler;
    const error2 = expectedErrorHandler;

    return ({ csrftoken, LEETCODE_SESSION }) => dispatch => {
        dispatch({ type: LEETCODE_RUN_CODE });
        leetcodePostFetch(URLs.runCode(titleSlug), csrftoken, LEETCODE_SESSION, JSON.stringify(input))
        .then(resp => {
            if (resp.status !== 200) {
                const error = resp.status === 429 ? 'Sorry but you are sending requests too fast. Please try again later.' : 'Unknown errors.';

                dispatch({ type: LEETCODE_RUN_CODE_FAILED, error });
                runErrorHandler(error);

                return;
            }

            return resp.json();
        })
        .then(json => {
            /* eslint camelcase: ["error", {ignoreDestructuring: true}] */
            const { interpret_id, interpret_expected_id } = json;

            queryRuncodeResult(dispatch, interpret_id, handler1, error1);
            queryExpectedResult(dispatch, interpret_expected_id, handler2, error2);
        })
        .catch(error => {
            dispatch({ type: LEETCODE_RUN_CODE_FAILED, error });
            runErrorHandler(`error: ${error}`);
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

export const leetcodeAllTags = (completionHandler, errorHandler) => {
    return ({ csrftoken, LEETCODE_SESSION }) => dispatch => {
        dispatch({ type: LEETCODE_ALL_TAGS });
        leetcodeGetFetch(URLs.tags, csrftoken, LEETCODE_SESSION)
        .then(resp => {
            if (resp.status !== 200) {
                if (errorHandler) {
                    errorHandler(ERRs.ERR_NETWORK);
                }
                dispatch({ type: LEETCODE_ALL_TAGS_FAILED, error: ERRs.ERR_NETWORK });
            } else {
                return resp.json();
            }
        })
        .then(json => {
            dispatch({ type: LEETCODE_ALL_TAGS_SUCCESS, payload: json });
            completionHandler(true);
        })
        .catch(error => {
            dispatch({ type: LEETCODE_ALL_TAGS_FAILED, error });
            errorHandler(`error: ${error}`);
        });
    };
};

export const leetcodeFavoritesLists = (completionHandler, errorHandler) => {
    return ({ csrftoken, LEETCODE_SESSION }) => dispatch => {
        dispatch({ type: LEETCODE_FAVORITES_PROBLEMS });
        leetcodeGraphqlFetch(csrftoken, LEETCODE_SESSION, FavoritesLists)
        .then(resp => {
            if (resp.status !== 200) {
                dispatch({ type: LEETCODE_FAVORITES_PROBLEMS_FAILED });
                errorHandler(ERRs.ERR_NETWORK);
            }

            resp.json().then(json => {
                dispatch({ type: LEETCODE_FAVORITES_PROBLEMS_SUCCESS, payload: json.data });
                completionHandler(true);
            });
        })
        .catch(error => {
            dispatch({ type: LEETCODE_FAVORITES_PROBLEMS_FAILED, error });
            errorHandler(`error: ${error}`);
        });
    };
};

export const leetcodeSelectedIndex = index => {
    return {
        type: LEETCODE_CODE_DEFINITION_SELECTED_INDEX,
        payload: index || 0,
    };
};
