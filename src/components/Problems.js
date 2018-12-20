import React, { Component } from 'react';
import {
    View, FlatList, Alert,
} from 'react-native';
import { SearchBar } from 'react-native-elements';
import _ from 'lodash';
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
            searchKeyword: '',
            displayedQuestions: [],
        };

        this.searchRef = React.createRef();
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
        const ref = this.searchRef;

        this.setState({ refreshing: true });
        problems(() => {
            const { allQuestions } = this.props;

            ref.current.input.clear();
            this.setState({ refreshing: false, error: null, displayedQuestions: allQuestions });
        }, error => {
            this.setState({ refreshing: false, error, displayedQuestions: [] });
        });
    }

    loadProblems() {
        const { problems } = this.props;

        this.setState({ loading: true });
        problems(() => {
            const { allQuestions } = this.props;

            this.setState({ loading: false, error: null, displayedQuestions: allQuestions });
        }, error => {
            this.setState({ loading: false, error, displayedQuestions: [] });
        });
    }

    searchBar = () => {
        return (
            <SearchBar
                ref={this.searchRef}
                containerStyle={{ backgroundColor: 'white' }}
                inputContainerStyle={{ backgroundClor: 'white' }}
                inputStyle={{ backgroundColor: '#f7f9fa' }}
                returnKeyType="search"
                lightTheme
                round
                placeholder="Search problems..."
                searchIcon={{ size: 24 }}
                onChangeText={text => this.setState({ searchKeyword: text })}
                onEndEditing={this.simpleSearchProblems}
            />
        );
    }

    simpleSearchProblems = () => {
        const { searchKeyword } = this.state;

        if (searchKeyword && searchKeyword.length > 0) {
            this.doSearch(searchKeyword);
        } else {
            const { allQuestions } = this.props;

            this.setState({ displayedQuestions: allQuestions });
        }
    }

    doSearch = key => {
        const { displayedQuestions } = this.state;

        // TODO: a background worker is needed here!!!
        this.setState({ loading: true });
        const searched = _.filter(displayedQuestions, ({ title }) => {
            const a = title.toLowerCase();
            const b = key.toLowerCase();

            return a.includes(b);
        });

        this.setState({ loading: false, displayedQuestions: searched });
    }

    // onlyOneLevel = difficulty => {

    // }

    // sortAscending = () => {

    // }

    // sortDescending = () => {

    // }

    render() {
        const { container } = styles;
        const {
            displayedQuestions, loading, error, refreshing,
        } = this.state;

        return (
            <LoadingErrorWrapper loading={loading} error={error}>
                {() => (
                    <View style={[container, { marginTop: 0 }]}>
                        <FlatList
                            style={{ backgroundColor: 'white' }}
                            data={displayedQuestions}
                            keyExtractor={item => item.questionId}
                            renderItem={Problems.renderItem}
                            refreshing={refreshing}
                            onRefresh={this.refreshProblems}
                            ListHeaderComponent={this.searchBar}
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
