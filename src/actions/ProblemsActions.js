import {
    LEETCODE_ALL_PROBLEMS, LEETCODE_ALL_PROBLEMS_SUCCESS, LEETCODE_ALL_PROBLEMS_FAILED,
    LEETCODE_PROBLEM, LEETCODE_PROBLEM_SUCCESS, LEETCODE_PROBLEM_FAILED,
    LEETCODE_RUN_CODE, LEETCODE_RUN_CODE_SUCCESS, LEETCODE_RUN_CODE_FAILED,
    LEETCODE_EXPECTED_RESULT_SUCCESS, LEETCODE_EXPECTED_RESULT_FAILED,
    LEETCODE_SUBMIT_CODE, LEETCODE_SUBMIT_CODE_SUCCESS, LEETCODE_SUBMIT_CODE_FAILED,
} from './types';
import {
    URLs,
    leetcodeGetFetch,
    leetcodePostFetch,
    leetcodeGraphqlFetch,
} from '../network';
import { Problems, ProblemDetails } from '../network/query';

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

export const leetcodeProblems = () => {
    return ({ csrftoken, LEETCODE_SESSION }) => dispatch => {
        dispatch({ type: LEETCODE_ALL_PROBLEMS });
        leetcodeGraphqlFetch(csrftoken, LEETCODE_SESSION, Problems)
        .then(resp => {
            if (resp.status !== 200) {
                dispatch({ type: LEETCODE_ALL_PROBLEMS_FAILED });

                return Promise.resolve();
            }

            resp.json().then(json => {
                const { allQuestions } = json.data;

                dispatch({ type: LEETCODE_ALL_PROBLEMS_SUCCESS, payload: allQuestions });
            });

            return Promise.resolve();
        })
        .catch(error => {
            dispatch({ type: LEETCODE_ALL_PROBLEMS_FAILED, error });
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
