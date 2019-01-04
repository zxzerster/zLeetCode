import React, { Component } from 'react';
import {
    View, SectionList, TouchableOpacity, Text,
} from 'react-native';

import { connect } from 'react-redux';
import LoadingErrorWrapper from './common/LoadingErrorWrapper';
import { leetcodeFavoritesLists } from '../actions';

const styles = {
    ListItem: {
        flex: 1,
        height: 35,
        justifyContent: 'center',
        marginLeft: 10,
    },
    ListItemText: {
        fontSize: 16,
        color: 'gray',
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
    publicFavorites: Array,
    privateFavorites: Array,
    favorites: (boolean => void, string => void) => void,
};

class FavoriteProblems extends Component<Props> {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            error: null,
        };
    }

    componentDidMount() {
        const { favorites } = this.props;
        const completionHandler = () => {
            this.setState({ loading: false, error: null });
        };
        const errorHandler = error => {
            this.setState({ loading: false, error });
        };

        this.setState({ loading: true });
        favorites(completionHandler.bind(this), errorHandler.bind(this));
    }

    renderSectionHeader = ({ section }) => {
        const { ListHeader, ListHeaderText } = styles;

        return (
            <View style={ListHeader}>
                <Text style={ListHeaderText}>{section.title}</Text>
            </View>
        );
    };

    renderFavoriteItem = ({ item, index, section }) => {
        const { ListItem, ListItemText } = styles;

        return (
            <TouchableOpacity style={ListItem}>
                <Text style={ListItemText}>{item.title}</Text>
            </TouchableOpacity>
        );
    };

    render() {
        const { loading, error } = this.state;
        const { publicFavorites, privateFavorites } = this.props;

        return (
            <LoadingErrorWrapper loading={loading} error={error} errorReload={this.loadProblems}>
                {() => (
                    <SectionList
                        style={{ backgroundColor: 'white' }}
                        sections={[
                            { title: 'Private favorites', data: privateFavorites },
                            { title: 'Public favorites', data: publicFavorites },
                        ]}
                        keyExtractor={item => item.questionId}
                        renderSectionHeader={this.renderSectionHeader}
                        renderItem={this.renderFavoriteItem}
                    />
                )}
            </LoadingErrorWrapper>
        );
    }
}

const mapStateToProps = state => {
    const { favorites: { favoritesLists: { publicFavorites, privateFavorites } } } = state;

    return {
        publicFavorites: publicFavorites.length > 0 ? publicFavorites[0].questions : [],
        privateFavorites: privateFavorites.length > 0 ? privateFavorites[0].questions : [],
    };
};

const mapDispatchToProps = dispatch => {
    return {
        favorites: (...args) => dispatch(leetcodeFavoritesLists(...args)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(FavoriteProblems);
