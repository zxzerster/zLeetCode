import React, { Component } from 'react';
import {
    View, FlatList, Alert,
} from 'react-native';
import { connect } from 'react-redux';

import LoadingErrorWrapper from './common/LoadingErrorWrapper';
import ProblemItem from './ProblemItem';
import { leetcodeProblems } from '../actions';

const styles = {
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
};

type ProblemsProps = {
    problems: (boolean => void, string => void) => void,
    allQuestions: {
        title: string,
        titleSlug: string,
        questionId: string,
        difficulty: string,
        status: string,
        like: number,
        dislike: number,
    },
};

class Problems extends Component<ProblemsProps> {
    static renderItem({ item, index }) {
        return <ProblemItem problem={item} index={index} />;
    }

    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            error: null,
            refreshing: false,
        };
    }

    componentDidMount() {
        this.loadProblems.apply(this);
    }

    onRefresh = () => {
        Alert.alert(
            'Problems',
            'Do you want to reload all problems?',
            [
                { text: 'Cancel' },
                { text: 'Ok', onPress: this.refreshProblems() },
            ],
        );
    }

    refreshProblems = () => {
        const { problems } = this.props;

        this.setState({ refreshing: true });
        problems(() => {
            this.setState({ refreshing: false });
        }, () => {
            this.setState({ refreshing: false });
        });
    }

    loadProblems() {
        const { problems } = this.props;

        this.setState({ loading: true });
        problems(() => {
            this.setState({ loading: false, error: null });
        }, error => {
            this.setState({ loading: false, error });
        });
    }

    render() {
        const { container } = styles;
        const { allQuestions } = this.props;
        const { loading, error, refreshing } = this.state;

        return (
            <LoadingErrorWrapper loading={loading} error={error}>
                {() => (
                    <View style={[container, { marginTop: 0 }]}>
                        <FlatList
                            style={{ backgroundColor: 'white' }}
                            data={allQuestions}
                            keyExtractor={item => item.questionId}
                            renderItem={Problems.renderItem}
                            refreshing={refreshing}
                            onRefresh={this.refreshProblems}
                        />
                    </View>
                )}
            </LoadingErrorWrapper>
        );
    }
}

const mapStateToProps = state => {
    const { problems } = state;

    return {
        allQuestions: problems.allQuestions,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        problems: (...args) => dispatch(leetcodeProblems(...args)),
    };
 };

export default connect(mapStateToProps, mapDispatchToProps)(Problems);
