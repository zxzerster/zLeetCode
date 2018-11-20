import React, { Component } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import * as actions from '../actions';

class Login extends Component {
    Login() {
        const { leetcodeLogin } = this.props;

        leetcodeLogin('zxz_er', '454127927');
    }

    Longout() {
        const { leetcodeLogout } = this.props;

        leetcodeLogout();
    }

    userProfile() {
        const { leetcodeUserProfile } = this.props;

        leetcodeUserProfile();
    }

    allProblems() {
        const { leetcodeAllProblems } = this.props;

        leetcodeAllProblems();
    }

    problemDetail() {
        const { leetcodeProblemDetail } = this.props;

        leetcodeProblemDetail('two-sum');
    }

    runCode() {
        const { leetcodeRunCode } = this.props;
        const titleSlug = 'two-sum';
        const input = {
            question_id: '1',
            judge_type: 'small',
            data_input: '[2, 7, 11, 15]\n9',
            lang: 'python',
            typed_code: 'class Solution(object):\n    def twoSum(self, nums, target):\n        \"\"\"\n        :type nums: List[int]\n        :type target: int\n        :rtype: List[int]\n        \"\"\"\n        \n        indices = []\n        length = len(nums)\n        for i in range(0, length):\n            del indices[:]\n            remaining = target - nums[i]\n            indices.append(i)\n            for j in range(i + 1, length):\n                if nums[j] == remaining:\n                    indices.append(j)\n                    return indices\n\n        return indices\n        ',
        };

        leetcodeRunCode(input, titleSlug);
    }

    render() {
        return (
            <View>
                <TouchableOpacity onPress={() => this.Login()}>
                    <Text>Login</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.logout()}>
                    <Text>Logout</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.userProfile()}>
                    <Text>User Profile</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.allProblems()}>
                    <Text>All Problems</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.problemDetail()}>
                    <Text>Problem Detail</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.runCode()}>
                    <Text>Run Code</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

export default connect(null, actions)(Login);
