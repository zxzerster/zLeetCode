import React, { Component } from 'react';
import {
    View, Modal, WebView, ActivityIndicator, KeyboardAvoidingView, Animated, TouchableOpacity,
} from 'react-native';
import { Icon } from 'react-native-elements';
import CookieManager from 'react-native-cookies';

import LeetcodeIcon from './LeetcodeIcon';

const styles = {
    backgroundView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
    },
    contentArea: {
        backgroundColor: 'white',
        width: '85%',
        height: 600,
    },
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

class LoginModal extends Component {
    constructor(props) {
        super(props);

        this.state = {
            start: true,
        };
        this.webViewRef = React.createRef();
        this.fade = new Animated.Value(0.2);
        // CookieManager.clearAll()
        // .then(() => {
        //     this.setState({ start: true });
        // });
    }

    componentDidMount() {
        this.animatedLoading();
    }

    onLoadStart = arg => {
        const { nativeEvent: { url } } = arg;
        const { onSocialLoginSuccess } = this.props;
        console.log(`==========>>>   url: ${url}`);
        if (url === 'https://leetcode.com/' || url === 'https://leetcode.com/#') {
            this.webViewRef.current.stopLoading();

            CookieManager.getAll()
                .then(cookies => {
                    // console.log(`csrftoken: ${cookies.csrftoken.value}`);
                    // console.log(`LEETCODE_SESSION: ${cookies.LEETCODE_SESSION.value}`);
                    const csrftoken = cookies.csrftoken.value;
                    const LEETCODE_SESSION = cookies.LEETCODE_SESSION.value;

                    if (onSocialLoginSuccess && csrftoken && LEETCODE_SESSION) {
                        onSocialLoginSuccess(csrftoken, LEETCODE_SESSION);
                    }
                });
        }
    }

    onClose = () => {
        const { onClose } = this.props;

        this.webViewRef.current.stopLoading();
        if (onClose) {
            onClose();
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
        const { onClose, socialLoginUrl, ...other } = this.props;
        const { start } = this.state;
        const { backgroundView, contentArea } = styles;

        if (start) {
            return (
                <Modal
                    animationType="fade"
                    transparent
                    {...other}
                >
                    <KeyboardAvoidingView style={backgroundView} behavior="padding">
                        <View style={contentArea}>
                            <View style={{ height: 30, justifyContent: 'center', alignItems: 'flex-end', paddingRight: 8 }}>
                                <TouchableOpacity onPress={this.onClose}>
                                    <Icon type="ionicon" name="ios-close-circle-outline" />
                                </TouchableOpacity>
                            </View>
                            <WebView
                                ref={this.webViewRef}
                                source={{ uri: socialLoginUrl }}
                                onLoadStart={arg => this.onLoadStart(arg)}
                                renderLoading={this.renderLoading}
                                startInLoadingState
                            />
                        </View>
                    </KeyboardAvoidingView>
                </Modal>
            );
        }

        return <View />;
    }
}


export default LoginModal;