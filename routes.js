import React from 'react';
import { Router, Scene } from 'react-native-router-flux';

import Loading from './src/components/Loading';
import Login from './src/components/Login';
import Problems from './src/components/Problems';
import Profile from './src/components/Profile';
import Submissions from './src/components/Submissions';
import ProblemDetails from './src/components/ProblemDetails';
import ProblemSubmission from './src/components/ProblemSubmission';

const LeetCodeRoutes = () => {
    return (
        <Router>
            <Scene key="rootScene" hideNavBar modal>
                <Scene key="loadingWrapper" initial>
                    <Scene key="loading" component={Loading} hideNavBar />
                    <Scene key="login" component={Login} title="Login" hideNavBar />
                </Scene>
                <Scene key="main" tabs>
                    <Scene key="problemsWrapper" title="Problems">
                        <Scene key="problems" component={Problems} title="Problems" initial />
                        <Scene key="problemDetails" component={ProblemDetails} title="Details" />
                        <Scene key="problemSubmission" component={ProblemSubmission} title="Submission" />
                    </Scene>
                    <Scene key="profileWrapper" title="Profile">
                        <Scene key="profile" component={Profile} initial />
                        <Scene key="submissions" component={Submissions} title="Recent Submissions" />
                    </Scene>
                </Scene>
            </Scene>
        </Router>
    );
};

export default LeetCodeRoutes;
