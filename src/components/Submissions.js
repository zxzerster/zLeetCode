import React, { Component } from 'react';
import {
    View, Text, FlatList, Animated, LayoutAnimation, TouchableOpacity,
} from 'react-native';
import { ListItem } from 'react-native-elements';

import { connect } from 'react-redux';
import { leetcodeSubmissions } from '../actions';

import LeetcodeIcon from './common/LeetcodeIcon';

const ANIMATION_DURATION = 1000;
const OPACITY = 0.2;

const styles = {
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    loadingErrorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
    },
    errorString: {
        fontSize: 24,
        fontWeight: '500',
        color: 'gray',
        marginTop: 20,
    },
    reloadButton: {
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 5,
        // padding: 10,
        width: '35%',
        height: 35,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 15,
    },
    reloadButtonTitle: {
        fontSize: 18,
        color: 'gray',
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
        this.fade = new Animated.Value(OPACITY);
    }

    componentDidMount() {
        const { recentSubmissions } = this.props;

        this.setState({ loading: true });
        this.animatedLoading();
        recentSubmissions(0, '', () => {
            LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
            this.setState({ loading: false, error: null });
        }, error => {
            LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
            this.setState({ loading: false, error });
        });
    }

    animatedLoading() {
        Animated.loop(
            Animated.sequence([
                Animated.timing(
                    this.fade,
                    {
                        toValue: 1,
                        duration: ANIMATION_DURATION,
                    }
                ),
                Animated.timing(
                    this.fade,
                    {
                        toValue: OPACITY,
                        duration: ANIMATION_DURATION,
                    }
                ),
            ])
        ).start();
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
        const {
            container, loadingErrorContainer, errorString, reloadButton, reloadButtonTitle,
        } = styles;

        if (loading) {
            return (
                <View style={loadingErrorContainer}>
                    <Animated.View style={{ ...this.props.style, opacity: this.fade }}>
                        <LeetcodeIcon />
                    </Animated.View>
                </View>
            );
        }

        if (error) {
            return (
                <View style={loadingErrorContainer}>
                   <LeetcodeIcon />
                   <Text style={errorString}>{error}</Text>
                   <TouchableOpacity style={reloadButton} onPress={() => { this.loadProblems(); }}>
                       <Text style={reloadButtonTitle}>Reload it</Text>
                   </TouchableOpacity>
                </View>
            );
        }

        return (
            <View style={container}>
                {this.renderSubmissionsList()}
            </View>
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
