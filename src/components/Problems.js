import React, { Component } from 'react';
import {
    View, FlatList, InteractionManager, NativeModules,
} from 'react-native';
import { SearchBar } from 'react-native-elements';
import _ from 'lodash';
import { connect } from 'react-redux';

import withLeetcodeWrapper from './common/withLeetcodeWrapper';
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
    tagIds: Array<string>,
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
        this.backgroundWorker = NativeModules.BackgroundWorkers;
    }

    componentDidMount() {
        this.loadProblems();

        // this.backgroundWorker.doInNativeWithAction(0x100, {
        //     keyworkd: 'Two Sum',
        //     data: [{ title: 'a', id: 1 }, { title: 'b', id: 2 }],
        // });
    }

    refreshProblems = () => {
        const { problems } = this.props;
        const ref = this.searchRef;
        const problemsSelf = this;
        const completionHandler = () => {
            const { allQuestions } = problemsSelf.props;

            ref.current.input.clear();
            this.setState({ refreshing: false, error: null, displayedQuestions: allQuestions });
        };
        const errorHandler = error => {
            this.setState({ refreshing: false, error });
        };

        this.setState({ refreshing: true });
        problems(completionHandler.bind(this), errorHandler.bind(this));
    }

    loadProblems = () => {
        const { problems, allQuestions, from } = this.props;
        const completionHandler = () => {
            const { tagIds } = this.props;

            if (from === 'SearchTab') {
                this.setState({ loading: false, error: null });
                this.doLocalTagSearch(tagIds);
            }
        };
        const errorHandler = error => {
            this.setState({ loading: false, error });
        };

        if (from && from === 'SearchTab') {
            this.setState({ loading: true });
            problems(completionHandler.bind(this), errorHandler.bind(this));
        } else {
            this.setState({ displayedQuestions: allQuestions });
        }
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
            const searchData = _.map(allQuestions, question => {
                return { title: question.title, questionId: question.questionId };
            });

            this.backgroundWorker.doInNativeWithAction(0x100, {
                keyword: searchKeyword,
                data: searchData,
            })
            .then(resp => {
                const ids = _.map(resp, item => {
                    return item.questionId;
                });
                const filtered = _.filter(allQuestions, item => {
                    return ids.includes(item.questionId);
                });

                this.setState({ displayedQuestions: filtered });
            })
            .catch(error => {
                // Should be no errors here. let try to show all questions for now
                // For now, just log errors and do nothing.
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

export default connect(mapStateToProps, mapDispatchToProps)(withLeetcodeWrapper(Problems));
