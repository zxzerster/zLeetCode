import React, { Component } from 'react';
import {
    View, Text, ActivityIndicator, ScrollView, TouchableOpacity,
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import HTMLView from 'react-native-htmlview';
import { connect } from 'react-redux';

import { leetcodeProblemDetail } from '../actions';

const HTMLStyles = {
    p: {
        paddingHorizontal: 15,
        marginBottom: -20,
        marginTop: 15,
    },
    ul: {
        paddingHorizontal: 15,
    },
};

type Props = {
    error: Object,
    detail: {
        content: String,
        questionId: String,
        title: String,
    },
};

class ProblemDetails extends Component<Props> {
    static defaultProps = {
        loading: true,
        detail: {
            content: '',
            questionId: '',
            title: '',
        },
    };

    static renderBlocks(node, index, siblings, parent, defaultRenderer) {
        if (node.type === 'text' && node.data.trim() === '') {
            return null;
        }

        if (node.type === 'tag' && node.name === 'pre') {
            return (
                <View key={index} style={{ borderWidth: 1, borderColor: '#f7f9fa', backgroundColor: '#f7f9fa', margin: 15, borderRadius: 5, padding: 8}}>
                    {defaultRenderer(node.children, parent)}
                </View>
            );
        }

        return undefined;
    }

    static resolveQuestion(titleSlug) {
        Actions.problemSubmission({ titleSlug });
    }

    componentDidMount() {
        const { problemDetails, titleSlug } = this.props;

        problemDetails(titleSlug);
    }

    render() {
        const { loading, detail } = this.props;
        let content = detail ? (detail.content || '') : '';
        let title = detail ? (detail.title || '') : '';
        let titleSlug = detail ? (detail.titleSlug || '') : '';
        let questionId = detail ? (detail.questionId || '') : '';
        let likes = detail ? (detail.likes || 0) : 0;
        let dislikes = detail ? (detail.dislikes || 0) : 0;
        let difficulty = detail ? (detail.difficulty || ' ') : ' ';
        let isLiked = detail ? (detail.isLiked || ' ') : ' ';
        // const content = detail.content || '';

        if (loading) {
            return (
                <ActivityIndicator animating />
            );
        }

        console.log(`content: ${content}`);

        return (
            <View style={{ flex: 1 }}>
                <View>
                    <Text><Text>{`#${questionId}`} </Text>{`${title}`}</Text>
                    <View style={{ flexDirection: 'row' }}>
                        <Text>Difficulty : {`${difficulty}`}</Text>
                        <Text>Like : {`${likes}`}</Text>
                        <Text>Dislike :{`${dislikes}`}</Text>
                        <Text>Favorite : {`${isLiked}`}</Text>
                    </View>
                </View>
                <ScrollView style={{ flex: 2 }}>
                    <HTMLView
                        value={content}
                        renderNode={ProblemDetails.renderBlocks}
                        stylesheet={HTMLStyles}
                    />
                </ScrollView>
                <TouchableOpacity style={{ position: 'absolute', bottom: 0, right: 0 }} onPress={() => ProblemDetails.resolveQuestion(titleSlug)}>
                    <Text>Resolve it!</Text>
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