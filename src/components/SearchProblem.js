import React, { Component } from 'react';
import {
    View, Text, SectionList, TouchableOpacity,
} from 'react-native';
import { SearchBar } from 'react-native-elements';

import { connect } from 'react-redux';
import LoadingErrorWrapper from '../components/common/LoadingErrorWrapper';
import { leetcodeAllTags } from '../actions';

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
        backgroundColor: '#f7f9fa',
        justifyContent: 'center',
    },
    ListHeaderText: {
        marginLeft: 10,
        fontWeight: '600',
        color: 'gray',
    },
};

type Props = {
    companies: Array,
    topics: Array,
    allTags: (boolean => void, string => void) => void,
};

class SearchProblem extends Component<Props> {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            error: null,
        };
    }

    componentDidMount() {
        const { allTags } = this.props;

        this.setState({ loading: true });
        allTags(() => {
            this.setState({ loading: false, error: null });
        }, error => {
            this.setState({ loading: false, error });
        });
    }

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

        return (
            <TouchableOpacity style={ListItem}>
                <Text style={ListItemText}>{item.name}</Text>
            </TouchableOpacity>
        );
    };

    render() {
        const { loading, error } = this.state;
        const { companies, topics } = this.props;

        return (
            <LoadingErrorWrapper loading={loading} error={error}>
            {() => (
                <View style={{ flex: 1 }}>
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
                <SectionList
                    style={{ backgroundColor: 'white' }}
                    sections={[
                        { title: 'Topics', data: topics },
                        { title: 'Companies', data: companies },
                    ]}
                    keyExtractor={item => item.slug}
                    renderSectionHeader={this.renderSectionHeader}
                    renderItem={this.renderTagItem}
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

export default connect(mapStateToProps, mapDispatchToProps)(SearchProblem);
