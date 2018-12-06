// @flow
import React, { Component } from 'react';
import {
    View, ActivityIndicator,
} from 'react-native';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';

import LeetcodeIcon from './common/LeetcodeIcon';
import { leetcodeVerfifySession } from '../actions';

type Props = {
    verify: (boolean => void, Object => void) => void,
};

const styles = {
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
    },
    indicator: {
        marginTop: 15,
    },
};

class Loading extends Component<Props> {
    static defaultProps = {
        needVerify: true,
    };

    componentDidMount() {
        const { verify } = this.props;

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
    }

    render() {
        const { container, indicator } = styles;

        return (
            <View style={container}>
                <LeetcodeIcon width={200} height={200} />
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
