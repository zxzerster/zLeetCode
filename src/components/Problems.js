import React, { Component } from 'react';
import {
    View, FlatList, Alert,
} from 'react-native';
import { SearchBar } from 'react-native-elements';
import _ from 'lodash';
import { connect } from 'react-redux';

import LoadingErrorWrapper from './common/LoadingErrorWrapper';
import ProblemItem from './ProblemItem';
import { leetcodeProblems, leetcodeSetFilterKeyword } from '../actions';

const styles = {
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
};

type ProblemsProps = {
    problems: (boolean => void, string => void) => void,
    filterByKeyword: string => Object,
    allQuestions: {
        title: string,
        titleSlug: string,
        questionId: string,
        difficulty: string,
        status: string,
        like: number,
        dislike: number,
    },
    filter: {
        searchKey: string,
    },
    from?: string,
};

class Problems extends Component<ProblemsProps> {
    static defaultProps = {
        from: null,
    };

    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            error: null,
            refreshing: false,
            searchKeyword: '',
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
        const { problems, filterByKeyword } = this.props;
        const ref = this.searchRef;

        // Clear filter first
        filterByKeyword('');

        this.setState({ refreshing: true });
        problems(() => {
            ref.current.input.clear();
        this.setState({ refreshing: false, error: null });
        }, error => {
            this.setState({ refreshing: false, error });
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

    searchBar = () => {
        const { searchKeyword } = this.state;

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
                value={searchKeyword}
                onChangeText={text => this.setState({ searchKeyword: text })}
                onEndEditing={this.simpleSearchProblems}
            />
        );
    }

    simpleSearchProblems = () => {
        const { filterByKeyword } = this.props;
        const { searchKeyword } = this.state;

        filterByKeyword(searchKeyword);
    }

    doLocalKeywordSearch = key => {
        const { allQuestions } = this.props;

        const searched = _.filter(allQuestions, ({ title }) => {
            const a = title.toLowerCase();
            const b = key.toLowerCase();

            return a.includes(b);
        });

        return searched;
    }

    doLocalTagSearch = ids => {
        const { allQuestions } = this.props;

        const searched = _.filter(allQuestions, ({ questionId }) => {
            return ids.includes(parseInt(questionId, 10));
        });

        return searched;
    }

    renderItem = ({ item, index }) => {
        const { from } = this.props;

        return <ProblemItem problem={item} index={index} from={from} />;
    }

    render() {
        const { container } = styles;
        const { allQuestions, filter, from } = this.props;
        const {
            loading, error, refreshing,
        } = this.state;
        const { searchKey, questionIds } = filter;
        let questions = allQuestions;
        // TODO: think out a good names for these two variables.
        const r = from ? null : refreshing;
        const ra = from ? null : this.refreshProblems;

        if (from && from === 'SearchTab') {
            if (questionIds && questionIds.length > 0) {
                questions = this.doLocalTagSearch(questionIds);
            }
        } else if (searchKey && searchKey.length > 0) {
            questions = this.doLocalKeywordSearch(searchKey);
        }

        return (
            <LoadingErrorWrapper loading={loading} error={error} errorReload={this.loadProblems}>
                {() => (
                    <View style={[container, { marginTop: 0 }]}>
                        <FlatList
                            style={{ backgroundColor: 'white' }}
                            data={questions}
                            keyExtractor={item => item.questionId}
                            renderItem={this.renderItem}
                            refreshing={r}
                            onRefresh={ra}
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
        filter: {
            searchKey: problems.filter.searchKey,
            questionIds: problems.filter.questionIds,
            tags: problems.filter.tags,
        },
    };
};

const mapDispatchToProps = dispatch => {
    return {
        problems: (...args) => dispatch(leetcodeProblems(...args)),
        filterByKeyword: (...args) => dispatch(leetcodeSetFilterKeyword(...args)),
    };
 };

export default connect(mapStateToProps, mapDispatchToProps)(Problems);
