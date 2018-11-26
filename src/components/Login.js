import React, { Component } from 'react';
import {
    View, TouchableOpacity, Text, Linking,
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import { FormValidationMessage, FormInput, Button } from 'react-native-elements';

import { connect } from 'react-redux';
import { leetcodeLogin } from '../actions';
import { URLs } from '../network';

import LeetcodeIcon from './common/LeetcodeIcon';

const styles = {
    root: {
        flex: 1,
    },
    icon: {
        flex: 2,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 60,
    },
    inputContainer: {
        flex: 5,
        justifyContent: 'flex-start',
        marginTop: 20,
        // backgroundColor: 'blue',
    },
    errorContainer: {
        flex: 2,
        marginTop: 5,
        numberOfLines: 3,
        // backgroundColor: 'red',
    },
    submitContainer: {
        flex: 12,
        marginTop: 50,
        // backgroundColor: 'yellow',
    },
    forgot: {
        marginTop: 15,
        marginLeft: 15,
    },
    forgotText: {
        color: '#BEBEBE',
    },
    submit: {
        backgroundColor: 'rgb(0, 122, 255)',
        borderRadius: 5,
        height: 48,
    },
    submitDisabled: {
        backgroundColor: '#888888',
        opacity: 0.6,
    },
};

class Login extends Component {
    static forgotPassword() {
        Linking.openURL(URLs.forgot);
    }

    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
        };
        this.pwdRef = React.createRef();
        this.nameRef = React.createRef();

        this.startLogin = false;
    }

    componentDidUpdate(prevProps) {
        const { error, loading } = this.props;

        if (error && error.length >= 0) {
            this.nameRef.current.focus();
            this.pwdRef.current.input.clear();
        }

        if (prevProps.loading && !loading && !error) {
            Actions.main();
        }
    }

    login() {
        const { username, password } = this.state;
        const { login } = this.props;

        this.startLogin = true;
        login(username, password);
    }

    enableLoginButton() {
        const { username, password } = this.state;
        const { loading } = this.props;
        const disable = (username.length < 1 || password.length < 3) || loading;

        return disable;
    }

    renderErrorMessage() {
        const { error } = this.props;

        if (error && error.length >= 0) {
            return (
                <FormValidationMessage>{error}</FormValidationMessage>
            );
        }

        return <View />;
    }

    render() {
        const {
            root, icon, inputContainer, submitContainer, forgot, errorContainer, forgotText, submit, submitDisabled,
        } = styles;
        const { username, password } = this.state;
        const { loading } = this.props;

        return (
            <View style={root}>
                <View style={icon}>
                    <LeetcodeIcon size={{ width: 135, height: 135 }} />
                </View>
                <View style={inputContainer}>
                    <View>
                        <FormInput ref={this.nameRef} placeholder="Username or E-mail" autoFocus autoCapitalize="none" autoCorrect={false} value={username} onChangeText={text => this.setState({ username: text })} />
                    </View>
                    <View style={{ marginTop: 20 }}>
                        <FormInput ref={this.pwdRef} placeholder="Password" secureTextEntry value={password} onChangeText={text => this.setState({ password: text })} />
                    </View>
                    <View style={errorContainer}>
                        {this.renderErrorMessage()}
                    </View>
                    <View style={submitContainer}>
                        <Button buttonStyle={submit} disabledStyle={submitDisabled} loading={loading} title={loading ? '' : 'Sign in'} disabled={this.enableLoginButton()} onPress={() => this.login()} />
                        <TouchableOpacity style={forgot} onPress={() => this.forgotPassword()}>
                            <Text style={forgotText}>Forgot Password?</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    }
}

const mapStateToProps = state => {
    const { session } = state;

    return session;
};

const mapDispatchToProps = dispatch => {
    return {
        login: (...args) => dispatch(leetcodeLogin(...args)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);

// class Login extends Component {
//     Login() {
//         const { leetcodeLogin } = this.props;

//         leetcodeLogin('zxz_er', '454127927');
//     }

//     Longout() {
//         const { leetcodeLogout } = this.props;

//         leetcodeLogout();
//     }

//     userProfile() {
//         const { leetcodeUserProfile } = this.props;

//         leetcodeUserProfile();
//     }

//     allProblems() {
//         const { leetcodeAllProblems } = this.props;

//         leetcodeAllProblems();
//     }

//     problemDetail() {
//         const { leetcodeProblemDetail } = this.props;

//         leetcodeProblemDetail('two-sum');
//     }

//     runCode() {
//         const { leetcodeRunCode } = this.props;
//         const titleSlug = 'two-sum';
//         const input = {
//             question_id: '1',
//             judge_type: 'small',
//             data_input: '[2, 7, 11, 15]\n9',
//             lang: 'python',
//             typed_code: 'class Solution(object):\n    def twoSum(self, nums, target):\n        \"\"\"\n        :type nums: List[int]\n        :type target: int\n        :rtype: List[int]\n        \"\"\"\n        \n        indices = []\n        length = len(nums)\n        for i in range(0, length):\n            del indices[:]\n            remaining = target - nums[i]\n            indices.append(i)\n            for j in range(i + 1, length):\n                if nums[j] == remaining:\n                    indices.append(j)\n                    return indices\n\n        return indices\n        ',
//         };

//         leetcodeRunCode(input, titleSlug);
//     }

//     render() {
//         return (
//             <View>
//                 <TouchableOpacity onPress={() => this.Login()}>
//                     <Text>Login</Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity onPress={() => this.logout()}>
//                     <Text>Logout</Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity onPress={() => this.userProfile()}>
//                     <Text>User Profile</Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity onPress={() => this.allProblems()}>
//                     <Text>All Problems</Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity onPress={() => this.problemDetail()}>
//                     <Text>Problem Detail</Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity onPress={() => this.runCode()}>
//                     <Text>Run Code</Text>
//                 </TouchableOpacity>
//             </View>
//         );
//     }
// }

// export default connect(null, actions)(Login);
