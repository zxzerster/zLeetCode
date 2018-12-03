import React, { Component } from 'react';
import {
    View, Text, ActivityIndicator,
} from 'react-native';

import { connect } from 'react-redux';
import { leetcodeCodeDefinition } from '../actions';

type Props = {
    loading: boolean,
    error: Object,
    snippets: Array,
};

const styles = {

};

class ProblemSubmission extends Component<Props> {
    static defaultProps = {
        loading: true,
        error: null,
        snippets: [{
            langSlug: '',
            lang: '',
            code: '',
        }],
    };

    componentDidMount() {
        const { codeDefinition, titleSlug } = this.props;

        codeDefinition(titleSlug);
    }

    render() {
        const { loading } = this.props;

        if (loading) {
            return (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator animating />
                </View>
            );
        }

        // debugger;
        const { snippets } = this.props;

        return (
            <View style={{ flex: 1 }}>
                <View style={{ flex: 4, backgroundColor: 'red' }}>
                    <Text>{snippets[0] ? snippets[0].code : ''}</Text>
                </View>
                <View style={{ flex: 1, backgroundColor: 'blue'}} />
            </View>
        );
    }
}

const mapStateToProps = state => {
    const { codeDefinition } = state;

    return {
        loading: codeDefinition.loading,
        error: codeDefinition.error,
        snippets: codeDefinition.allQuestions ? codeDefinition.allQuestions : [],
        selectedIndex: 0,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        codeDefinition: (...args) => dispatch(leetcodeCodeDefinition(...args)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ProblemSubmission);
