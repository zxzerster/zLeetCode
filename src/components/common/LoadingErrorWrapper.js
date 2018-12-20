import React, { Component } from 'react';
import {
    View, Text, TouchableOpacity, LayoutAnimation, Animated,
} from 'react-native';

import LeetcodeIcon from './LeetcodeIcon';

const styles = {
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
    opacity?: number,
    duration?: number,
    loading: boolean,
    error?: string,
    children: () => Component,
};

class LoadingErrorWrapper extends Component<Props> {
    static defaultProps = {
        opacity: 0.2,
        duration: 1000,
        error: null,
    };

    constructor(props) {
        super(props);
        const { opacity } = this.props;

        this.fade = new Animated.Value(opacity);
    }

    componentDidUpdate(prevProps) {
        const { loading } = this.props;

        if (!prevProps.loading && loading) {
            // when start to load something, animating
            this.animatedLoading();
        } else if (prevProps && !loading) {
            // When loading finished, stop animating
            LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
        }
    }

    animatedLoading() {
        const { opacity, duration } = this.props;

        Animated.loop(
            Animated.sequence([
                Animated.timing(
                    this.fade,
                    {
                        toValue: 1,
                        duration,
                    }
                ),
                Animated.timing(
                    this.fade,
                    {
                        toValue: opacity,
                        duration,
                    }
                ),
            ])
        ).start();
    }

    render() {
        const {
            loading, error, children,
        } = this.props;
        const {
            loadingErrorContainer, errorString, reloadButton, reloadButtonTitle,
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

        return children();
    }
}

export default LoadingErrorWrapper;