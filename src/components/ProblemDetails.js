import React, { Component } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import * as actions from '../actions';

class ProblemDetails extends Component {

    static onEnter(props) {
        console.log(`problemdetails`);
        
    }
    // static onEnter(props) {
    //     console.log(`Enter titleSlug: ${this.props.titleSlug}, title: ${this.props.problemTitle}`);
    // }

    runCodeEmpty() {
        console.log('Trying to run code');
        const { csrftoken, LEETCODE_SESSION } = this.props.session;
        const { questionId, judgeType, titleSlug } = this.props.problem.data;
        const problemInput = {
            question_id: questionId,
            judge_type: judgeType,
            data_input: this.dataInput(),
            lang: this.lang(),
            typed_code: this.typedCodeEmpty()
        }

        this.props.runCode(problemInput, titleSlug, csrftoken, LEETCODE_SESSION);
    }

    runCodeCorrect() {
        console.log('Trying to run code');
        const { csrftoken, LEETCODE_SESSION } = this.props.session;
        const { questionId, judgeType, titleSlug } = this.props.problem.data;
        const problemInput = {
            question_id: questionId,
            judge_type: judgeType,
            data_input: this.dataInput(),
            lang: this.lang(),
            typed_code: this.typedCodeCorrect()
        }

        this.props.runCode(problemInput, titleSlug, csrftoken, LEETCODE_SESSION);
    }

    runCodeWrong() {
        console.log('Trying to run code');
        const { csrftoken, LEETCODE_SESSION } = this.props.session;
        const { questionId, judgeType, titleSlug } = this.props.problem.data;
        const problemInput = {
            question_id: questionId,
            judge_type: judgeType,
            data_input: this.dataInput(),
            lang: this.lang(),
            typed_code: this.typedCodeWrong()
        }

        this.props.runCode(problemInput, titleSlug, csrftoken, LEETCODE_SESSION);
    }

    dataInput() {
        return '[2, 7, 11, 15]\n9';
    }

    lang() {
        return 'python';
    }

    typedCodeEmpty() {
        return '';
    }

    typedCodeCorrect() {
        return "class Solution(object):\n    def twoSum(self, nums, target):\n        \"\"\"\n        :type nums: List[int]\n        :type target: int\n        :rtype: List[int]\n        \"\"\"\n        \n        indices = []\n        length = len(nums)\n        for i in range(0, length):\n            del indices[:]\n            remaining = target - nums[i]\n            indices.append(i)\n            for j in range(i + 1, length):\n                if nums[j] == remaining:\n                    indices.append(j)\n                    return indices\n\n        return indices\n        ";
    }

    typedCodeWrong() {
        return "abc";
    }

    componentDidMount() {
        const {csrftoken, LEETCODE_SESSION} = this.props.session;
        const {titleSlug} = this.props;
        this.props.fetchProblem(titleSlug, csrftoken, LEETCODE_SESSION);
    }

    renderRuncodeResult() {
        if (this.props.runcode) {
            return (
                <View>
                    <Text>`state: {this.props.runcode.result.state}`</Text>
                    <Text>`run success: ${this.props.runcode.result.run_success ? 'success' : 'failed'}`</Text>
                    <Text>`runtime error: ${this.props.runcode.result.runtime_error}`</Text>
                </View>
            )
        }
    }

    render() {
        return (
            <View>
                <Text>{this.props.problem.data.content}</Text>
                {this.renderRuncodeResult()}
                <TouchableOpacity onPress={this.runCodeEmpty.bind(this)}>
                    <Text>'Run Code with Empty Code'</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={this.runCodeCorrect.bind(this)}>
                    <Text>'Run Code with Correct Code'</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={this.runCodeWrong.bind(this)}>
                    <Text>'Run Code with Wrong Code'</Text>
                </TouchableOpacity>
            </View>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        session: state.session,
        problem: state.problem,
        runcode: state.runcode
    };
}

export default connect(mapStateToProps, actions)(ProblemDetails);