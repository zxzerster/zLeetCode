import React, { Component } from 'react';
import {
    View, Button, ScrollView, FlatList, NativeModules, Text, TouchableOpacity,
} from 'react-native';
import { SearchBar } from 'react-native-elements';
import Popover, { Rect } from 'react-native-popover-view';
import _ from 'lodash';
import { connect } from 'react-redux';

import withLeetcodeWrapper from './common/withLeetcodeWrapper';
import LoadingErrorWrapper from './common/LoadingErrorWrapper';
import ProblemItem from './ProblemItem';
import ProblemRighttButton from './common/ProblemRightButton';
import { leetcodeProblems, leetcodeCleanAllProblems } from '../actions';
import { ColorScheme } from '../utils/Config';
import { Actions } from 'react-native-router-flux';


const EASY = 'Easy';
const MEDIUM = 'Medium';
const HARD = 'Hard';

const styles = {
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    filterButton: {
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderTopColor: ColorScheme.separateLineGray,
        borderTopWidth: 1,
    },
    filterTitle: {
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomColor: ColorScheme.separateLineGray,
        borderBottomWidth: 1,
    },
    filterTitleText: {
        padding: 8,
        fontSize: 20,
        fontWeight: '500',
        color: ColorScheme.textDarkerGray,
    },
    filterItem: {
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        // borderBottomColor: ColorScheme.separateLineGray,
        // borderBottomWidth: 1,
    },
    filterItemText: {
        paddingLeft: 8,
        fontSize: 16,
        fontWeight: '300',
        color: ColorScheme.textDarkGray
    },
};

type ProblemsProps = {
    problems: (boolean => void, string => void) => void,
    isPremiumUser: boolean,
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
    title: string,
    navigation: Object,
};

class Problems extends Component<ProblemsProps> {
    // static onEnter() {
    //     console.log('==========>>>   onEnter');
    // }

    // static onExit() {
    //     console.log('==========>>>   onExit');
    // }
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
            showFilter: false,
        };

        this.searchRef = React.createRef();
        this.backgroundWorker = NativeModules.BackgroundWorkers;
    }

    componentDidMount() {
        const { navigation, from } = this.props;

        if (from && from === 'SearchTab') {
            const { title } = this.props;

            navigation.setParams({ title });
        } else {
            navigation.setParams({ onPress: this.onRight });
            // navigation.setParams({ renderRightButton: this.rightButton() });
            // Actions.refresh({ renderRightButton: this.rightButton(), onRight: () => {} });
        }
        this.loadProblems();
    }

    onRight = () => {

    }

    rightButton = () => {
        return (
            <ProblemRighttButton />
        );
    };

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
        const {
            problems, allQuestions, from, tagIds,
        } = this.props;
        const completionHandler = () => {
            if (from && from === 'SearchTab') {
                this.doLocalTagSearch(tagIds);
            } else {
                const { allQuestions } = this.props;

                this.setState({ displayedQuestions: allQuestions, loading: false, error: null });
            }
        };
        const errorHandler = error => {
            this.setState({ loading: false, error });
        };

        if (allQuestions && allQuestions.length > 0) {
            if (from && from === 'SearchTab') {
                this.doLocalTagSearch(tagIds);
            } else {
                this.setState({ displayedQuestions: allQuestions });
            }
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

    filterByDifficulty = difficulty => {
        const { allQuestions } = this.props;
        const searchData = _.map(allQuestions, question => {
            return { difficulty: question.difficulty, questionId: question.questionId };
        });

        this.backgroundWorker.doInNativeWithAction(0x101, {
            difficulty,
            data: searchData,
        })
        .then(resp => {
            const ids = _.map(resp, item => {
                return item.questionId;
            });
            const filtered = _.filter(allQuestions, item => {
                return ids.includes(item.questionId);
            });

            this.setState({ displayedQuestions: filtered, showFilter: false });
        })
        .catch(error => {
            this.setState({ showFilter: false });
        });
    };

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
            const searchData = _.map(allQuestions, question => {
                return { questionId: question.questionId };
            });

            this.backgroundWorker.doInNativeWithAction(0x102, {
                tags: ids,
                data: searchData,
            })
            .then(resp => {
                const result = _.map(resp, item => {
                    return item.questionId;
                });
                const filtered = _.filter(allQuestions, item => {
                    return result.includes(item.questionId);
                });

                this.setState({ displayedQuestions: filtered });
            })
            .catch(error => {
                // Should be no errors here. let try to show all questions for now
                // For now, just log errors and do nothing.
            });
        }
    }

    errorLoading = () => {
        const { cleanProblems } = this.props;

        cleanProblems();
        this.loadProblems();
    }

    renderItem = ({ item, index }) => {
        const { from, isPremiumUser } = this.props;

        return <ProblemItem isPremiumUser={isPremiumUser} problem={item} index={index} from={from} />;
    }

    render() {
        const {
            container, filterButton, filterTitle, filterTitleText, filterItem, filterItemText,
        } = styles;
        const { from } = this.props;
        const {
            loading, error, refreshing, displayedQuestions, showFilter,
        } = this.state;
        const r = from ? null : refreshing;
        const ra = from ? null : this.refreshProblems;
        const searchBar = from ? null : this.searchBar;
        const all = () => {
            const { allQuestions } = this.props;
            const ref = this.searchRef;

            ref.current.input.clear();
            this.setState({ showFilter: false, displayedQuestions: allQuestions });
        };

        return (
            <LoadingErrorWrapper loading={loading} error={error} errorReload={this.errorLoading}>
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
                        <Popover
                            isVisible={showFilter}
                            popoverStyle={{ width: 200, height: 250, borderRadius: 8 }}
                            // fromRect={Rect(400, 60, 10, 10)}
                            // showInModal={false}
                        >
                            <View style={{ flex: 1, borderRadius: 8 }}>
                                <View style={filterTitle}>
                                    <Text style={filterTitleText}>Filter</Text>
                                </View>
                                <ScrollView style={{ flex: 1 }}>
                                    <TouchableOpacity style={filterItem} onPress={all}>
                                        <Text style={filterItemText}>All</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={filterItem} onPress={() => { this.filterByDifficulty(EASY); }}>
                                        <Text style={filterItemText}>Easy</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={filterItem} onPress={() => { this.filterByDifficulty(MEDIUM); }}>
                                        <Text style={filterItemText}>Medium</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={filterItem} onPress={() => { this.filterByDifficulty(HARD); }}>
                                        <Text style={filterItemText}>Hard</Text>
                                    </TouchableOpacity>
                                </ScrollView>
                                <View style={filterButton}>
                                    <Button title="Cancel" onPress={() => { this.setState({ showFilter: false }); }} />
                                </View>
                            </View>
                        </Popover>
                    </View>
                )}
            </LoadingErrorWrapper>
        );
    }
}

const mapStateToProps = state => {
    const { problems, profile } = state;

    return {
        isPremiumUser: profile.user.isCurrentUserPremium,
        allQuestions: problems.allQuestions,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        problems: (...args) => dispatch(leetcodeProblems(...args)),
        cleanProblems: (...args) => dispatch(leetcodeCleanAllProblems(...args)),
    };
 };

export default connect(mapStateToProps, mapDispatchToProps)(Problems);
// export default connect(mapStateToProps, mapDispatchToProps)(withLeetcodeWrapper(Problems));
