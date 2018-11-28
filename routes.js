import React from 'react';
import { Router, Scene } from 'react-native-router-flux';

import Loading from './src/components/Loading';
import Login from './src/components/Login';
import Problems from './src/components/Problems';
import Profile from './src/components/Profile';

const LeetCodeRoutes = () => {
    return (
        <Router>
            <Scene key="rootScene" hideNavBar modal>
                <Scene key="loadingWrapper" initial>
                    <Scene key="loading" component={Loading} hideNavBar />
                    <Scene key="login" component={Login} title="Login" hideNavBar />
                </Scene>
                <Scene key="main" tabs>
                    <Scene key="problems" component={Problems} title="Problems" initial />
                    <Scene key="profile" component={Profile} title="Profile" />
                </Scene>
            </Scene>
        </Router>
    );
};

export default LeetCodeRoutes;
