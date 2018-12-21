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
import SearchProblem from './src/components/SearchProblem';
import FavoriteProblems from './src/components/FavoriteProblems';

import ProblemTabIcon from './src/components/common/ProblemTabIcon';
import ProblemRighttButton from './src/components/common/ProblemRightButton';
import ProfileTabIcon from './src/components/common/ProfileTabIcon';
import SearchTabIcon from './src/components/common/SearchTabIcon';
import FavoriteTabIcon from './src/components/common/FavoriteTabIcon';

const LeetCodeRoutes = () => {
    return (
        <Router
            navigationBarStyle={{ backgroundColor: 'rgba(236, 162, 64, 128)' }}
            titleStyle={{ color: 'white' }}
            headerBackTitleStyle={{ color: 'white' }}
            tintColor="white"
        >
            <Scene key="rootScene" hideNavBar modal>
                <Scene key="loadingWrapper" initial>
                    <Scene key="loading" component={Loading} hideNavBar />
                    <Scene key="login" component={Login} title="Login" hideNavBar />
                </Scene>
                <Scene
                    key="main"
                    tabs
                    showLabel={false}
                    activeTintColor="rgba(236, 162, 64, 128)"
                    inactiveTintColor="gray"
                >
                    <Stack key="problemsWrapper" icon={ProblemTabIcon}>
                        <Scene key="problems" title="Problems" initial component={Problems} renderRightButton={ProblemRighttButton} onRight={() => {}} />
                        <Scene key="problemDetails" component={ProblemDetails} title="Details" />
                        <Scene key="problemSubmission" component={ProblemSubmission} title="Submission" />
                        <Scene key="codelangselector" component={CodeLangSelector} title="Select Languate" />
                    </Stack>
                    <Stack icon={SearchTabIcon}>
                        <Scene key="searchProblem" component={SearchProblem} title="Search" />
                        <Scene key="taggedProblems" component={Problems} />
                        <Scene key="taggedProblemDetails" component={ProblemDetails} title="Details" />
                        <Scene key="taggedProblemSubmission" component={ProblemSubmission} title="Submission" />
                        <Scene key="taggedCodelangselector" component={CodeLangSelector} title="Select Languate" />
                    </Stack>
                    <Stack icon={FavoriteTabIcon}>
                        <Scene key="favoriteProblems" component={FavoriteProblems} title="Search" />
                    </Stack>
                    <Stack key="profileWrapper" title="Profile" icon={ProfileTabIcon}>
                        <Scene key="profile" component={Profile} initial />
                        <Scene key="submissions" component={Submissions} title="Recent Submissions" />
                    </Stack>
                </Scene>
            </Scene>
        </Router>
    );
};

export default LeetCodeRoutes;
