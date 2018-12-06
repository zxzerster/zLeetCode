import React, { Component } from 'react';
import {
    View, TouchableOpacity, Text,
    Linking, Keyboard, Animated,
    InputAccessoryView, Alert, Button as NativeButton,
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import {
    FormInput, Button,
} from 'react-native-elements';

import { connect } from 'react-redux';
import { leetcodeLogin } from '../actions';
import { URLs } from '../network';

import LeetcodeIcon from './common/LeetcodeIcon';

const ICON_HEIGTH = 135;

const styles = {
    root: {
        flex: 1,
        backgroundColor: 'white',
    },
    iconContainer: {
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

type LoginProps = {
    login: (string, string, boolean => void, string => void) => void
};

class Login extends Component<LoginProps> {
    static defaultProps = {
        error: '',
    };

    static forgotPassword() {
        Linking.openURL(URLs.forgot);
    }

    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            loading: false,
            error: '',
        };
        this.pwdRef = React.createRef();
        this.nameRef = React.createRef();

        this.paddingBottom = new Animated.Value(0);
        this.iconHeight = new Animated.Value(ICON_HEIGTH);
    }

    componentDidMount() {
        this.keyboardWillShowListener = Keyboard.addListener('keyboardWillShow', this.keyboardWillShow.bind(this));
        this.keyboardWillHideListener = Keyboard.addListener('keyboardWillHide', this.keyboardWillHide.bind(this));
    }

    componentWillUnmount() {
        this.keyboardWillShowListener.remove();
        this.keyboardWillHideListener.remove();
    }

    keyboardWillShow(event) {
        // Animated.parallel([
        //     Animated.timing(this.paddingBottom, {
        //         duration: event.duration,
        //         toValue: event.endCoordinates.height,
        //     }),
        //     Animated.timing(this.iconHeight, {
        //         duration: event.duration,
        //         toValue: ICON_HEIGTH * 0.65,
        //     }),
        // ]).start();

        Animated.timing(this.paddingBottom, {
            duration: event.duration,
            toValue: event.endCoordinates.height,
        }).start();
    }

    keyboardWillHide(event) {
        // Animated.parallel([
        //     Animated.timing(this.paddingBottom, {
        //         duration: event.duration,
        //         toValue: 0,
        //     }),
        //     Animated.timing(this.iconHeight, {
        //         duration: event.duration,
        //         toValue: ICON_HEIGTH,
        //     }),
        // ]).start();

        Animated.timing(this.paddingBottom, {
            duration: event.duration,
            toValue: 0,
        }).start();
    }

    login() {
        const { username, password } = this.state;
        const { login } = this.props;

        this.pwdRef.current.input.blur();
        this.setState({ loading: true });
        login(username, password,
            () => {
                this.setState({ loading: false });
                this.setState({ username: '', password: '' });
                Actions.main();
            },
            error => {
                // console.log(error);
                this.setState({ loading: false });
                Alert.alert('Login failed', error, [{ text: 'OK' }]);
            });
    }

    handleNameInputEnterPressed() {
        this.pwdRef.current.input.focus();
    }

    render() {
        const {
            root, iconContainer, inputContainer, submitContainer, forgot, forgotText, submit, submitDisabled,
        } = styles;
        const {
            username, password, loading,
        } = this.state;
        const leftIcon = loading ? {} : { name: 'arrow-upward', size: 23 };
        const title = loading ? '' : 'Sign in';
        const id = 'alskdjf';

        return (
            <Animated.View style={[root, { paddingBottom: this.paddingBottom }]}>
                <View style={iconContainer}>
                    <LeetcodeIcon />
                </View>
                <View style={inputContainer}>
                        <FormInput
                            ref={this.nameRef}
                            inputAccessoryViewID={id}
                            returnKeyType="next"
                            placeholder="Username or E-mail"
                            autoCapitalize="none"
                            autoCorrect={false}
                            value={username}
                            onChangeText={text => this.setState({ username: text })}
                            onSubmitEditing={() => this.handleNameInputEnterPressed()}
                        />
                        <FormInput
                            ref={this.pwdRef}
                            inputAccessoryViewID={id}
                            returnKeyType="go"
                            placeholder="Password"
                            secureTextEntry
                            value={password}
                            onChangeText={text => this.setState({ password: text })}
                            onSubmitEditing={() => this.login()}
                        />
                        <InputAccessoryView nativeID={id}>
                            <View style={{ flex: 1, backgroundColor: 'rgb(213, 213, 213)', alignItems: 'flex-end', justifyContent: 'center' }}>
                                <NativeButton onPress={() => Keyboard.dismiss()} title="Ok" />
                            </View>
                        </InputAccessoryView>
                    <View style={submitContainer}>
                        <Button
                            leftIcon={leftIcon}
                            buttonStyle={submit}
                            disabledStyle={submitDisabled}
                            loading={loading}
                            title={title}
                            onPress={() => this.login()}
                        />
                        <TouchableOpacity style={forgot} onPress={() => Login.forgotPassword()}>
                            <Text style={forgotText}>Forgot Password?</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Animated.View>
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
