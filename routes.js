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

import ProblemTabIcon from './src/components/common/ProblemTabIcon';
import ProblemRighttButton from './src/components/common/ProblemRightButton';
import ProfileTabIcon from './src/components/common/ProfileTabIcon';

const LeetCodeRoutes = () => {
    return (
        <Router sceneStyle={{ }}>
            <Scene key="rootScene" hideNavBar modal>
                <Scene key="loadingWrapper" initial>
                    <Scene key="loading" component={Loading} hideNavBar />
                    <Scene key="login" component={Login} title="Login" hideNavBar />
                </Scene>
                <Scene key="main" tabs>
                    <Stack key="problemsWrapper" title="Problems" icon={ProblemTabIcon}>
                        <Scene key="problems" component={Problems} renderRightButton={ProblemRighttButton} onRight={() => {}} title="Problems" initial />
                        <Scene key="problemDetails" component={ProblemDetails} title="Details" />
                        <Scene key="problemSubmission" component={ProblemSubmission} title="Submission" />
                        <Scene key="codelangselector" component={CodeLangSelector} title="Select Languate" />
                    </Stack>
                    <Scene key="profileWrapper" title="Profile" icon={ProfileTabIcon}>
                        <Scene key="profile" component={Profile} initial />
                        <Scene key="submissions" component={Submissions} title="Recent Submissions" />
                    </Scene>
                </Scene>
            </Scene>
        </Router>
    );
};

export default LeetCodeRoutes;
