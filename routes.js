import React from 'react';
import {
    Router, Modal, Tabs, Tab, ActionConst, Scene, Stack,
} from 'react-native-router-flux';

import Loading from './src/components/Loading';
import Login from './src/components/Login';
import SocialLogin from './src/components/SocialLogin';
import Problems from './src/components/Problems';
import Profile from './src/components/Profile';
import Submissions from './src/components/Submissions';
import ProblemDetails from './src/components/ProblemDetails';
import ProblemSolution from './src/components/ProblemSolution';
import ProblemSubmission from './src/components/ProblemSubmission';
import CodeLangSelector from './src/components/CodeLangSelector';
import TagsProblem from './src/components/TagsProblem';
import FavoriteProblems from './src/components/FavoriteProblems';
import Help from './src/components/Help';

import ProblemTabIcon from './src/components/common/ProblemTabIcon';
import ProfileTabIcon from './src/components/common/ProfileTabIcon';
import SearchTabIcon from './src/components/common/TagsTabIcon';
import ProblemRightButton from './src/components/common/ProblemRightButton';
import ProfileRightButton from './src/components/common/ProfileRightButton';

const LeetCodeRoutes = () => {
    return (
        <Router
            navigationBarStyle={{ backgroundColor: 'rgba(236, 162, 64, 128)' }}
            titleStyle={{ color: 'white' }}
            headerBackTitleStyle={{ color: 'white' }}
            tintColor="white"
        >
            <Scene hideNavBar>
                <Modal key="rootLoading" gesturesEnabled={false} type={ActionConst.RESET} hideNavBar>
                        <Scene key="loading" component={Loading} hideNavBar />
                </Modal>
                <Modal key="rootLogin" gesturesEnabled={false} type={ActionConst.RESET} hideNavBar>
                    <Scene key="login" component={Login} title="Login" hideNavBar />
                </Modal>
                <Modal key="socialLogin" gesturesEnabled={false} type={ActionConst.RESET} hideNavBar>
                    <Scene key="social" component={SocialLogin} hideNavBar />
                </Modal>
                <Scene
                    tabs
                    key="main"
                    showLabel={false}
                    activeTintColor="rgba(236, 162, 64, 128)"
                    inactiveTintColor="gray"
                    type={ActionConst.RESET}
                >
                    <Stack tab initial icon={ProblemTabIcon}>
                        <Scene key="problems" initial component={Problems} title="Problems" renderRightButton={ProblemRightButton} />
                        <Scene key="problemDetails" component={ProblemDetails} title="Details" hideTabBar />
                        <Scene key="problemSolution" component={ProblemSolution} title="Solution" hideTabBar />
                        <Scene key="problemSubmission" component={ProblemSubmission} title="Submission" hideTabBar />
                        <Scene key="codelangselector" component={CodeLangSelector} title="Select Languate" hideTabBar />
                    </Stack>
                    <Scene tab icon={SearchTabIcon}>
                        <Scene key="searchProblem" component={TagsProblem} title="Tags" />
                        <Scene key="taggedProblems" component={Problems} hideTabBar />
                        <Scene key="taggedProblemDetails" component={ProblemDetails} title="Details" hideTabBar />
                        <Scene key="taggedProblemSubmission" component={ProblemSubmission} title="Submission" hideTabBar />
                        <Scene key="taggedCodelangselector" component={CodeLangSelector} title="Select Languate" hideTabBar />
                    </Scene>
                    <Scene tab icon={ProfileTabIcon}>
                        <Scene key="profile" component={Profile} title="Profile" renderRightButton={ProfileRightButton} initial />
                        <Scene key="submissions" component={Submissions} title="Recent Submissions" hideTabBar />
                        <Scene key="favorite" component={FavoriteProblems} title="Favorite" hideTabBar />
                        <Scene key="help" component={Help} title="Help" hideTabBar />
                    </Scene>
                </Scene>
            </Scene>
        </Router>
    );
};

export default LeetCodeRoutes;
