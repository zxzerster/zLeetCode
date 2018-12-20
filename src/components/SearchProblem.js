import React, { Component } from 'react';
import {
    View, TouchableOpacity, Text,
    Linking, Keyboard, InputAccessoryView,
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

class SearchProblem extends Component {
    render() {
        return (
            <View>
                <Text>Search Problem</Text>
            </View>
        );
    }
}

export default SearchProblem;
