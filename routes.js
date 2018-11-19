import React from 'react';
import { Router, Scene } from 'react-native-router-flux';

import Login from './src/components/Login';
import Problems from './src/components/Problems';

const LeetCodeRoutes = () => {
    return (
        <Router>
            <Scene key="rootScene" hideNavBar modal>
                <Scene key="loginWrapper">
                    <Login key="login" component={Login} title="Login" />
                </Scene>
                <Scene key="main">
                    <Scene key="problems" component={Problems} title="Problems" />
                </Scene>
            </Scene>
        </Router>
    );
};

export default LeetCodeRoutes;
