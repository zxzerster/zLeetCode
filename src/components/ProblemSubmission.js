import React, { Component } from 'react';
import {
    View, Text, ActivityIndicator, TouchableOpacity,
} from 'react-native';
import { Button } from 'react-native-elements';
import { Actions } from 'react-native-router-flux';
import _ from 'lodash';

import { connect } from 'react-redux';
import { leetcodeCodeDefinition, leetcodeRunCode, leetcodeSubmitCode } from '../actions';

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

    langSelection() {
        const { snippets, selectedIndex } = this.props;
        const langsConfig = _.map(snippets, value => {
            return { lang: value.langSlug, displayName: value.lang };
        });

        Actions.codelangselector({ langsConfig, selectedIndex });
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

        const { snippets, selectedIndex } = this.props;

        return (
            <View style={{ flex: 1 }}>
                <View style={{ flex: 4, backgroundColor: 'red' }}>
                    <Text>{snippets[selectedIndex] ? snippets[selectedIndex].code : ''}</Text>
                </View>
                <View style={{ flex: 1, flexDirection: 'row', backgroundColor: 'blue' }}>
                    <TouchableOpacity onPress={this.langSelection.bind(this)}>
                        <Text>{snippets.length > 0 ? snippets[selectedIndex].lang : ''}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <Text>Check Solutions</Text>
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <Text>Discussions</Text>
                    </TouchableOpacity>
                </View>
                <View style={{ flexDirection: 'row' }}>
                    <Button title="Run it" />
                    <Button title="Submit" />
                </View>
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
        selectedIndex: codeDefinition.selectedIndex,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        codeDefinition: (...args) => dispatch(leetcodeCodeDefinition(...args)),
        runCode: (...args) => dispatch(leetcodeRunCode(...args)),
        submitCode: (...args) => dispatch(leetcodeSubmitCode(...args)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ProblemSubmission);
