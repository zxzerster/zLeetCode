import {
    LEETCODE_FAVORITES_PROBLEMS, LEETCODE_FAVORITES_PROBLEMS_SUCCESS, LEETCODE_FAVORITES_PROBLEMS_FAILED,
    LEETCODE_ALL_PROBLEMS, LEETCODE_ALL_PROBLEMS_SUCCESS, LEETCODE_ALL_PROBLEMS_FAILED,
    LEETCODE_PROBLEM, LEETCODE_PROBLEM_SUCCESS, LEETCODE_PROBLEM_FAILED,
    LEETCODE_RUN_CODE, LEETCODE_RUN_CODE_SUCCESS, LEETCODE_RUN_CODE_FAILED,
    LEETCODE_EXPECTED_RESULT_SUCCESS, LEETCODE_EXPECTED_RESULT_FAILED,
    LEETCODE_SUBMIT_CODE, LEETCODE_SUBMIT_CODE_SUCCESS, LEETCODE_SUBMIT_CODE_FAILED, LEETCODE_SUBMISSIONS, LEETCODE_SUBMISSIONS_FAILED, LEETCODE_SUBMISSIONS_SUCCESS,
    LEETCODE_CODE_DEFINITION, LEETCODE_CODE_DEFINITION_SUCCESS, LEETCODE_CODE_DEFINITION_FAILED, LEETCODE_CODE_DEFINITION_SELECTED_INDEX,
    LEETCODE_ALL_TAGS, LEETCODE_ALL_TAGS_SUCCESS, LEETCODE_ALL_TAGS_FAILED,
} from './types';
import {
    URLs,
    leetcodeNetworkRequester,
    leetcodeGetFetch,
    leetcodePostFetch,
    leetcodeGraphqlFetch,
} from '../network';
import {
    Problems, ProblemDetails, Submissions, CodeDefinition, FavoritesLists,
} from '../network/query';

const queryResult = (dispatch, successType, failedType, id, url, completionHandler, errorHandler) => {
    leetcodeGetFetch(null, null, url)
    .then(resp => {
        if (resp.status !== 200) {
            dispatch({ type: failedType });
            errorHandler(`error: ${failedType}`);
            // return Promise.reject(new Error(ERRs.ERR_NETWORK));

            return;
        }

        resp.json().then(json => {
            const { state } = json;

            switch (state) {
                case 'STARTED':
                case 'PENDING':
                    setTimeout(queryResult, 1000, dispatch, successType, failedType, id, url, completionHandler, errorHandler);
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
    queryResult(dispatch, LEETCODE_SUBMIT_CODE_SUCCESS, LEETCODE_SUBMIT_CODE_FAILED, submissionId, URLs.submitCodeResult(submissionId), completionHandler, errorHandler);
};

const queryExpectedResult = (dispatch, expectedId, completionHandler, errorHandler) => {
    queryResult(dispatch, LEETCODE_EXPECTED_RESULT_SUCCESS, LEETCODE_EXPECTED_RESULT_FAILED, expectedId, URLs.runCodeExpectedResult(expectedId), completionHandler, errorHandler);
};

const queryRuncodeResult = (dispatch, id, completionHandler, errorHandler) => {
    queryResult(dispatch, LEETCODE_RUN_CODE_SUCCESS, LEETCODE_RUN_CODE_FAILED, id, URLs.runCodeResult(id), completionHandler, errorHandler);
};

export const leetcodeProblems = (completionHandler, errorHandler) => {
    return ({ csrftoken, LEETCODE_SESSION }) => dispatch => {
        leetcodeNetworkRequester(
            leetcodeGraphqlFetch,
            { csrftoken, LEETCODE_SESSION },
            [Problems],
            {
                callback: () => {
                    dispatch({ type: LEETCODE_ALL_PROBLEMS });
                },
                successCallback: json => {
                    const { allQuestions } = json.data;

                    dispatch({ type: LEETCODE_ALL_PROBLEMS_SUCCESS, payload: allQuestions });
                    if (completionHandler) {
                        completionHandler(true);
                    }
                },
                failCallback: error => {
                    dispatch({ type: LEETCODE_ALL_PROBLEMS_FAILED, error });
                    if (errorHandler) {
                        errorHandler(error);
                    }
                },
            },
        );
    };
};

export const leetcodeProblemDetail = (titleSlug, completionHandler, errorHandler) => {
    return ({ csrftoken, LEETCODE_SESSION }) => dispatch => {
        leetcodeNetworkRequester(
            leetcodeGraphqlFetch,
            { csrftoken, LEETCODE_SESSION },
            [ProblemDetails(titleSlug)],
            {
                callback: () => {
                    dispatch({ type: LEETCODE_PROBLEM });
                },
                successCallback: json => {
                    const { question } = json.data;

                    dispatch({ type: LEETCODE_PROBLEM_SUCCESS, payload: { question } });
                    if (completionHandler) {
                        completionHandler(true);
                    }
                },
                failCallback: error => {
                    dispatch({ type: LEETCODE_PROBLEM_FAILED, error });
                    if (errorHandler) {
                        errorHandler(error);
                    }
                },
            },
        );
    };
};

export const leetcodeCodeDefinition = (titleSlug, completionHandler, errorHandler) => {
    return ({ csrftoken, LEETCODE_SESSION }) => dispatch => {
        leetcodeNetworkRequester(
            leetcodeGraphqlFetch,
            { csrftoken, LEETCODE_SESSION },
            [CodeDefinition(titleSlug)],
            {
                callback: () => {
                    dispatch({ type: LEETCODE_CODE_DEFINITION });
                },
                successCallback: json => {
                    const { question: { codeSnippets } } = json.data;

                    dispatch({ type: LEETCODE_CODE_DEFINITION_SUCCESS, payload: codeSnippets });
                    if (completionHandler) {
                        completionHandler(true);
                    }
                },
                failCallback: error => {
                    dispatch({ type: LEETCODE_CODE_DEFINITION_FAILED, error });
                    if (errorHandler) {
                        errorHandler(error);
                    }
                },
            },
        );
    };
};

export const leetcodeSubmissions = (offset = 0, key = '', completionHandler, errorHandler) => {
    return ({ csrftoken, LEETCODE_SESSION }) => dispatch => {
        leetcodeNetworkRequester(
            leetcodeGraphqlFetch,
            { csrftoken, LEETCODE_SESSION },
            [Submissions(offset, key)],
            {
                callback: () => {
                    dispatch({ type: LEETCODE_SUBMISSIONS });
                },
                successCallback: json => {
                    const { submissionList } = json.data;

                    dispatch({ type: LEETCODE_SUBMISSIONS_SUCCESS, payload: submissionList });
                    if (completionHandler) {
                        completionHandler(true);
                    }
                },
                failCallback: error => {
                    dispatch({ type: LEETCODE_SUBMISSIONS_FAILED, error });
                    if (errorHandler) {
                        errorHandler(error);
                    }
                },
            },
        );
    };
};

export const leetcodeRunCode = (input, titleSlug, runCompletionHandler, runErrorHandler, expectedCompletionHandler, expectedErrorHandler) => {
    const handler1 = runCompletionHandler;
    const handler2 = expectedCompletionHandler;
    const error1 = runErrorHandler;
    const error2 = expectedErrorHandler;

    return ({ csrftoken, LEETCODE_SESSION }) => dispatch => {
        leetcodeNetworkRequester(
            leetcodePostFetch,
            { csrftoken, LEETCODE_SESSION },
            [URLs.runCode(titleSlug), JSON.stringify(input)],
            {
                callback: () => {
                    dispatch({ type: LEETCODE_RUN_CODE });
                },
                successCallback: json => {
                    /* eslint camelcase: ["error", {ignoreDestructuring: true}] */
                    const { interpret_id, interpret_expected_id } = json;

                    queryRuncodeResult(dispatch, interpret_id, handler1, error1);
                    queryExpectedResult(dispatch, interpret_expected_id, handler2, error2);
                },
                failCallback: error => {
                    dispatch({ type: LEETCODE_RUN_CODE_FAILED, error });
                    if (runErrorHandler) {
                        runErrorHandler(`${error}`);
                    }
                },
            },
        );
    };
};

export const leetcodeSubmitCode = (input, titleSlug, submitCompletionHandler, submitErrorHandler) => {
    return ({ csrftoken, LEETCODE_SESSION }) => dispatch => {
        leetcodeNetworkRequester(
            leetcodePostFetch,
            { csrftoken, LEETCODE_SESSION },
            [URLs.submitCode(titleSlug), JSON.stringify(input)],
            {
                callback: () => {
                    dispatch({ type: LEETCODE_SUBMIT_CODE });
                },
                successCallback: json => {
                    /* eslint camelcase: ["error", {ignoreDestructuring: true}] */
                    const { submission_id } = json;

                    querySubmissionResult(dispatch, submission_id, submitCompletionHandler, submitErrorHandler);
                },
                failCallback: error => {
                    dispatch({ type: LEETCODE_SUBMIT_CODE_FAILED, error });
                    if (submitErrorHandler) {
                        submitErrorHandler(`${error}`);
                    }
                },
            },
        );
    };
};

export const leetcodeAllTags = (completionHandler, errorHandler) => {
    return ({ csrftoken, LEETCODE_SESSION }) => dispatch => {
        leetcodeNetworkRequester(
            leetcodeGetFetch,
            { csrftoken, LEETCODE_SESSION },
            [URLs.tags],
            {
                callback: () => {
                    dispatch({ type: LEETCODE_ALL_TAGS });
                },
                successCallback: json => {
                    dispatch({ type: LEETCODE_ALL_TAGS_SUCCESS, payload: json });
                    if (completionHandler) {
                        completionHandler(true);
                    }
                },
                failCallback: error => {
                    dispatch({ type: LEETCODE_ALL_TAGS_FAILED, error });
                    if (errorHandler) {
                        errorHandler(error);
                    }
                },
            },
        );
    };
};

export const leetcodeFavoritesLists = (completionHandler, errorHandler) => {
    return ({ csrftoken, LEETCODE_SESSION }) => dispatch => {
        leetcodeNetworkRequester(
            leetcodeGraphqlFetch,
            { csrftoken, LEETCODE_SESSION },
            [FavoritesLists],
            {
                callback: () => {
                    dispatch({ type: LEETCODE_FAVORITES_PROBLEMS });
                },
                successCallback: json => {
                    dispatch({ type: LEETCODE_FAVORITES_PROBLEMS_SUCCESS, payload: json.data });
                    if (completionHandler) {
                        completionHandler(true);
                    }
                },
                failCallback: error => {
                    dispatch({ type: LEETCODE_FAVORITES_PROBLEMS_FAILED, error });
                    if (errorHandler) {
                        errorHandler(error);
                    }
                },
            },
        );
    };
};

export const leetcodeSelectedIndex = index => {
    return {
        type: LEETCODE_CODE_DEFINITION_SELECTED_INDEX,
        payload: index || 0,
    };
};
