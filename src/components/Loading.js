import React, { Component } from 'react';
import {
    View, ActivityIndicator,
} from 'react-native';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';

import LeetcodeIcon from './common/LeetcodeIcon';
import { leetcodeVerfifySession } from '../actions';

type Props = {
    verify: Function,
    loading: boolean,
    isLoggedIn: boolean,
};

const styles = {
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    indicator: {
        marginTop: 15,
    },
};

class Loading extends Component<Props> {
    static defaultProps = {
        needVerify: true,
    };

    constructor(props) {
        super(props);

        this.shouldUpdate = true;
    }

    componentDidMount() {
        const { verify, needVerify } = this.props;
        
        if (needVerify) {
            verify(
                signedIn => {
                    if (signedIn) {
                        Actions.main();
                    } else {
                        Actions.login();
                    }
                },
                () => {
                    Actions.login();
                }
            );
        } else {
            Actions.login();
        }
    }

    render() {
        const { container, indicator } = styles;

        return (
            <View style={container}>
                <LeetcodeIcon />
                <ActivityIndicator style={indicator} animating />
            </View>
        );
    }
}

const mapDispatchToProps = dispatch => {
    return {
        verify: (...args) => dispatch(leetcodeVerfifySession(...args)),
    };
};

export default connect(null, mapDispatchToProps)(Loading);
