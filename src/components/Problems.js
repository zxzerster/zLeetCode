import React, { Component } from 'react';
import {
    View, FlatList, Alert, InteractionManager,
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
            displayedQuestions: [],
        };

        this.searchRef = React.createRef();
    }

    componentDidMount() {
        this.loadProblems.apply(this);
    }

    refreshProblems = () => {
        const { problems } = this.props;
        const ref = this.searchRef;
        const problemsSelf = this;

        this.setState({ refreshing: true });
        problems(() => {
            const { allQuestions } = problemsSelf.props;

            ref.current.input.clear();
            this.setState({ refreshing: false, error: null, displayedQuestions: allQuestions });
        }, error => {
            this.setState({ refreshing: false, error });
        });
    }

    loadProblems() {
        const { problems } = this.props;
        const problemsSelf = this;

        this.setState({ loading: true });
        problems(() => {
            const { allQuestions, from, tagIds } = problemsSelf.props;

            if (!from) {
                this.setState({ loading: false, error: null, displayedQuestions: allQuestions });
            } else if (from && from === 'SearchTab') {
                this.setState({ loading: false, error: null });
                problemsSelf.doLocalTagSearch(tagIds);
            }
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
                onEndEditing={this.doLocalKeywordSearch}
            />
        );
    }

    doLocalKeywordSearch = () => {
        const { searchKeyword } = this.state;
        const { allQuestions } = this.props;

        if (!searchKeyword || searchKeyword.length < 1) {
            this.setState({ displayedQuestions: allQuestions });
        } else {
            InteractionManager.runAfterInteractions(() => {
                const searched = _.filter(allQuestions, ({ title }) => {
                    const a = title.toLowerCase();
                    const b = searchKeyword.toLowerCase();

                    return a.includes(b);
                });

                this.setState({ displayedQuestions: searched });
            });
        }
    }

    doLocalTagSearch = ids => {
        const { allQuestions } = this.props;

        if (!ids || ids.length < 1) {
            this.setState({ displayedQuestions: allQuestions });
        } else {
            InteractionManager.runAfterInteractions(() => {
                const searched = _.filter(allQuestions, ({ questionId }) => {
                    return ids.includes(parseInt(questionId, 10));
                });

                this.setState({ displayedQuestions: searched });
            });
        }
    }

    renderItem = ({ item, index }) => {
        const { from } = this.props;

        return <ProblemItem problem={item} index={index} from={from} />;
    }

    render() {
        const { container } = styles;
        const { from } = this.props;
        const {
            loading, error, refreshing, displayedQuestions,
        } = this.state;
        const r = from ? null : refreshing;
        const ra = from ? null : this.refreshProblems;
        const searchBar = from ? null : this.searchBar;
        // const { searchKey, questionIds } = filter;
        // let questions = allQuestions;
        // // TODO: think out a good names for these two variables.
        // const r = from ? null : refreshing;
        // const ra = from ? null : this.refreshProblems;

        // if (from && from === 'SearchTab') {
        //     if (questionIds && questionIds.length > 0) {
        //         questions = this.doLocalTagSearch(questionIds);
        //     }
        // } else if (searchKey && searchKey.length > 0) {
        //     questions = this.doLocalKeywordSearch(searchKey);
        // }

        return (
            <LoadingErrorWrapper loading={loading} error={error} errorReload={this.loadProblems}>
                {() => (
                    <View style={[container, { marginTop: 0 }]}>
                        <FlatList
                            style={{ backgroundColor: 'white' }}
                            data={displayedQuestions}
                            keyExtractor={item => item.questionId}
                            renderItem={this.renderItem}
                            refreshing={r}
                            onRefresh={ra}
                            ListHeaderComponent={searchBar}
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
