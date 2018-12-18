import React, { Component } from 'react';
import {
    View, FlatList, Animated, LayoutAnimation, Text, TouchableOpacity,
} from 'react-native';
import { connect } from 'react-redux';

import ProblemItem from './ProblemItem';
import { leetcodeProblems } from '../actions';

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
};

class Problems extends Component<ProblemsProps> {
    static renderItem({ item, index }) {
        return <ProblemItem problem={item} index={index} />;
    }

    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            error: null,
        };
        this.fade = new Animated.Value(OPACITY);
    }

    componentDidMount() {
        this.loadProblems.apply(this);
    }

    loadProblems() {
        const { problems } = this.props;

        this.setState({ loading: true });
        this.animatedLoading();
        problems(() => {
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

    render() {
        const { loading, error } = this.state;
        const {
            container, loadingErrorContainer, errorString, reloadButton, reloadButtonTitle,
        } = styles;
        const { allQuestions } = this.props;

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
            <View style={[container, { marginTop: 0 }]}>
                <FlatList
                    style={{ backgroundColor: 'white' }}
                    data={allQuestions}
                    keyExtractor={item => item.questionId}
                    renderItem={Problems.renderItem}
                />
            </View>
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
