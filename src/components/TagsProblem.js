import React, { Component } from 'react';
import {
    View, Text, SectionList, TouchableOpacity,
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import { SearchBar } from 'react-native-elements';

import { connect } from 'react-redux';
import LoadingErrorWrapper from './common/LoadingErrorWrapper';
import { leetcodeAllTags } from '../actions';

import { ColorScheme } from '../utils/Config';

const styles = {
    ListItem: {
        flex: 1,
        height: 35,
        justifyContent:
        'center',
        alignItems: 'center',
    },
    ListItemText: {
        textDecorationLine: 'underline',
        fontSize: 16,
        color: 'rgb(6, 69, 173)',
    },
    ListHeader: {
        height: 30,
        backgroundColor: ColorScheme.lightGrayBackground,
        justifyContent: 'center',
    },
    ListHeaderText: {
        marginLeft: 10,
        fontWeight: '600',
        color: ColorScheme.textGray,
    },
};

type Props = {
    companies: Array,
    topics: Array,
    allTags: (boolean => void, string => void) => void,
    filterByIds: () => Object,
};

class TagsProblem extends Component<Props> {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            error: null,
            refreshing: false,
        };
    }

    componentDidMount() {
        const { companies, topics } = this.props;
        const completionHandler = () => {
            this.setState({ loading: false, error: null });
        };
        const errorHandler = error => {
            this.setState({ loading: false, error });
        };

        if (companies.length < 1 && topics.length < 1) {
            const { allTags } = this.props;

            this.setState({ loading: true });
            allTags(completionHandler.bind(this), errorHandler.bind(this));
        }
    }

    refresh = () => {
        const { allTags } = this.props;
        const completionHandler = () => {
            this.setState({ refreshing: false, error: null });
        };
        const errorHandler = error => {
            this.setState({ refreshing: false, error });
        };

        this.setState({ refresh: true });
        allTags(completionHandler.bind(this), errorHandler.bind(this));
    }

    searchBar = () => {
        return (
            <SearchBar
                // ref={this.searchRef}
                containerStyle={{ backgroundColor: 'white' }}
                inputContainerStyle={{ backgroundClor: 'white' }}
                inputStyle={{ backgroundColor: '#f7f9fa' }}
                returnKeyType="search"
                lightTheme
                round
                placeholder="Search tag / company / problem..."
                searchIcon={{ size: 24 }}
                // onChangeText={text => this.setState({ searchKeyword: text })}
                // onEndEditing={this.simpleSearchProblems}
            />
        );
    };

    renderSectionHeader = ({ section }) => {
        const { ListHeader, ListHeaderText } = styles;

        return (
            <View style={ListHeader}>
                <Text style={ListHeaderText}>{section.title}</Text>
            </View>
        );
    };

    renderTagItem = ({ item, index, section }) => {
        const { ListItem, ListItemText } = styles;
        const { companies, topics, filterByIds } = this.props;
        const onPress = () => {
            const ids = topics[index].questions;
            const title = topics[index].name;

            Actions.taggedProblems({ title: `${title} (${ids.length})`, tagIds: ids, from: 'SearchTab' });
        };

        return (
            <TouchableOpacity style={ListItem} onPress={onPress}>
                <Text style={ListItemText}>{item.name}<Text style={{ fontSize: 10, color: ColorScheme.textGray}}>{` (${item.questions.length})`}</Text></Text>
            </TouchableOpacity>
        );
    };

    render() {
        const { loading, error, refreshing } = this.state;
        const { companies, topics } = this.props;

        return (
            <LoadingErrorWrapper loading={loading} error={error}>
            {() => (
                <View style={{ flex: 1 }}>
                <SectionList
                    style={{ backgroundColor: 'white' }}
                    sections={[
                        { title: 'Topics', data: topics },
                        { title: 'Companies', data: companies },
                    ]}
                    keyExtractor={item => item.slug}
                    renderSectionHeader={this.renderSectionHeader}
                    renderItem={this.renderTagItem}
                    // for now, disable search function for a while
                    // ListHeaderComponent={this.searchBar}
                    onRefresh={this.refresh}
                    refreshing={refreshing}
                />
                </View>
            )}
            </LoadingErrorWrapper>
        );
    }
}

const mapStateToProps = state => {
    const { tags } = state;

    return {
        companies: tags.companies,
        topics: tags.topics,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        allTags: (...args) => dispatch(leetcodeAllTags(...args)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(TagsProblem);
