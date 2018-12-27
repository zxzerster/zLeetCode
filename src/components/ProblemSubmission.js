import React, { Component } from 'react';
import {
    View, Text, TouchableOpacity, ScrollView,
    Alert, ActivityIndicator, TextInput, Button,
    Keyboard, InputAccessoryView,
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import _ from 'lodash';

import { connect } from 'react-redux';
import { leetcodeCodeDefinition, leetcodeRunCode, leetcodeSubmitCode } from '../actions';
import FloatingButton from './common/FloatingButton';

import LoadingErrorWrapper from './common/LoadingErrorWrapper';

// Temparay test code
// const emptyCode = '';
// const wrongCode = 'abc';
// const correctCode = 'class Solution(object):\n    def twoSum(self, nums, target):\n        \"\"\"\n        :type nums: List[int]\n        :type target: int\n        :rtype: List[int]\n        \"\"\"\n        \n        indices = []\n        length = len(nums)\n        for i in range(0, length):\n            del indices[:]\n            remaining = target - nums[i]\n            indices.append(i)\n            for j in range(i + 1, length):\n                if nums[j] == remaining:\n                    indices.append(j)\n                    return indices\n\n        return indices\n        ';

// const codeInput = (questionId, judgeType) => {
//     return {
//         question_id: questionId,
//         judge_type: judgeType,
//         data_input: '[2, 7, 11, 15]\n9',
//         lang: 'python',
//         typed_code: correctCode,
//     };
// };
// Temparay test code

const styles = {
    loadingErrorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
    },
    errorString: {
        fontSize: 24,
        fontWeight: '500',
        color: 'gray',
        marginTop: 20,
    },
    reloadButton: {
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 5,
        width: '35%',
        height: 35,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 15,
    },
    reloadButtonTitle: {
        fontSize: 18,
        color: 'gray',
    },
    ButtonTitle: {
        color: '#eeeeee',
        fontWeight: '600',
        fontSize: 20,
    },
    editorWrapper: {
        flex: 1,
        margin: 8,
    },
    // paramsWrapper: {
    //     backgroundColor: 'white',
    //     height: 180,
    // },
    // paramsTitle: {
    //     marginTop: 8,
    //     fontSize: 18,
    //     fontWeight: '500',
    //     color: 'gray',
    //     marginHorizontal: 8,
    // },
    // paramsInput: {
    //     backgroundColor: 'white',
    //     flex: 1,
    //     margin: 8,
    //     borderRadius: 5,
    //     shadowColor: 'black',
    //     shadowOpacity: 0.2,
    //     shadowOffset: { width: 0, height: 1 },
    // },
    inputAccessory: {
        flex: 1,
        backgroundColor: 'rgb(213, 213, 213)',
        alignItems: 'flex-end',
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
        const problemSubmissionSelf = this;

        this.setState({ loading: true });
        codeDefinition(titleSlug, () => {
            const { snippets, selectedIndex } = problemSubmissionSelf.props;

            problemSubmissionSelf.setState({ loading: false, error: null, code: snippets[selectedIndex] ? snippets[selectedIndex].code : '' });
            problemSubmissionSelf.updateRightTitle();
        }, error => {
            problemSubmissionSelf.setState({ loading: false, error });
            problemSubmissionSelf.setRightTitle('');
        });
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

                    this.setState({ uploading: false });
                    this.showRunResult(result.status_msg, result.full_runtime_error);
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

                    this.setState({ uploading: false });
                    this.showRunResult(result.status_msg, result.full_runtime_error);
                }
            },
            error => {
                this.setState({ uploading: false, error });
            });
    }

    showRunResult = (title, content) => {
        Alert.alert(title, content);
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
            loading, error, uploading, code,
        } = this.state;
        const {
            editorWrapper,
        } = styles;
        // const { snippets, selectedIndex } = this.props;
        const id = 'login_input_accessory_id';

        return (
            <LoadingErrorWrapper loading={loading} error={error} errorReload={this.loadCodeDefinition}>
                {() => (
                    <View style={{ flex: 1 }}>
                        <ScrollView style={{ backgroundColor: 'white' }}>
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
                                color="rgb(210, 64, 59)"
                            />
                            <FloatingButton
                                style={{ marginRight: 15, marginBottom: 15 }}
                                position="right"
                                loading={uploading}
                                title="R"
                                color="rgb(115, 175, 79)"
                                onPress={this.runIt}
                            />
                        </View>
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
