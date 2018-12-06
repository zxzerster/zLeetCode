import React from 'react';
import { Router, Scene, Stack } from 'react-native-router-flux';

import Loading from './src/components/Loading';
import Login from './src/components/Login';
import Problems from './src/components/Problems';
import Profile from './src/components/Profile';
import Submissions from './src/components/Submissions';
import ProblemDetails from './src/components/ProblemDetails';
import ProblemSubmission from './src/components/ProblemSubmission';
import CodeLangSelector from './src/components/CodeLangSelector';

const LeetCodeRoutes = () => {
    return (
        <Router>
            <Scene key="rootScene" hideNavBar modal>
                <Scene key="loadingWrapper" initial>
                    <Scene key="loading" component={Loading} hideNavBar />
                    <Scene key="login" component={Login} title="Login" hideNavBar />
                </Scene>
                <Scene key="main" tabs>
                    <Stack key="problemsWrapper" title="Problems">
                        <Scene key="problems" component={Problems} title="Problems" initial />
                        <Scene key="problemDetails" component={ProblemDetails} title="Details" />
                        <Scene key="problemSubmission" component={ProblemSubmission} title="Submission" />
                        <Scene key="codelangselector" component={CodeLangSelector} title="Select Languate" />
                    </Stack>
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
