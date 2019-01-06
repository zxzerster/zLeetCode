import React, { Component } from 'react';
import {
    View, Text, ScrollView, TextInput,
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import _ from 'lodash';

import { connect } from 'react-redux';
import { leetcodeCodeDefinition, leetcodeRunCode, leetcodeSubmitCode } from '../actions';
import FloatingButton from './common/FloatingButton';
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
    from?: string,
    codeDefinition: (string, boolean => void, string => void) => void,
    runCode: (string, string, boolean => void, string => void, boolean => void, string => void) => void,
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
            input: '',
            output: '',
            expect: '',
            errorText: '',
            resultText: '',
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

    codeInput = (code, paramInput, questionId, judgeType, lang) => {
        return {
            question_id: questionId,
            judge_type: judgeType,
            data_input: paramInput,
            lang,
            typed_code: code,
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

    showRunResult = (title, input, output, expect, error) => {
        this.setState({ showResult: true, titleText: title, input, output, expect, errorText: error });
    }

    renderActionButton(str) {
        const { uploading } = this.state;
        const { ButtonTitle } = styles;

        if (uploading) {
            return <ActivityIndicator color="white" animating />;
        }

        return <Text style={ButtonTitle}>{str}</Text>;
    }

    render() {
        const {
            loading, error, uploading, code, showResult, titleText, input, output, expect, errorText,
        } = this.state;
        const {
            editorWrapper,
        } = styles;
        // const { snippets, selectedIndex } = this.props;
        // const id = 'login_input_accessory_id';

        return (
            <LoadingErrorWrapper loading={loading} error={error} errorReload={this.loadCodeDefinition}>
                {() => (
                    <View style={{ flex: 1 }}>
                        <ScrollView style={{ backgroundColor: ColorScheme.white }}>
                            <View style={editorWrapper}>
                                <TextInput
                                    multiline
                                    onChangeText={text => { this.setState({ code: text }); }}
                                    value={code}
                                />
                            </View>
                        </ScrollView>
                        {/* <View style={paramsWrapper}>
                            <Text style={paramsTitle}>Input here</Text>
                            <TextInput
                                style={paramsInput}
                                inputAccessoryViewID={id}
                                returnKeyType="done"
                                multiline
                                clearButtonMode="while-editing"
                                autoCorrect={false}
                                autoCapitalize="none"
                                value={params}
                                onChangeText={text => this.setState({ params: text })}
                            />
                            <InputAccessoryView nativeID={id}>
                                <View style={inputAccessory}>
                                    <Button onPress={() => Keyboard.dismiss()} title="Ok" />
                                </View>
                            </InputAccessoryView>
                        </View> */}
                        <View style={{ flexDirection: 'row' }}>
                            <FloatingButton
                                style={{ marginLeft: 15, marginBottom: 15 }}
                                position="left"
                                title="S"
                                color={ColorScheme.hardRed}
                            />
                            <FloatingButton
                                style={{ marginRight: 15, marginBottom: 15 }}
                                position="right"
                                loading={uploading}
                                title="R"
                                color={ColorScheme.easyGreen}
                                onPress={this.runIt}
                            />
                        </View>
                        <SubmissionResultModal
                            visible={showResult}
                            title={titleText}
                            input={input}
                            output={output}
                            expected={expect}
                            error={errorText}
                            pressHandler={() => this.setState({ showResult: false })}
                        />
                    </View>
                )}
            </LoadingErrorWrapper>
        );
    }
}

const mapStateToProps = state => {
    const { codeDefinition } = state;
    const { runcode } = state;

    return {
        snippets: codeDefinition.allQuestions,
        selectedIndex: codeDefinition.selectedIndex,
        result: runcode.result,
        expected: runcode.expected,
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
