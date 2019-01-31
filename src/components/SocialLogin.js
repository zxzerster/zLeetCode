import React, { Component } from 'react';
import {
    View, WebView, ActivityIndicator, Animated,
} from 'react-native';
import CookieManager from 'react-native-cookies';

import LeetcodeIcon from './common/LeetcodeIcon';

const styles = {
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
    },
    indicator: {
        marginTop: 15,
    },
};

class SocialLogin extends Component {
    constructor(props) {
        super(props);

        this.state = {
            start: false,
        };
        this.fade = new Animated.Value(0.2);
        this.webViewRef = React.createRef();
        CookieManager.clearAll()
        .then(() => {
            this.setState({ start: true });
        });
    }

    // componentDidMount() {
    //     this.animatedLoading();
    // }

    onLoadStart = arg => {
        const { nativeEvent: { url } } = arg;
        console.log(`==========>>>   url: ${url}`);
        if (url === 'https://leetcode.com/') {
            this.webViewRef.current.stopLoading();

            CookieManager.getAll()
                .then(cookies => {
                    console.log(`csrftoken: ${cookies.csrftoken.value}`);
                    console.log(`LEETCODE_SESSION: ${cookies.LEETCODE_SESSION.value}`);
                });
        }
    }

    animatedLoading() {
        Animated.loop(
            Animated.sequence([
                Animated.timing(
                    this.fade,
                    {
                        toValue: 1,
                        duration: 1000,
                    }
                ),
                Animated.timing(
                    this.fade,
                    {
                        toValue: 0.2,
                        duration: 1000,
                    }
                ),
            ])
        ).start();
    }

    renderLoading = () => {
        const { container, indicator } = styles;

        this.animatedLoading();

        return (
            <View style={container}>
                <Animated.View style={{ ...this.props.style, opacity: this.fade }}>
                    <LeetcodeIcon />
                </Animated.View>
                <ActivityIndicator style={indicator} animating />
            </View>
        );
    };

    render() {
        const { start } = this.state;

        if (start) {
            return (
                <WebView
                    ref={this.webViewRef}
                    source={{ uri: 'https://leetcode.com/accounts/github/login' }}
                    onLoadStart={arg => this.onLoadStart(arg)}
                    renderLoading={this.renderLoading}
                    startInLoadingState
                />
            );
        }

        return <View />;
    }
}

export default SocialLogin;
