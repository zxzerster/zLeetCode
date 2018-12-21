import React, { Component } from 'react';
import {
    View, Text, FlatList,
} from 'react-native';
import { ListItem } from 'react-native-elements';

import { connect } from 'react-redux';
import { leetcodeSubmissions } from '../actions';

import LoadingErrorWrapper from './common/LoadingErrorWrapper';

const styles = {
    container: {
        flex: 1,
        backgroundColor: 'white',
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

        this.setState({ loading: true });
        recentSubmissions(0, '', () => {
            this.setState({ loading: false, error: null });
        }, error => {
            this.setState({ loading: false, error });
        });
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
        const colorStyle = item.statusDisplay === 'Accepted' ? 'green' : 'red';

        return (
            <ListItem
                title={item.title}
                subtitle={item.time}
                rightTitle={item.statusDisplay}
                rightTitleStyle={{ color: colorStyle }}
                hideChevron
            />
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
