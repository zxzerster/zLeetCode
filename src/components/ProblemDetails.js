import React, { Component } from 'react';
import {
    View, Text, Animated, ScrollView, TouchableOpacity, LayoutAnimation,
} from 'react-native';
import { Badge, Icon } from 'react-native-elements';
import { Actions } from 'react-native-router-flux';
import HTMLView from 'react-native-htmlview';
import { connect } from 'react-redux';
import _ from 'lodash';

import { leetcodeProblemDetail } from '../actions';

import LeetcodeIcon from './common/LeetcodeIcon';

const ANIMATION_DURATION = 1000;
const OPACITY = 0.2;

const HTMLStyles = {
    p: {
        paddingHorizontal: 15,
        marginBottom: -35,
        marginTop: 15,
        fontSize: 16,
        color: 'rgb(89, 89, 89)',
        lineHeight: 21,
    },
    ul: {
        paddingHorizontal: 15,
    },
    strong: {
        color: 'rgb(38, 50, 56)',
        fontWeight: '600',
    },
    pre: {
        color: 'rgb(38, 50, 56)',
    },
};

const styles = {
    HTMLText: {
        borderWidth: 1,
        borderColor: '#f7f9fa',
        backgroundColor: '#f7f9fa',
        margin: 15,
        borderRadius: 5,
        padding: 8,
    },
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
        // padding: 10,
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
    titleWrapper: {
        backgroundColor: 'white',
        shadowColor: 'black',
        shadowOpacity: 0.05,
        shadowOffset: { width: 0, height: 1 },
        // paddingBottom: 8,
    },
    titleStyle: {
        flex: 17,
        fontSize: 22,
        fontWeight: '700',
        color: 'rgb(73, 78, 82)',
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
    resolveButton: {
        width: 55,
        height: 55,
        borderRadius: 27,
        backgroundColor: 'rgb(64, 137, 214)',
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
    easyGreen: {
        backgroundColor: 'rgb(116,181, 102)',
    },
    mediumYellow: {
        backgroundColor: 'rgb(231, 175, 95)',
    },
    hardRed: {
        backgroundColor: 'rgb(202, 92, 84)',
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
        stats: '',
        similarQuestions: '',
        topicTags: Array<Object>,
    },
};

class ProblemDetails extends Component<Props> {
    static renderBlocks(node, index, siblings, parent, defaultRenderer) {
        if (node.type === 'text' && node.data.trim() === '') {
            return null;
        }

        if (node.type === 'tag' ) {
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

    static resolveQuestion(titleSlug) {
        Actions.problemSubmission({ titleSlug });
    }

    static renderSimilars(similars) {
        return _.map(similars, similar => {
            return (
                <Badge containerStyle={{ marginHorizontal: 2, backgroundColor: 'lightgray' }}>
                    <Text style={{ color: 'white', fontSize: 10 }}>{similar.title}</Text>
                </Badge>
            );
        });
    }

    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            error: null,
        };
        this.fade = new Animated.Value(OPACITY);
    }

    componentDidMount() {
        this.loadProblemDetails.apply(this);
    }

    loadProblemDetails() {
        const { problemDetails, titleSlug } = this.props;

        this.setState({ loading: true });
        this.animatedLoading();
        problemDetails(titleSlug, () => {
            LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
            this.setState({ loading: false });
        }, error => {
            LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
            this.setState({ loading: false, error });
        });
    }

    animatedLoading() {
        Animated.loop(
            Animated.sequence([
                Animated.timing(
                    this.fade,
                    {
                        toValue: 1,
                        duration: ANIMATION_DURATION,
                    }
                ),
                Animated.timing(
                    this.fade,
                    {
                        toValue: OPACITY,
                        duration: ANIMATION_DURATION,
                    }
                ),
            ])
        ).start();
    }

    render() {
        const {
            loadingErrorContainer, errorString, reloadButton, reloadButtonTitle,
            titleWrapper, titleStyle, titleIcon,
            resolveButton,
            easyGreen, mediumYellow, hardRed,
        } = styles;
        const { loading, error } = this.state;
        const { detail } = this.props;
        const {
            title, questionId, difficulty, likes, dislikes, titleSlug, similarQuestions,
        } = detail;
        let similars = null;
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

        // const { content}

        // let content = detail ? (detail.content || '') : '';
        // let title = detail ? (detail.title || '') : '';
        // let titleSlug = detail ? (detail.titleSlug || '') : '';
        // let questionId = detail ? (detail.questionId || '') : '';
        // let likes = detail ? (detail.likes || 0) : 0;
        // let dislikes = detail ? (detail.dislikes || 0) : 0;
        // let difficulty = detail ? (detail.difficulty || ' ') : ' ';
        // let isLiked = detail ? (detail.isLiked || ' ') : ' ';
        // const content = detail.content || '';

        console.log(`${similars}`);

        if (loading) {
            return (
                <View style={loadingErrorContainer}>
                    <Animated.View style={{ ...this.props.style, opacity: this.fade }}>
                        <LeetcodeIcon />
                    </Animated.View>
                </View>
            );
        }

        if (error) {
            return (
                <View style={loadingErrorContainer}>
                   <LeetcodeIcon />
                   <Text style={errorString}>{error}</Text>
                   <TouchableOpacity style={reloadButton} onPress={() => { this.loadProblemDetails(); }}>
                       <Text style={reloadButtonTitle}>Reload it</Text>
                   </TouchableOpacity>
                </View>
            );
        }

        return (
            <View style={{ flex: 1, backgroundColor: 'white' }}>
                <View style={titleWrapper}>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={titleStyle}>{`#${questionId} ${title}`}</Text>
                        <View style={titleIcon}>
                            <Badge containerStyle={[{ width: 70, marginTop: 5 }, difficultyColor]}>
                                <Text style={{ fontSize: 11, color: 'white' }}>{detail.difficulty}</Text>
                            </Badge>
                            <View style={{ flexDirection: 'row' }}>
                                <View style={{ flexDirection: 'row', marginRight: 8 }}>
                                    <Icon type="simple-line-icon" name="like" size={14} color="gray" containerStyle={{ marginTop: 4, marginRight: 5 }} />
                                    <Text style={{ fontSize: 12, marginTop: 5, color: 'gray' }}>{likes}</Text>
                                </View>
                                <View style={{ flexDirection: 'row' }}>
                                    <Icon type="simple-line-icon" name="dislike" size={14} color="gray" containerStyle={{ marginTop: 4, marginRight: 5 }} />
                                    <Text style={{ fontSize: 12, marginTop: 5, color: 'gray' }}>{dislikes}</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                    <ScrollView horizontal style={{ marginTop: 5, paddingBottom: 8 }}>
                        {ProblemDetails.renderSimilars(similars)}
                    </ScrollView>
                </View>
                <ScrollView style={{ flex: 2 }}>
                    <HTMLView
                        value={detail.content}
                        renderNode={ProblemDetails.renderBlocks}
                        stylesheet={HTMLStyles}
                    />
                </ScrollView>
                <TouchableOpacity style={resolveButton} onPress={() => ProblemDetails.resolveQuestion(titleSlug)}>
                    <Text style={{ color: 'white', fontSize: 34, fontWeight: '600' }}>+</Text>
                </TouchableOpacity>
            </View>
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