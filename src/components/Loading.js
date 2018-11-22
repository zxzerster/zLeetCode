import React, { Component } from 'react';
import {
    View, ActivityIndicator,
} from 'react-native';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';

import LeetcodeIcon from './common/LeetcodeIcon';
import { leetcodeVerfifySession } from '../actions';

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

class Loading extends Component {
    componentWillMount() {
        const { verify } = this.props;

        verify();
    }

    componentDidUpdate() {
        const { loading, isLoggedIn } = this.props;

        if (!loading) {
            if (isLoggedIn) {
                Actions.main();
            } else {
                Actions.login();
            }
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

const mapStateToProps = state => {
    const { verification } = state;

    return {
        loading: verification.loading,
        isLoggedIn: verification.isLoggedIn,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        verify: (...args) => dispatch(leetcodeVerfifySession(...args)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Loading);
