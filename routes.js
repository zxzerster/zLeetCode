import React from 'react';
import { Router, Modal, Tabs, Tab, Scene, Stack } from 'react-native-router-flux';

import Loading from './src/components/Loading';
import Login from './src/components/Login';
import Problems from './src/components/Problems';
import Profile from './src/components/Profile';
import Submissions from './src/components/Submissions';
import ProblemDetails from './src/components/ProblemDetails';
import ProblemSubmission from './src/components/ProblemSubmission';
import CodeLangSelector from './src/components/CodeLangSelector';
import TagsProblem from './src/components/TagsProblem';
import FavoriteProblems from './src/components/FavoriteProblems';

import ProblemTabIcon from './src/components/common/ProblemTabIcon';
import ProblemRighttButton from './src/components/common/ProblemRightButton';
import ProfileTabIcon from './src/components/common/ProfileTabIcon';
import SearchTabIcon from './src/components/common/TagsTabIcon';
import FavoriteTabIcon from './src/components/common/FavoriteTabIcon';

const LeetCodeRoutes = () => {
    return (
        <Router
            navigationBarStyle={{ backgroundColor: 'rgba(236, 162, 64, 128)' }}
            titleStyle={{ color: 'white' }}
            headerBackTitleStyle={{ color: 'white' }}
            tintColor="white"
        >
            <Modal key="rootScene" hideNavBar>
                <Stack key="loadingWrapper" initial>
                    <Scene key="loading" component={Loading} hideNavBar />
                    <Scene key="login" component={Login} title="Login" hideNavBar />
                </Stack>
                <Tabs
                    key="main"
                    showLabel={false}
                    activeTintColor="rgba(236, 162, 64, 128)"
                    inactiveTintColor="gray"
                >
                    <Stack key="problemsWrapper" icon={ProblemTabIcon}>
                        <Scene key="problems" initial component={Problems} />
                        <Scene key="problemDetails" component={ProblemDetails} title="Details" hideTabBar />
                        <Scene key="problemSubmission" component={ProblemSubmission} title="Submission" hideTabBar />
                        <Scene key="codelangselector" component={CodeLangSelector} title="Select Languate" hideTabBar />
                    </Stack>
                    <Stack icon={SearchTabIcon}>
                        <Scene key="searchProblem" component={TagsProblem} title="Tags" />
                        <Scene key="taggedProblems" component={Problems} hideTabBar />
                        <Scene key="taggedProblemDetails" component={ProblemDetails} title="Details" hideTabBar />
                        <Scene key="taggedProblemSubmission" component={ProblemSubmission} title="Submission" hideTabBar />
                        <Scene key="taggedCodelangselector" component={CodeLangSelector} title="Select Languate" hideTabBar />
                    </Stack>
                    {/* <Stack icon={FavoriteTabIcon}>
                        <Scene key="favoriteProblems" component={FavoriteProblems} title="Search" />
                    </Stack> */}
                    <Stack key="profileWrapper" title="Profile" icon={ProfileTabIcon}>
                        <Scene key="profile" component={Profile} initial />
                        <Scene key="submissions" component={Submissions} title="Recent Submissions" hideTabBar />
                        <Scene key="favorite" component={FavoriteProblems} title="Favorite" hideTabBar />
                    </Stack>
                </Tabs>
            </Modal>
        </Router>
    );
};

export default LeetCodeRoutes;
