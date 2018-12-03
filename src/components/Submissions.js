import React, { Component } from 'react';
import {
    View, ActivityIndicator, Text, FlatList,
} from 'react-native';
import { List, ListItem } from 'react-native-elements';
import _ from 'lodash';

import { connect } from 'react-redux';
import { leetcodeSubmissions } from '../actions';


const styles = {
    container: {
        flex: 1,
    },
};

class Submissions extends Component {
    static defaultProps = {
        submissionList: {
            submissions: [],
        },
    };

    static renderSubmissionItem({ item }) {
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

    static renderEmpty() {
        const { container } = styles;

        return (
            <View style={[container, { justifyContent: 'center', alignItems: 'center' }]}>
                <Text>You submitted nothing!!!</Text>
            </View>
        );
    }

    componentDidMount() {
        const { recentSubmissions } = this.props;

        recentSubmissions();
    }

    renderSubmissionsList() {
        const { submissionList } = this.props;
        let submissions = [];

        if (submissionList) {
            submissions = submissionList.submissions;
        }

        return (
            <FlatList
                style={{ flex: 1 }}
                data={submissions}
                keyExtractor={submission => submission.timestamp}
                renderItem={Submissions.renderSubmissionItem}
                ListEmptyComponent={Submissions.renderEmpty}
            />
        );
    }

    renderError() {
        const { error } = this.props;

        return (
            <View>
                <Text>{`Failed to get your recent submissions ${error}.`}</Text>
            </View>
        );
    }

    render() {
        const { loading, error } = this.props;
        const { container } = styles;

        if (loading) {
            return (
                <View style={[container, { justifyContent: 'center', alignItems: 'center' }]}>
                    <ActivityIndicator animating />
                </View>
            );
        }

        if (error) {
            return this.renderError();
        }

        return (
            <View style={container}>
                {this.renderSubmissionsList()}
            </View>
        );

        // if (loading) {
        //     return (
        //         <View style={[container, { justifyContent: 'center', alignItems: 'center' }]}>
        //             <ActivityIndicator animating />
        //         </View>
        //     );
        // }

        // if (error) {
        //     return (
        //         <View style={container}>
        //             <Text>Failed to get your recent submissions.</Text>
        //         </View>
        //     );
        // }

        // return (
        //     <View style={container}>
        //         {this.renderSubmissionsList()}
        //     </View>
        // );
    }
}

const mapStateToProps = state => {
    const { submissions } = state;

    return {
        loading: submissions.loading,
        error: submissions.error,
        submissionList: submissions.submissionList,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        recentSubmissions: (...args) => dispatch(leetcodeSubmissions(...args)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Submissions);
