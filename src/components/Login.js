import React, { Component } from 'react';
import {
    View, TouchableOpacity, Text,
    Linking, Keyboard, InputAccessoryView, Animated,
    Alert, Button as NativeButton, KeyboardAvoidingView,
} from 'react-native';
import {
    FormInput, Button, Icon,
} from 'react-native-elements';
import { Actions } from 'react-native-router-flux';

import { connect } from 'react-redux';
import { leetcodeLogin } from '../actions';
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
            disabled: true,
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
        const { login } = this.props;
        const completionHandler = () => {
            this.setState({ loading: false });
            this.setState({ username: '', password: '' });
            Actions.main();
        };
        const errorHandler = error => {
            this.setState({ loading: false, username: '', password: '' });
            Alert.alert('Login failed', error, [{ text: 'OK' }]);
        };

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

    render() {
        const {
            root, iconContainer, inputContainer,
            submitContainer, forgot, forgotText,
            submit, inputAccessory,
        } = styles;
        const {
            username, password, loading, disabled,
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
                        <TouchableOpacity disabled={loading} style={forgot} onPress={() => Login.forgotPassword()}>
                            <Text style={forgotText}>Forgot Password?</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>

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
