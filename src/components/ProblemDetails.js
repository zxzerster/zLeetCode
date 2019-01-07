import React, { Component } from 'react';
import {
    View, Text, ScrollView, TouchableOpacity, SafeAreaView,
} from 'react-native';
import { Badge, Icon } from 'react-native-elements';
import { Actions } from 'react-native-router-flux';
import HTMLView from 'react-native-htmlview';
import { connect } from 'react-redux';
import _ from 'lodash';

import LoadingErrorWrapper from './common/LoadingErrorWrapper';
import { leetcodeProblemDetail } from '../actions';

import { ColorScheme } from '../utils/Config';

const HTMLStyles = {
    p: {
        marginBottom: -35,
        marginTop: 15,
        fontSize: 16,
        color: ColorScheme.textDarkGray,
        lineHeight: 21,
    },
    strong: {
        color: ColorScheme.textDarkerGray,
        fontWeight: '600',
    },
    pre: {
        color: ColorScheme.textDarkerGray,
        lineHeight: 21,
    },
};

const styles = {
    HTMLText: {
        borderWidth: 0,
        borderColor: ColorScheme.lightGrayBackground,
        backgroundColor: ColorScheme.lightGrayBackground,
        borderRadius: 5,
        padding: 8,
    },
    titleWrapper: {
        backgroundColor: 'white',
        shadowColor: 'black',
        shadowOpacity: 0.05,
        shadowOffset: { width: 0, height: 1 },
    },
    titleStyle: {
        flex: 17,
        fontSize: 22,
        fontWeight: '700',
        color: ColorScheme.textDarkGray,
        paddingTop: 15,
        paddingRight: 15,
        paddingLeft: 15,
    },
    titleIcon: {
        flex: 8,
        justifyContent: 'center',
        alignItems: 'flex-start',
        paddingTop: 10,
        paddingRight: 15,
    },
    easyGreen: {
        backgroundColor: ColorScheme.easyGreen,
    },
    mediumYellow: {
        backgroundColor: ColorScheme.mediumYellow,
    },
    hardRed: {
        backgroundColor: ColorScheme.hardRed,
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
        width: 120,
        backgroundColor: ColorScheme.hardRed,
    },
    toolBarActionTextStyle: {
        fontSize: 18,
        color: ColorScheme.white,
    },
};

type Props = {
    problemDetails: (string, boolean => void, string => void) => void,
    titleSlug: string,
    detail: {
        titleSlug: string,
        title: string,
        content: string,
        questionId: string,
        judgeType: string,
        difficulty: string,
        likes: number,
        dislikes: number,
        categoryTitle: string,
        stats: string,
        similarQuestions: string,
        sampleTestCase: string,
        topicTags: Array<Object>,
    },
    from?: string,
};

class ProblemDetails extends Component<Props> {
    static defaultProps = {
        from: null,
    };

    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            error: null,
        };
    }

    componentDidMount() {
        this.loadProblemDetails.apply(this);
    }

    resolveQuestion = (titleSlug, title, questionId, judgeType, sampleTestCase) => {
        const { from } = this.props;

        if (from && from === 'SearchTab') {
            Actions.taggedProblemSubmission({
                titleSlug, title, questionId, judgeType, from, sampleTestCase,
            });
        } else {
            Actions.problemSubmission({
                titleSlug, title, questionId, judgeType, sampleTestCase,
            });
        }
    }

    loadProblemDetails() {
        const { problemDetails, titleSlug } = this.props;
        const completionHandler = () => {
            this.setState({ loading: false, error: null });
        };
        const errorHandler = error => {
            this.setState({ loading: false, error });
        };

        this.setState({ loading: true });
        problemDetails(titleSlug, completionHandler.bind(this), errorHandler.bind(this));
    }

    renderBlocks = (node, index, siblings, parent, defaultRenderer) => {
        if (node.type === 'text' && node.data.trim() === '') {
            return null;
        }

        if (node.type === 'tag') {
            const { HTMLText } = styles;

            if (node.name === 'pre') {
                return (
                    <Text key={index} style={HTMLText}>
                        {defaultRenderer(node.children, parent)}
                    </Text>
                );
            }

            if (node.name === 'div') {
                return (
                    <View>
                        {defaultRenderer(node.children, parent)}
                    </View>
                );
            }
        }

        if (node.type === 'text' && parent && parent.type === 'tag' && parent.name === 'span') {
                node.data += '\n';
        }

        return undefined;
    }

    renderSimilars = similars => {
        return _.map(similars, similar => {
            return (
                <Badge key={similar.title} containerStyle={{ marginHorizontal: 2, backgroundColor: ColorScheme.lightGrayBackground }}>
                    <Text style={{ color: ColorScheme.textGray, fontSize: 10 }}>{similar.title}</Text>
                </Badge>
            );
        });
    }

    renderStats = statsObj => {
        if (statsObj) {
            return (
                <View style={{ flexDirection: 'row', margin: 4 }}>
                    <Text style={{ marginHorizontal: 8, color: ColorScheme.textGray }}>
                        Subs:
                        <Text style={{ color: ColorScheme.textDarkGray, marginLeft: 4 }}>  {`${statsObj.totalSubmission}`}</Text>
                    </Text>
                    <Text style={{ marginHorizontal: 8, color: ColorScheme.textGray }}>
                        Total:
                        <Text style={{ color: ColorScheme.textDarkGray, marginLeft: 4 }}>  {`${statsObj.totalAccepted}`}</Text>
                    </Text>
                    <Text style={{ marginHorizontal: 8, color: ColorScheme.textGray }}>
                        Rate:
                        <Text style={{ color: ColorScheme.textDarkGray, marginLeft: 4 }}>  {`${statsObj.acRate}`}</Text>
                    </Text>
                </View>
            );
        }

        return null;
    }

    renderToolbar = (titleSlug, title, questionId, judgeType, sampleTestCase) => {
        const { toolBarRootStyle, toolBarActionStyle, toolBarActionTextStyle } = styles;

        return (
            <View style={toolBarRootStyle}>
                <TouchableOpacity
                    style={toolBarActionStyle}
                    onPress={() => this.resolveQuestion(titleSlug, title, questionId, judgeType, sampleTestCase)}
                >
                    <Text style={toolBarActionTextStyle}>Resolve</Text>
                </TouchableOpacity>
            </View>
        );
    };

    render() {
        const {
            titleWrapper, titleStyle, titleIcon,
            easyGreen, mediumYellow, hardRed,
        } = styles;
        const { loading, error } = this.state;
        const { detail } = this.props;
        const {
            title, questionId, difficulty, likes, dislikes, titleSlug, similarQuestions, stats, judgeType, sampleTestCase,
        } = detail;
        let similars = null;
        let statsObj = null;
        let difficultyColor;

        if (difficulty === 'Easy') {
            difficultyColor = easyGreen;
        } else if (difficulty === 'Medium') {
            difficultyColor = mediumYellow;
        } else {
            difficultyColor = hardRed;
        }

        if (similarQuestions) {
            similars = JSON.parse(similarQuestions);
        }

        if (stats) {
            statsObj = JSON.parse(stats);
        }

        return (
            <LoadingErrorWrapper loading={loading} error={error} errorReload={this.loadProblemDetails}>
                {() => (
                    <SafeAreaView style={{ flex: 1, backgroundColor: ColorScheme.white }}>
                        <View style={titleWrapper}>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={titleStyle}>{`#${questionId} ${title}`}</Text>
                                <View style={titleIcon}>
                                    <Badge containerStyle={[{ width: 70, marginTop: 5 }, difficultyColor]}>
                                        <Text style={{ fontSize: 11, color: ColorScheme.white }}>{detail.difficulty}</Text>
                                    </Badge>
                                    <View style={{ flexDirection: 'row' }}>
                                        <View style={{ flexDirection: 'row', marginRight: 8 }}>
                                            <Icon type="simple-line-icon" name="like" size={14} color={ColorScheme.lightGray} containerStyle={{ marginTop: 4, marginRight: 5 }} />
                                            <Text style={{ fontSize: 12, marginTop: 5, color: ColorScheme.textGray }}>{likes}</Text>
                                        </View>
                                        <View style={{ flexDirection: 'row' }}>
                                            <Icon type="simple-line-icon" name="dislike" size={14} color={ColorScheme.lightGray} containerStyle={{ marginTop: 4, marginRight: 5 }} />
                                            <Text style={{ fontSize: 12, marginTop: 5, color: ColorScheme.textGray }}>{dislikes}</Text>
                                        </View>
                                    </View>
                                </View>
                            </View>
                            <ScrollView horizontal style={{ marginTop: 5, paddingBottom: 8 }}>
                                {this.renderSimilars(similars)}
                            </ScrollView>
                            {this.renderStats(statsObj)}
                        </View>
                        <ScrollView style={{ flex: 2 }}>
                            <HTMLView
                                style={{ marginHorizontal: 12 }}
                                value={detail.content}
                                renderNode={this.renderBlocks}
                                stylesheet={HTMLStyles}
                            />
                        </ScrollView>
                        {this.renderToolbar(titleSlug, title, questionId, judgeType, sampleTestCase)}
                    </SafeAreaView>
                )}
            </LoadingErrorWrapper>
        );
    }
}

const mapStateToProps = state => {
    const { problem } = state;

    return {
        loading: problem.loading,
        error: problem.error,
        detail: problem.question,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        problemDetails: (...args) => dispatch(leetcodeProblemDetail(...args)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ProblemDetails);

// class ProblemDetails extends Component {

//     static onEnter(props) {
//         console.log(`problemdetails`);
        
//     }
//     // static onEnter(props) {
//     //     console.log(`Enter titleSlug: ${this.props.titleSlug}, title: ${this.props.problemTitle}`);
//     // }

//     runCodeEmpty() {
//         console.log('Trying to run code');
//         const { csrftoken, LEETCODE_SESSION } = this.props.session;
//         const { questionId, judgeType, titleSlug } = this.props.problem.data;
//         const problemInput = {
//             question_id: questionId,
//             judge_type: judgeType,
//             data_input: this.dataInput(),
//             lang: this.lang(),
//             typed_code: this.typedCodeEmpty()
//         }

//         this.props.runCode(problemInput, titleSlug, csrftoken, LEETCODE_SESSION);
//     }

//     runCodeCorrect() {
//         console.log('Trying to run code');
//         const { csrftoken, LEETCODE_SESSION } = this.props.session;
//         const { questionId, judgeType, titleSlug } = this.props.problem.data;
//         const problemInput = {
//             question_id: questionId,
//             judge_type: judgeType,
//             data_input: this.dataInput(),
//             lang: this.lang(),
//             typed_code: this.typedCodeCorrect()
//         }

//         this.props.runCode(problemInput, titleSlug, csrftoken, LEETCODE_SESSION);
//     }

//     runCodeWrong() {
//         console.log('Trying to run code');
//         const { csrftoken, LEETCODE_SESSION } = this.props.session;
//         const { questionId, judgeType, titleSlug } = this.props.problem.data;
//         const problemInput = {
//             question_id: questionId,
//             judge_type: judgeType,
//             data_input: this.dataInput(),
//             lang: this.lang(),
//             typed_code: this.typedCodeWrong()
//         }

//         this.props.runCode(problemInput, titleSlug, csrftoken, LEETCODE_SESSION);
//     }

//     submitCode() {
//         const { csrftoken, LEETCODE_SESSION } = this.props.session;
//         const { questionId, titleSlug } = this.props.problem.data;
//         const problemInput = {
//             question_id: questionId,
//             lang: this.lang(),
//             typed_code: this.typedSubmissionCode()
//         }

//         this.props.submitCode(problemInput, titleSlug, csrftoken, LEETCODE_SESSION);
//     }

//     dataInput() {
//         return '[2, 7, 11, 15]\n9';
//     }

//     lang() {
//         return 'python';
//     }

//     typedCodeEmpty() {
//         return '';
//     }

//     typedCodeCorrect() {
//         return "class Solution(object):\n    def twoSum(self, nums, target):\n        \"\"\"\n        :type nums: List[int]\n        :type target: int\n        :rtype: List[int]\n        \"\"\"\n        \n        indices = []\n        length = len(nums)\n        for i in range(0, length):\n            del indices[:]\n            remaining = target - nums[i]\n            indices.append(i)\n            for j in range(i + 1, length):\n                if nums[j] == remaining:\n                    indices.append(j)\n                    return indices\n\n        return indices\n        ";
//     }

//     typedCodeWrong() {
//         return "abc";
//     }

//     typedSubmissionCode() {
//         return "class Solution(object):\n    def twoSum(self, nums, target):\n        \"\"\"\n        :type nums: List[int]\n        :type target: int\n        :rtype: List[int]\n        \"\"\"\n        \n        indices = []\n        length = len(nums)\n        for i in range(0, length):\n            del indices[:]\n            remaining = target - nums[i]\n            indices.append(i)\n            for j in range(i + 1, length):\n                if nums[j] == remaining:\n                    indices.append(j)\n                    return indices\n\n        return indices\n        "
//     }

//     componentDidMount() {
//         const {csrftoken, LEETCODE_SESSION} = this.props.session;
//         const {titleSlug} = this.props;
//         this.props.fetchProblem(titleSlug, csrftoken, LEETCODE_SESSION);
//     }

//     renderRuncodeResult() {
//         if (this.props.runcode) {
//             return (
//                 <View>
//                     <Text>`state: {this.props.runcode.result.state}`</Text>
//                     <Text>`run success: ${this.props.runcode.result.run_success ? 'success' : 'failed'}`</Text>
//                     <Text>`runtime error: ${this.props.runcode.result.runtime_error}`</Text>
//                 </View>
//             )
//         }
//     }

//     render() {
//         return (
//             <View>
//                 <Text>{this.props.problem.data.content}</Text>
//                 {this.renderRuncodeResult()}
//                 <TouchableOpacity onPress={this.runCodeEmpty.bind(this)}>
//                     <Text>'Run Code with Empty Code'</Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity onPress={this.runCodeCorrect.bind(this)}>
//                     <Text>'Run Code with Correct Code'</Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity onPress={this.runCodeWrong.bind(this)}>
//                     <Text>'Run Code with Wrong Code'</Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity onPress={this.submitCode.bind(this)}>
//                     <Text>'Submit Code!'</Text>
//                 </TouchableOpacity>
//             </View>
//         )
//     }
// }

// const mapStateToProps = (state) => {
//     return {
//         session: state.session,
//         problem: state.problem,
//         runcode: state.runcode
//     };
// }

// export default connect(mapStateToProps, actions)(ProblemDetails);