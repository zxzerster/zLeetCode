import React, { Component } from 'react';
import {
    View, TouchableOpacity, Text,
    Linking, Keyboard, InputAccessoryView, Animated,
    Alert, Button as NativeButton, KeyboardAvoidingView, NativeModules,
} from 'react-native';
import {
    FormInput, Button, Icon,
} from 'react-native-elements';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import UserAgent from 'react-native-user-agent';

import LoginModal from './common/LoginModal';
import {
    leetcodeLogin, leetcodeSocialLogin, leetcodeLogout, leetcodeCleanAllProblems, leetcodeCleanUserProfile, leetcodeCleanUserProgress,
} from '../actions';
import { URLs } from '../network';
import { ColorScheme } from '../utils/Config';

import LeetcodeIcon from './common/LeetcodeIcon';

const ORIGINAL_TOP = 0;
const KEYBOARD_SHOW_TOP = -50;

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
        // marginTop: 20,
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
        color: ColorScheme.lightGray,
    },
    submit: {
        backgroundColor: 'rgb(0, 122, 255)',
        borderRadius: 5,
        height: 48,
    },
    inputAccessory: {
        flex: 1,
        backgroundColor: 'rgb(213, 213, 213)',
        alignItems: 'flex-end',
        justifyContent: 'center',
    },
};

type LoginProps = {
    login: (string, string, boolean => void, string => void) => void,
    logout: (boolean => void, string => void) => void,
    cleanProblems: (void) => object,
    cleanProgress: (void) => object,
    cleanProfile: (void) => object,
    username: string,
};



class Login extends Component<LoginProps> {
    static defaultProps = {
        error: '',
    };

    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            loading: false,
            disabled: true,
            showLoginModal: false,
            socialLoginUrl: '',
            agentString: UserAgent.getUserAgent(),
        };
        this.pwdRef = React.createRef();
        this.nameRef = React.createRef();

        this.top = new Animated.Value(ORIGINAL_TOP);
    }

    componentDidMount() {
        const willShowListener = event => {
            Animated.timing(
                this.top,
                {
                    toValue: KEYBOARD_SHOW_TOP,
                    duration: event.duration,
                }
            ).start();
        };
        const willHideListener = event => {
            Animated.timing(
                this.top,
                {
                    toValue: ORIGINAL_TOP,
                    duration: event.duration,
                }
            ).start();
        };

        this.didShow = Keyboard.addListener('keyboardWillShow', willShowListener);
        this.willHide = Keyboard.addListener('keyboardWillHide', willHideListener);
    }

    componentWillUnmount() {
        this.didShow.remove();
        this.willHide.remove();
    }

    dimissKeyboard = () => {
        Keyboard.dismiss();
    }

    login() {
        const { username, password } = this.state;
        const {
            login, logout, cleanProblems, cleanProfile, cleanProgress,
        } = this.props;
        const self = this;
        const completionHandler = () => {
            this.setState({ loading: false });
            this.setState({ username: '', password: '' });
            Actions.reset('main');
        };
        const errorHandler = error => {
            // This is very tricky, because Fetch seems couldn't catch 302,
            // So if server returns 302 which means you've already logged in,
            // We can't extract the SESSION_ID which is included in the 302 response.
            // So for now, if we met the situation which only returns csrftoken but no SESSION_ID
            // We log out first then try log in again which should get both csrftoken and SESSION_ID.
            // But ideally, we should be able capture 302 reponse.
            if (error === 'Try Again') {
                logout(() => {
                    login(
                        username,
                        password,
                        completionHandler.bind(self),
                        errorHandler.bind(self)
                    );
                });
            } else {
                this.setState({ loading: false, username: '', password: '' });
                Alert.alert('Login failed', error, [{ text: 'OK' }]);
            }
        };

        if (username !== this.props.username) {
            cleanProblems();
            cleanProfile();
            cleanProgress();
        }

        this.nameRef.current.input.focus();
        this.setState({ loading: true });
        login(
            username,
            password,
            completionHandler.bind(this),
            errorHandler.bind(this)
        );
    }

    handleNameInputEnterPressed() {
        this.pwdRef.current.input.focus();
    }

    onSocialLoginSuccess = (csrftoken, LEETCODE_SESSION) => {
        const { socialLogin } = this.props;

        socialLogin(csrftoken, LEETCODE_SESSION);
        this.setState({ showLoginModal: false });
        setTimeout(() => {
            Actions.reset('main');
        }, 1000);
    };

    signup = () => {
        Linking.openURL(URLs.signup);
    }

    forgotPassword = () => {
        Linking.openURL(URLs.forgot);
    }

    googleAccountLogin = () => {
        const uesrAgentHandler = NativeModules.UserAgentHandler;

        uesrAgentHandler.setUserAgentForGoogleOnly();
        this.setState({ socialLoginUrl: 'https://leetcode.com/accounts/google/login', showLoginModal: true });
    }

    otherSocialAccoutLogin = url => {
        const { agentString } = this.state;
        const uesrAgentHandler = NativeModules.UserAgentHandler;

        uesrAgentHandler.setDefaultUserAgent(agentString);
        this.setState({ socialLoginUrl: url, showLoginModal: true });
    }

    render() {
        const {
            root, iconContainer, inputContainer,
            submitContainer, forgot, forgotText,
            submit, inputAccessory,
        } = styles;
        const {
            username, password, loading, agentString, showLoginModal, socialLoginUrl,
        } = this.state;
        const leftIcon = loading ? {} : { name: 'arrow-upward', size: 23 };
        const title = loading ? '' : 'Sign in';
        const id = 'login_input_accessory_id';

        return (

            <KeyboardAvoidingView style={root} behavior="padding">
                <View style={iconContainer}>
                    <Animated.View style={{ top: this.top }}>
                        <LeetcodeIcon />
                    </Animated.View>
                </View>
                <View style={inputContainer}>
                    <View style={{ flexDirection: 'row', marginBottom: 30 }}>
                        <Icon containerStyle={{ alignSelf: 'center', marginLeft: 10, marginTop: 5 }} type="evilicon" name="user" color={ColorScheme.lightGray} size={36} />
                        <FormInput
                            ref={this.nameRef}
                            inputAccessoryViewID={id}
                            containerStyle={{ width: '80%', marginLeft: 8 }}
                            returnKeyType="next"
                            placeholder="Username or E-mail"
                            autoCapitalize="none"
                            autoCorrect={false}
                            value={username}
                            onChangeText={text => this.setState({ username: text })}
                            onSubmitEditing={() => this.handleNameInputEnterPressed()}
                        />
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                        <Icon containerStyle={{ marginLeft: 10 }} type="evilicon" name="lock" color={ColorScheme.lightGray} size={36} />
                        <FormInput
                            ref={this.pwdRef}
                            inputAccessoryViewID={id}
                            containerStyle={{ width: '80%', marginLeft: 8 }}
                            returnKeyType="go"
                            placeholder="Password"
                            secureTextEntry
                            value={password}
                            onChangeText={text => this.setState({ password: text })}
                            onSubmitEditing={() => this.login()}
                        />
                    </View>
                    <InputAccessoryView nativeID={id}>
                        <View style={inputAccessory}>
                            <NativeButton onPress={this.dimissKeyboard} title="Ok" />
                        </View>
                    </InputAccessoryView>
                    <View style={submitContainer}>
                        <Button
                            leftIcon={leftIcon}
                            buttonStyle={submit}
                            loading={loading}
                            title={title}
                            onPress={() => this.login()}
                        />
                        {/* <Button
                            leftIcon={leftIcon}
                            buttonStyle={submit}
                            loading={loading}
                            title="google login"
                            onPress={() => this.setState({ showLoginModal: true })}
                        /> */}
                        <View style={{ flex: 1, flexDirection: 'row' }}>
                            <TouchableOpacity disabled={loading} style={[forgot, { flex: 1 }]} onPress={() => this.forgotPassword()}>
                                <Text style={forgotText}>Forgot Password?</Text>
                            </TouchableOpacity>
                            <TouchableOpacity disabled={loading} style={[forgot, { flex: 1, alignItems: 'flex-end', marginLeft: 0, marginRight: 15 }]} onPress={() => this.signup()}>
                                <Text style={forgotText}>Sign up on Web</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{ flex: 4, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginHorizontal: 25 }}>
                            <TouchableOpacity onPress={() => this.otherSocialAccoutLogin('https://leetcode.com/accounts/github/login')}>
                                <Icon type="ionicon" name="logo-github" color={ColorScheme.textGray} size={36} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={this.googleAccountLogin}>
                                <Icon type="ionicon" name="logo-google" color={ColorScheme.textGray} size={36} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => this.otherSocialAccoutLogin('https://leetcode.com/accounts/linkedin/login')}>
                                <Icon type="ionicon" name="logo-linkedin" color={ColorScheme.textGray} size={36} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => this.otherSocialAccoutLogin('https://leetcode.com/accounts/facebook/login')}>
                                <Icon type="ionicon" name="logo-facebook" color={ColorScheme.textGray} size={36} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                <LoginModal
                    visible={showLoginModal}
                    onClose={() => this.setState({ showLoginModal: false })}
                    onSocialLoginSuccess={this.onSocialLoginSuccess}
                    socialLoginUrl={socialLoginUrl}
                />
            </KeyboardAvoidingView>

        );
    }
}

const mapStateToProps = state => {
    const { session: { username } } = state;

    return { username };
};

const mapDispatchToProps = dispatch => {
    return {
        login: (...args) => dispatch(leetcodeLogin(...args)),
        logout: (...args) => dispatch(leetcodeLogout(...args)),
        socialLogin: (...args) => dispatch(leetcodeSocialLogin(...args)),
        cleanProblems: (...args) => dispatch(leetcodeCleanAllProblems(...args)),
        cleanProgress: (...args) => dispatch(leetcodeCleanUserProgress(...args)),
        cleanProfile: (...args) => dispatch(leetcodeCleanUserProfile(...args)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
