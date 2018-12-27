// @flow
import React, { Component } from 'react';
import { Alert, NetInfo } from 'react-native';

import LoadingErrorWrapper from './LoadingErrorWrapper';

const NO_INTERNET_CONNECTION = 'no_internet_connection';
const INTERNET_CONNECTION = 'internet_connection';
const INITIAL_UNKNOWN_STATE = 'initial_unknown_state';

type Props = {

};

export default Comp => {
    return class Wrapper extends Component<Props> {
        constructor(props: Props) {
            super(props);

            this.state = {
                networkInfo: INITIAL_UNKNOWN_STATE,
            };
        }

        componentDidMount() {
            NetInfo.addEventListener('connectionChange', this.networkInfoHandler);
        }

        componentDidUpdate() {
            const { networkInfo } = this.state;

            if (networkInfo === NO_INTERNET_CONNECTION) {
                Alert.alert('Network', 'There\'s no internet connection now!');
            }
        }

        networkInfoHandler = (event: {type: string, effectiveType: string}) => {
            const { type } = event;

            if (type !== 'wifi' && type !== 'celluar') {
                this.setState({ networkInfo: NO_INTERNET_CONNECTION });
            } else {
                this.setState({ networkInfo: INTERNET_CONNECTION });
            }
        };

        render() {
            const { networkInfo } = this.state;

            return <Comp connection={networkInfo === INTERNET_CONNECTION} {...this.props} />;
        }
    };
};
