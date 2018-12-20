import React, { Component } from 'react';
import {
    View, Image, Text, ScrollView, TouchableOpacity,
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import { Badge, Divider, Button } from 'react-native-elements';
import { connect } from 'react-redux';

import LeetcodeIcon from './common/LeetcodeIcon';
import { leetcodeUserProfile, leetcodeLogout } from '../actions';

import { versionString } from '../../ZLC-Config';

const profileStyles = {
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    profileContainer: {
        flex: 1,
        flexDirection: 'row',
        // backgroundColor: 'red',
        alignItems: 'center',
    },
    settingContainer: {
        flex: 3,
    },
    avatar: {
        width: 95,
        height: 95,
        borderRadius: 10,
        marginLeft: 8,
        marginRight: 8,
    },
    profileTextBadgesContainer: {
        height: 95,
        justifyContent: 'space-between',
        flex: 1,
        paddingTop: 3,
    },
    realNameText: {
        fontSize: 20,
        color: '#606060',
        marginLeft: 7,
    },
    nameSlugText: {
        fontSize: 15,
        color: '#A0A0A0',
        marginLeft: 7,
    },
    divider: {
        height: 0.5,
        backgroundColor: '#A0A0A0',
        marginTop: 2,
        marginRight: 5,
        shadowColor: '#000',
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 0.3,
        marginLeft: 7,
    },
    statsContainer: {
        flex: 1,
        flexDirection: 'column',
        marginTop: 3,
    },
    statsLabelContainer: {
        flexDirection: 'row',
    },
    statsLableTextContainer: {
        flex: 1,
        marginTop: 3,
    },
    statsLabelText: {
        marginLeft: 8,
        fontSize: 12,
        color: '#808080',
    },
    badgeContainer: {
        flexDirection: 'row',
        marginTop: 3,
    },
    badge: {
        flex: 1,
        paddingVertical: 3,
        marginLeft: 3,
        marginRight: 3,
    },
    greenBadge: {
        backgroundColor: 'rgb(82, 175, 82)',
    },
    blueBadge: {
        backgroundColor: 'rgb(81, 184, 217)',
    },
};

const settingStyles = {
    item: {
        height: 45,
        justifyContent: 'center',
        borderBottomColor: '#c0c0c0',
        borderBottomWidth: 1,
        paddingLeft: 8,
    },
    topBoder: {
        borderTopColor: '#c0c0c0',
        borderTopWidth: 1,
    },
    text: {
        fontSize: 17,
        fontWeight: '400',
    },
};

const logoutStyles = {
    button: {
        flex: 1,
        height: 48,
        borderRadius: 5,
    },
    buttonDisabled: {
        backgroundColor: '#888888',
        opacity: 0.6,
    },
    containerView: {
        // marginLeft: 0,
        // marginRight: 0
        marginTop: 45,
    },
};

const renderProfile = ({
    avatarUri, realName, userSlug, acStats,
}) => {
    // Avatar
    const renderAvatar = () => {
        const { avatar } = profileStyles;

        if (avatarUri === '--') {
            return (
                <LeetcodeIcon width={95} height={95} style={avatar} />
            );
        }

        return (
            <View>
                <Image style={avatar} source={{ uri: avatarUri }} />
            </View>
        );
    };

    // Names
    const renderNames = () => {
        const { realNameText, nameSlugText, divider } = profileStyles;

        return (
            <View>
                <Text style={realNameText}>{realName}</Text>
                <Text style={nameSlugText}>{userSlug}</Text>
                <Divider style={divider} />
            </View>
        );
    };

    // Stats Label
    const renderStatsLabels = () => {
        const { statsLabelContainer, statsLableTextContainer, statsLabelText } = profileStyles;

        return (
            <View style={statsLabelContainer}>
                <View style={statsLableTextContainer}>
                    <Text numberOfLines={1} ellipsizeMode="tail" style={statsLabelText}>Resolved</Text>
                </View>
                <View style={statsLableTextContainer}>
                    <Text numberOfLines={1} ellipsizeMode="tail" style={statsLabelText}>Accepted</Text>
                </View>
                <View style={statsLableTextContainer}>
                    <Text numberOfLines={1} ellipsizeMode="tail" style={[statsLabelText, { marginLeft: 10 }]}>Rate</Text>
                </View>
            </View>
        );
    };

    const renderBadges = () => {
        const {
            badgeContainer, badge, greenBadge, blueBadge,
        } = profileStyles;

        return (
            <View style={badgeContainer}>
                <View style={[badge]}>
                    <Badge containerStyle={greenBadge} value={acStats.acQuestionCount} />
                </View>
                <View style={[badge]}>
                    <Badge containerStyle={greenBadge} value={`${acStats.acSubmissionCount} / ${acStats.totalSubmissionCount}`} />
                </View>
                <View style={[badge]}>
                    <Badge containerStyle={blueBadge} value={`${acStats.acRate} %`} />
                </View>
            </View>
        );
    };

    const { profileContainer, profileTextBadgesContainer, statsContainer } = profileStyles;

    return (
        <View style={profileContainer}>
            {renderAvatar()}
            <View style={profileTextBadgesContainer}>
                {renderNames()}
                <View style={statsContainer}>
                    {renderStatsLabels()}
                    {renderBadges()}
                </View>
            </View>
        </View>
    );
};

const renderSettingItems = ({ submissionHandler, helperHandler, logoutHandler }) => {
    const { item, text, topBoder } = settingStyles;

    const renderItem = (index, title, handler) => {
        if (index === 0) {
            return (
                <View style={[item, topBoder]}>
                    <TouchableOpacity onPress={handler}>
                        <Text style={text}>{title}</Text>
                    </TouchableOpacity>
                </View>
            );
        }

        if (index === 2) {
            return (
                <View style={[item, { borderBottomWidth: 0 }]}>
                    <Text style={text}>{title}</Text>
                </View>
            );
        }


        return (
            <View style={item}>
                <TouchableOpacity onPress={handler}>
                    <Text style={text}>{title}</Text>
                </TouchableOpacity>
            </View>
        );
    };

    return (
        <View>
            {renderItem(0, 'Your Submissions', submissionHandler)}
            {renderItem(1, 'Help', helperHandler)}
            {renderItem(2, versionString)}
        </View>
    );
};

type Props = {
    profile: (boolean => void, string => void) => void,
    logout: (boolean => void, string => void) => void,
    userProfile: {
        userSlug: string,
        realName: string,
        aboutMe: string,
        reputation: number,
        occupation: string,
        countryName: string,
        school: string,
        company: string,
        location: string,
        lastModified: string,
        userAvatar: string,
        gender: string,
        acStats: {
            acQuestionCount: number,
            acSubmissionCount: number,
            totalSubmissionCount: number,
            acRate: number,
        },
    }
};

class Profile extends Component<Props> {
    constructor(props) {
        super(props);

        this.state = {
            logoutLoading: false,
        };
    }

    componentDidMount() {
        const { profile } = this.props;

        profile();
    }

    logoutAction = () => {
        const { logout } = this.props;

        this.setState({ logoutLoading: true });
        logout(() => {
            this.setState({ logoutLoading: false });
            Actions.popTo('login', { needVerify: false });
        });
    }

    allSubmissions = () => {
        Actions.submissions();
    }

    renderLogout() {
        const { button, buttonDisabled, containerView } = logoutStyles;
        const { logoutLoading } = this.state;

        return (
            <Button
                backgroundColor="red"
                buttonStyle={button}
                disabledStyle={buttonDisabled}
                containerViewStyle={containerView}
                disabled={logoutLoading}
                loading={logoutLoading}
                title={logoutLoading ? '' : 'Sign out'}
                onPress={this.logoutAction}
            />
        );
    }

    render() {
        const { container, settingContainer } = profileStyles;
        const { userProfile } = this.props;
        const avatarUri = userProfile.userAvatar;

        return (
            <View style={container}>
                {renderProfile({
                    avatarUri, realName: userProfile.realName, userSlug: userProfile.userSlug, acStats: userProfile.acStats,
                })}
                <View style={settingContainer}>
                    <ScrollView>
                        {renderSettingItems({
                            submissionHandler: this.allSubmissions,
                            helperHandler: this.helpHandler,
                            logoutHandler: this.logout,
                        })}
                        {this.renderLogout()}
                    </ScrollView>
                </View>
            </View>
        );
    }
}

const mapStateToProps = state => {
    const { profile } = state;

    return {
        userProfile: profile.user.profile,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        profile: (...args) => dispatch(leetcodeUserProfile(...args)),
        logout: (...args) => dispatch(leetcodeLogout(...args)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
