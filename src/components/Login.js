import React, { Component } from 'react';
import {
    View, TouchableOpacity, Text,
    Linking, Keyboard, InputAccessoryView, NativeModules,
    Alert, Button as NativeButton, KeyboardAvoidingView,
} from 'react-native';
import {
    FormInput, Button, Icon,
} from 'react-native-elements';
import { Actions } from 'react-native-router-flux';

import { connect } from 'react-redux';
import { leetcodeLogin } from '../actions';
import { URLs } from '../network';

import LeetcodeIcon from './common/LeetcodeIcon';

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

    static dimissKeyboard() {
        Keyboard.dismiss();
    }

    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            loading: false,
        };
        this.pwdRef = React.createRef();
        this.nameRef = React.createRef();
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
            submit, submitDisabled, inputAccessory,
        } = styles;
        const {
            username, password, loading,
        } = this.state;
        const leftIcon = loading ? {} : { name: 'arrow-upward', size: 23 };
        const title = loading ? '' : 'Sign in';
        const id = 'login_input_accessory_id';

        return (

            <KeyboardAvoidingView style={root} behavior="padding">
                <View style={iconContainer}>
                    <LeetcodeIcon />
                </View>
                <View style={inputContainer}>
                    <View style={{ flexDirection: 'row', marginBottom: 30 }}>
                        <Icon containerStyle={{ alignSelf: 'center', marginLeft: 10, marginTop: 5 }} type="evilicon" name="user" color="#bababa" size={36} />
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
                        <Icon containerStyle={{ marginLeft: 10 }} type="evilicon" name="lock" color="#bababa" size={36} />
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
                            <NativeButton onPress={Login.dimissKeyboard} title="Ok" />
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
