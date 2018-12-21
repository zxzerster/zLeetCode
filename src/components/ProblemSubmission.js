import React, { Component } from 'react';
import {
    View, Text, TouchableOpacity, ScrollView,
    Alert, ActivityIndicator, TextInput, Button,
    KeyboardAvoidingView, Keyboard, InputAccessoryView,
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import _ from 'lodash';

import { connect } from 'react-redux';
import { leetcodeCodeDefinition, leetcodeRunCode, leetcodeSubmitCode } from '../actions';

import LoadingErrorWrapper from './common/LoadingErrorWrapper';

// Temparay test code
const emptyCode = '';
const wrongCode = 'abc';
const correctCode = 'class Solution(object):\n    def twoSum(self, nums, target):\n        \"\"\"\n        :type nums: List[int]\n        :type target: int\n        :rtype: List[int]\n        \"\"\"\n        \n        indices = []\n        length = len(nums)\n        for i in range(0, length):\n            del indices[:]\n            remaining = target - nums[i]\n            indices.append(i)\n            for j in range(i + 1, length):\n                if nums[j] == remaining:\n                    indices.append(j)\n                    return indices\n\n        return indices\n        ';

const codeInput = (questionId, judgeType) => {
    return {
        question_id: questionId,
        judge_type: judgeType,
        data_input: '[2, 7, 11, 15]\n9',
        lang: 'python',
        typed_code: correctCode,
    };
};
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
    Submit: {
        width: 55,
        height: 55,
        borderRadius: 27,
        backgroundColor: 'rgb(210, 64, 59)',
        opacity: 0.8,
        position: 'absolute',
        bottom: 0,
        right: 0,
        marginRight: 15,
        marginBottom: 15,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.3,
    },
    Run: {
        width: 55,
        height: 55,
        borderRadius: 27,
        backgroundColor: 'rgb(115, 175, 79)',
        opacity: 0.8,
        position: 'absolute',
        bottom: 0,
        left: 0,
        marginLeft: 15,
        marginBottom: 15,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.3,
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
    paramsWrapper: {
        backgroundColor: 'white',
        height: 180,
    },
    paramsTitle: {
        marginTop: 8,
        fontSize: 18,
        fontWeight: '500',
        color: 'gray',
        marginHorizontal: 8,
    },
    paramsInput: {
        backgroundColor: 'white',
        flex: 1,
        margin: 8,
        borderRadius: 5,
        shadowColor: 'black',
        shadowOpacity: 0.2,
        shadowOffset: { width: 0, height: 1 },
    },
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
    };

    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            error: null,
            uploading: false,
        };
    }

    componentDidMount() {
        const { navigation } = this.props;

        navigation.setParams({ onRight: this.onRight });
        this.loadCodeDefinition.apply(this);
    }

    componentDidUpdate(prevProps) {
        const { selectedIndex } = this.props;

        if (selectedIndex !== prevProps.selectedIndex) {
            this.updateRightTitle('alsdfjasldkf');
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

    loadCodeDefinition() {
        const { codeDefinition, titleSlug } = this.props;

        this.setState({ loading: true });
        codeDefinition(titleSlug, () => {
            this.setState({ loading: false, error: null });
            this.updateRightTitle();
        }, error => {
            this.setState({ loading: false, error });
            this.setRightTitle('');
        });
    }

    langSelection = () => {
        const { snippets, selectedIndex } = this.props;
        const langsConfig = _.map(snippets, value => {
            return { lang: value.langSlug, displayName: value.lang };
        });

        Actions.codelangselector({ langsConfig, selectedIndex });
    }

    runIt = () => {
        const {
            runCode, titleSlug, questionId, judgeType,
        } = this.props;
        const input = codeInput(questionId, judgeType);
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
        const { loading, error, uploading } = this.state;
        const {
            Run, Submit,
            editorWrapper,
            paramsWrapper, paramsTitle, paramsInput, inputAccessory,
        } = styles;
        const { snippets, selectedIndex } = this.props;
        const id = 'login_input_accessory_id';

        return (
            <LoadingErrorWrapper loading={loading} error={error} errorReload={this.loadCodeDefinition}>
                {() => (
                    <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
                        <ScrollView>
                            <View style={editorWrapper}>
                                <Text>{snippets[selectedIndex] ? snippets[selectedIndex].code : ''}</Text>
                            </View>
                        </ScrollView>
                        <View style={paramsWrapper}>
                            <Text style={paramsTitle}>Input here</Text>
                            <TextInput
                                style={paramsInput}
                                inputAccessoryViewID={id}
                                returnKeyType="done"
                                multiline
                                clearButtonMode="while-editing"
                                autoCorrect={false}
                                autoCapitalize="none"
                            />
                            <InputAccessoryView nativeID={id}>
                                <View style={inputAccessory}>
                                    <Button onPress={() => Keyboard.dismiss()} title="Ok" />
                                </View>
                            </InputAccessoryView>
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <TouchableOpacity style={Submit} disabled={uploading}>
                                {this.renderActionButton('S')}
                            </TouchableOpacity>
                            <TouchableOpacity style={Run} disabled={uploading} onPress={() => this.runIt()}>
                                {this.renderActionButton('R')}
                            </TouchableOpacity>
                        </View>
                    </KeyboardAvoidingView>
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
