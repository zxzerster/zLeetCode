// @flow

import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { connect } from 'react-redux';

import * as actions from '../actions'

import ZLCButton from './common/ZLCButton';

class Logout extends Component  {

    onButtonPress() {
        const {loginToken, LEETCODE_SESSION} = this.props;
        console.log('Logout button pressed');
        actions.leetcodeLogout(loginToken, LEETCODE_SESSION)
    }

    render() {
        console.log(this.props);
        return (
            <View>
                <Text>Logout!</Text>
                <ZLCButton 
                    onPress={this.onButtonPress.bind(this)}
                    title='Logout!'
                />
            </View>
        );
    }
}

const mapStateToProps = (state) => {
    const { loginToken, LEETCODE_SESSION } = state.login;

    return { loginToken, LEETCODE_SESSION };
}

export default connect(mapStateToProps)(Logout);