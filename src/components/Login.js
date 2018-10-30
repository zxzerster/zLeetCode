import React, { Component } from 'react';
import { View, Text, TextInput } from 'react-native';
import { connect } from 'react-redux'; 

import ZLCTextInput from './common/ZLCTextInput';
import ZLCButton from './common/ZLCButton';
import ZLCSpinner from './common/ZLCSpinner';

import * as actions from '../actions'

class Login extends Component {

    state = {username: '', pwd: ''};

    onButtonPress() {
        console.log('button pressed');
        // if (this.props.LEETCODE_SESSION && this.props.LEETCODE_SESSION.length > 0) {
        //     console.log('Login Default');
        //     this.props.leetcodeDefaultLogin(this.props.loginToken, this.props.LEETCODE_SESSION);
        // } else {
        //     console.log('New login');
        //     this.props.leetcodeLogin('zxz_er', '454127927');
        // }
        const {csrftoken, LEETCODE_SESSION} = this.props;
        const {username, pwd} = this.state;
        this.props.leetcodeLogin(username, pwd, csrftoken, LEETCODE_SESSION);
    }

    renderButton() {
        if (this.props.loading) {
            return (
                <ZLCSpinner 
                    animating
                />
            );
        }

        return (
            <ZLCButton 
                onPress={() => this.onButtonPress()}
                title='Click me!'
            />
        );
    }

    renderLoginInfo() {
        return (
            <View>
                <Text>Login Info:</Text>
                <Text>{this.props.LEETCODE_SESSION}</Text>
                <Text>{this.props.csrftoken}</Text>
                <Text>{this.props.username}</Text>
            </View>
        );
    }

    render() {
        return (<View>
            <ZLCTextInput 
                label='User name'
                onChangeText={username => this.setState({ username })}
                value={this.state.username}
            />
            <ZLCTextInput
                label='Password'
                onChangeText={pwd => this.setState({ pwd })}
                value={this.state.pwd}
                secureTextEntry
            />

            {this.renderButton()}
            {this.renderLoginInfo()}
            
        </View>);
    }

}

const mapStateToProps = (state) => {
    return state.login
}

export default connect(mapStateToProps, actions)(Login);