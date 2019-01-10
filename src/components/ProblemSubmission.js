import React, { Component } from 'react';
import {
    View, Text, ScrollView, TextInput, TouchableOpacity, ActivityIndicator, SafeAreaView,
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import _ from 'lodash';

import { connect } from 'react-redux';
import { leetcodeCodeDefinition, leetcodeRunCode, leetcodeSubmitCode } from '../actions';
import { ColorScheme } from '../utils/Config';

import SubmissionResultModal from './common/SubmissionResultModal';
import LoadingErrorWrapper from './common/LoadingErrorWrapper';

const styles = {
    loadingErrorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: ColorScheme.white,
    },
    editorWrapper: {
        flex: 1,
        margin: 8,
    },
    toolBarRootStyle: {
        shadowColor: 'black',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 1 },
        flexDirection: 'row-reverse',
        height: 55,
        backgroundColor: 'rgb(250, 250, 250)',
    },
    toolBarActionStyle: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 80,
        backgroundColor: ColorScheme.hardRed,
    },
    toolBarActionTextStyle: {
        fontSize: 18,
        color: ColorScheme.white,
    },
    toolBarLoading: {
        width: 160,
        backgroundColor: ColorScheme.lightGray,
        justifyContent: 'center',
    },
};

type Props = {
    navigation: Object,

    titleSlug: string,
    questionId: string,
    judgeType: string,
    snippets: Array,
    selectedIndex: number,
    sampleTestCase: string,
    result?: {
        code_output: Array,
        status_code: number,
        lang: string,
        run_success: boolean,
        status_rumtime: string,
        full_runtime_error: string,
        status_msg: string,
        state: string,
    },
    expected?: {
        status_code: number,
        lang: string,
        code_output: Array,
        code_answer: Array,
        status_runtime: string,
        run_success: boolean,
        status_msg: string,
        state: string,
    },
    submitResult?: {
        status_code: number,
        code_output: string,
        std_output: string,
        compare_result: string,
        memory: number,
        display_runtime: string,
        question_id: string,
        lang: string,
        judge_type: string,
        run_success: boolean,
        compile_error: string,
        full_compile_error: string,
        total_correct: object,
        total_testcase: object,
        status_runtime: string,
        runtime_percentile: object,
        pretty_lang: string,
        submission_id: string,
        input_formatted: string,
        input: string,
        expected_output: string,
        status_msg: string,
        state: string,
    },
    from?: string,
    codeDefinition: (string, boolean => void, string => void) => void,
    runCode: (string, string, boolean => void, string => void, boolean => void, string => void) => void,
    submitCode: (string, string, boolean => void, string => void) => void,
};

class ProblemSubmission extends Component<Props> {
    static defaultProps = {
        result: {
            code_output: [],
            status_code: 0,
            lang: '',
            run_success: false,
            status_rumtime: '',
            full_runtime_error: '',
            status_msg: '',
            state: '',
        },
        expected: {
            status_code: 0,
            lang: '',
            code_output: [],
            code_answer: [],
            status_runtime: '',
            run_success: false,
            status_msg: '',
            state: '',
        },
        submitResult: {
            status_code: -1,
            code_output: '',
            std_output: '',
            compare_result: '',
            memory: 0,
            display_runtime: '',
            question_id: '',
            lang: '',
            judge_type: '',
            run_success: false,
            compile_error: '',
            full_compile_error: '',
            total_correct: null,
            total_testcase: null,
            status_runtime: '',
            runtime_percentile: null,
            pretty_lang: '',
            submission_id: '',
            input_formatted: '',
            input: '',
            expected_output: '',
            status_msg: '',
            state: '',
        },
        from: null,
    };

    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            error: null,
            uploading: false,
            code: '',
            showResult: false,
            type: 'run',
            runResult: {
                titleText: '',
                errorText: '',
                input: '',
                output: '',
                expect: '',
            },
            submitResult: {
                titleText: '',
                errorText: '',
                input: '',
                output: '',
                expect: '',

                passed: '',
                time: '',
                submitFailed: false,
            },
        };
    }

    componentDidMount() {
        const { navigation } = this.props;

        navigation.setParams({ onRight: this.onRight });
        this.loadCodeDefinition.apply(this);
    }

    componentDidUpdate(prevProps) {
        const { snippets, selectedIndex } = this.props;

        if (selectedIndex !== prevProps.selectedIndex) {
            this.updateRightTitle();
            this.setState({ code: snippets[selectedIndex] ? snippets[selectedIndex].code : '' });
        }
    }

    onRight = () => {
        this.langSelection();
    }

    setRightTitle = rightTitle => {
        const { navigation } = this.props;

        navigation.setParams({ rightTitle });
    }

    updateRightTitle() {
        const { snippets, selectedIndex } = this.props;

        if (snippets.length > 0) {
            this.setRightTitle(snippets[selectedIndex].lang);
        } else {
            this.setRightTitle('');
        }
    }

    loadCodeDefinition = () => {
        const { codeDefinition, titleSlug } = this.props;
        const completionHandler = () => {
            const { snippets, selectedIndex } = this.props;

            this.setState({ loading: false, error: null, code: snippets[selectedIndex] ? snippets[selectedIndex].code : '' });
            this.updateRightTitle();
        };
        const errorHandler = error => {
            this.setState({ loading: false, error });
            this.setRightTitle('');
        };

        this.setState({ loading: true });
        codeDefinition(titleSlug, completionHandler.bind(this), errorHandler.bind(this));
    }

    langSelection = () => {
        const { snippets, selectedIndex, from } = this.props;
        const langsConfig = _.map(snippets, value => {
            return { lang: value.langSlug, displayName: value.lang };
        });

        if (from && from === 'SearchTab') {
            Actions.taggedCodelangselector({ langsConfig, selectedIndex });
        } else {
            Actions.codelangselector({ langsConfig, selectedIndex });
        }
    }

    codeSubmitParam = (code, lang, questionId) => {
        return {
            question_id: questionId,
            lang,
            typed_code: code,
        };
    };

    codeInput = (code, paramInput, questionId, judgeType, lang) => {
        return {
            question_id: questionId,
            judge_type: judgeType,
            data_input: paramInput,
            lang,
            typed_code: code,
        };
    };

    submitIt = () => {
        const {
            submitCode, titleSlug, questionId,
        } = this.props;
        const { snippets, selectedIndex } = this.props;
        const lang = snippets[selectedIndex].langSlug;
        const { code } = this.state;
        const inputOutter = this.codeSubmitParam(code, lang, questionId);

        this.setState({ uploading: true });
        submitCode(inputOutter, titleSlug,
            // Run part callback
            () => {
                const { submitResult } = this.props;
                const {
                    title, error, passed, time, input, output, expected, submitFailed,
                } = this.processSubmitResult(submitResult);

                this.setState({ uploading: false });
                // debugger;
                this.showSubmitResult(title, error, submitFailed, passed, time, input, output, expected);
                // this.showRunResult(titleText, inputText, outputText, expectText, errorText);
                // console.log('Submit successfully');
            },
            error => {
                console.log('Submit failed');
                this.setState({ uploading: false, error });
            });
    };

    processSubmitResult = submitResult => {
        const title = submitResult.status_msg;
        const passed = `${submitResult.total_correct}/${submitResult.total_testcases} test cases passed`;
        let error = '';
        let time = '';
        let input = '';
        let output = '';
        let expected = '';
        let submitFailed = false;

        if (submitResult.run_success) {
            if (submitResult.total_correct === submitResult.total_testcases) {
                time = `Runtime: ${submitResult.status_runtime}`;
            } else {
                if (submitResult.full_compile_error) {
                    error = submitResult.full_compile_error;
                }

                input = submitResult.input_formatted;
                output = submitResult.code_output;
                expected = submitResult.expected_output;
                submitFailed = true;
            }
        } else {
            error = submitResult.full_compile_error;
        }

        return {
            title,
            error,
            passed,
            time,
            input,
            output,
            expected,
            submitFailed,
        };
    };

    runIt = () => {
        const {
            runCode, titleSlug, questionId, judgeType, sampleTestCase,
        } = this.props;
        const { snippets, selectedIndex } = this.props;
        const lang = snippets[selectedIndex].langSlug;
        const { code } = this.state;
        const input = this.codeInput(code, sampleTestCase, questionId, judgeType, lang);
        let rc = 0;

        this.setState({ uploading: true });
        runCode(input, titleSlug,
            // Run part callback
            () => {
                rc += 1;
                if (rc === 2) {
                    const { result, expected } = this.props;
                    const { titleText, inputText, outputText, expectText, errorText } = this.processRuncodeResult(result, expected);

                    this.setState({ uploading: false });
                    this.showRunResult(titleText, inputText, outputText, expectText, errorText);
                }
            },
            error => {
                this.setState({ uploading: false, error });
            },
            // Expected part callback
            () => {
                rc += 1;
                if (rc === 2) {
                    const { result, expected } = this.props;
                    const { titleText, inputText, outputText, expectText, errorText } = this.processRuncodeResult(result, expected);

                    this.setState({ uploading: false });
                    this.showRunResult(titleText, inputText, outputText, expectText, errorText);
                }
            },
            error => {
                this.setState({ uploading: false, error });
            });
    }

    processRuncodeResult = (result, expected) => {
        const { sampleTestCase } = this.props;
        const title = `${result.status_msg}`;
        let input;
        let output;
        let expect;
        let errorMsg;

        // Run success dones't mean run correctly, it means no compilation errors only.
        if (result.run_success) {
            input = `${sampleTestCase}`;
            output = result.code_answer ? `${result.code_answer}` : 'null';
            expect = expected.code_answer ? `${expected.code_answer}` : 'null';
        } else {
            errorMsg = `${result.full_compile_error}`;
        }

        return {
            titleText: title,
            inputText: input,
            outputText: output,
            expectText: expect,
            errorText: errorMsg,
        };
    }

    showSubmitResult = (title, error, submitFailed, passed, time, input, output, expect) => {
        this.setState({
            showResult: true,
            type: 'submit',
            submitResult: {
                titleText: title,
                errorText: error,
                input,
                output,
                expect,
                passed,
                time,
                submitFailed,
            },
        });
    };

    showRunResult = (title, input, output, expect, error) => {
        this.setState({
            showResult: true,
            type: 'run',
            runResult: {
                titleText: title,
                input,
                output,
                expect,
                errorText: error,
            },
        });
    }

    renderToolbar = () => {
        const { uploading } = this.state;
        const {
            toolBarRootStyle, toolBarActionStyle, toolBarActionTextStyle, toolBarLoading,
        } = styles;
        const renderActions = () => {
            return (
                <View style={toolBarRootStyle}>
                    <TouchableOpacity
                        style={toolBarActionStyle}
                        onPress={this.submitIt}
                    >
                        <Text style={toolBarActionTextStyle}>Submit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[toolBarActionStyle, { backgroundColor: ColorScheme.easyGreen }]}
                        onPress={this.runIt}
                    >
                        <Text style={toolBarActionTextStyle}>Run</Text>
                    </TouchableOpacity>
                </View>
            );
        };
        const renderLoading = () => {
            return (
                <View style={toolBarRootStyle}>
                    <View style={toolBarLoading}>
                        <ActivityIndicator animating color="white" />
                    </View>
                </View>
            );
        };

        if (uploading) {
            return renderLoading();
        }

        return renderActions();
    };

    render() {
        const {
            loading, error, code, showResult, type, runResult, submitResult,
        } = this.state;
        const {
            editorWrapper,
        } = styles;
        // const { snippets, selectedIndex } = this.props;
        // const id = 'login_input_accessory_id';

        const input = type === 'run' ? runResult.input : submitResult.input;
        const output = type === 'run' ? runResult.output : submitResult.output;
        const expect = type === 'run' ? runResult.expect : submitResult.expect;
        const titleText = type === 'run' ? runResult.titleText : submitResult.titleText;
        const errorText = type === 'run' ? runResult.errorText : submitResult.errorText;
        const passed = type === 'run' ? null : submitResult.passed;
        const time = type === 'run' ? null : submitResult.time;
        const submitFailed = type === 'run' ? false :submitResult.submitFailed;

        return (
            <LoadingErrorWrapper loading={loading} error={error} errorReload={this.loadCodeDefinition}>
                {() => (
                    <SafeAreaView style={{ flex: 1 }}>
                        <ScrollView style={{ backgroundColor: ColorScheme.white }}>
                            <View style={editorWrapper}>
                                <TextInput
                                    multiline
                                    onChangeText={text => { this.setState({ code: text }); }}
                                    value={code}
                                />
                            </View>
                        </ScrollView>
                        {this.renderToolbar()}
                        <SubmissionResultModal
                            type={type}
                            visible={showResult}
                            title={titleText}
                            input={input}
                            output={output}
                            expected={expect}
                            error={errorText}
                            passed={passed}
                            time={time}
                            submitFailed={submitFailed}
                            pressHandler={() => this.setState({ showResult: false })}
                        />
                    </SafeAreaView>
                )}
            </LoadingErrorWrapper>
        );
    }
}

const mapStateToProps = state => {
    const { codeDefinition } = state;
    const { runcode, submitcode } = state;

    return {
        snippets: codeDefinition.allQuestions,
        selectedIndex: codeDefinition.selectedIndex,
        result: runcode.result,
        expected: runcode.expected,
        submitResult: submitcode.result,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        codeDefinition: (...args) => dispatch(leetcodeCodeDefinition(...args)),
        runCode: (...args) => dispatch(leetcodeRunCode(...args)),
        submitCode: (...args) => dispatch(leetcodeSubmitCode(...args)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ProblemSubmission);
