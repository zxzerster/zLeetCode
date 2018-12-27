import React, { Component } from 'react';
import {
    View, FlatList, InteractionManager, NetInfo,
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
    tagIds: Array,
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

        NetInfo.addEventListener('connectionChange', info => {
            console.log(`connection chagned, info: ${JSON.stringify(info)}`);
        });
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

    loadProblems() {
        const { problems, allQuestions } = this.props;
        const completionHandler = () => {
            const { from, tagIds } = this.props;

            if (!from) {
                this.setState({ loading: false, error: null, displayedQuestions: this.props.allQuestions });
            } else if (from && from === 'SearchTab') {
                this.setState({ loading: false, error: null });
                this.doLocalTagSearch(tagIds);
            }
        };
        const errorHandler = error => {
            this.setState({ loading: false, error });
        };

        if (allQuestions && allQuestions.length > 1) {
            this.setState({ displayedQuestions: allQuestions });
        } else {
            this.setState({ loading: true });
            problems(completionHandler.bind(this), errorHandler.bind(this));
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
