import React, { Component } from 'react';
import {
    View, Text, FlatList,
} from 'react-native';
import { ListItem } from 'react-native-elements';

import { connect } from 'react-redux';
import { leetcodeSubmissions } from '../actions';
import { ColorScheme } from '../utils/Config';

import LoadingErrorWrapper from './common/LoadingErrorWrapper';

const styles = {
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    itemContainer: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: ColorScheme.separateLineGray
    },
    itemLeft: {
        flex: 2,
        justifyContent: 'center',
    },
    itemRight: {
        flex: 1,
        justifyContent: 'center',
    },
    questionTitle: {
        marginLeft: 12,
        marginRight: 8,
        marginBottom: 5,
        marginTop: 10,
        fontSize: 17,
        color: ColorScheme.textDarkGray,
    },
    questionTime: {
        marginLeft: 12,
        marginBottom: 10,
        fontSize: 12,
        color: ColorScheme.textGray,
    },
};

type Props = {
    submissionList: {
        submissions: Array,
    },
    recentSubmissions: (number, string, boolean => void, string => void) => void,
}

class Submissions extends Component<Props> {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            error: null,
        };
    }

    componentDidMount() {
        this.loadSubmissions();
    }

    loadSubmissions = () => {
        const { recentSubmissions } = this.props;
        const completionHandler = () => {
            this.setState({ loading: false, error: null });
        };
        const errorHandler = error => {
            this.setState({ loading: false, error });
        };

        this.setState({ loading: true });
        recentSubmissions(0, '', completionHandler.bind(this), errorHandler.bind(this));
    }

    renderSubmissionsList() {
        const { submissionList } = this.props;
        const { submissions } = submissionList;

        return (
            <FlatList
                style={{ flex: 1 }}
                data={submissions}
                keyExtractor={submission => submission.timestamp}
                renderItem={this.renderSubmissionItem}
                ListEmptyComponent={this.renderEmpty}
            />
        );
    }

    renderSubmissionItem = ({ item }) => {
        const colorStyle = item.statusDisplay === 'Accepted' ? ColorScheme.easyGreen : ColorScheme.hardRed;
        const {
            itemContainer, itemLeft, itemRight, questionTitle, questionTime,
        } = styles;

        return (
            <View style={itemContainer}>
                <View style={itemLeft}>
                    <Text style={questionTitle}>{item.title}</Text>
                    <Text style={questionTime}>{item.time}</Text>
                </View>
                <View style={itemRight}>
                    <Text style={{ color: colorStyle }}>{item.statusDisplay}</Text>
                </View>
            </View>
        );
    }

    renderEmpty = () => {
        const { container } = styles;

        return (
            <View style={[container, { justifyContent: 'center', alignItems: 'center' }]}>
                <Text>You submitted nothing!!!</Text>
            </View>
        );
    }

    render() {
        const { loading, error } = this.state;
        const { container } = styles;

        return (
            <LoadingErrorWrapper loading={loading} error={error} errorReload={this.loadSubmissions}>
                {() => (
                    <View style={container}>
                        {this.renderSubmissionsList()}
                    </View>
                )}
            </LoadingErrorWrapper>
        );
    }
}

const mapStateToProps = state => {
    const { submissions } = state;

    return {
        lastKey: submissions.lastKey,
        submissionList: submissions.submissionList,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        recentSubmissions: (...args) => dispatch(leetcodeSubmissions(...args)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Submissions);
