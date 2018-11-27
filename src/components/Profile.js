import React, { Component } from 'react';
import {
    View, Image, Text, ScrollView, TouchableOpacity,
} from 'react-native';
import { Badge, Divider } from 'react-native-elements';

import { connect } from 'react-redux';
import { leetcodeUserProfile } from '../actions';

type Props = {
    profile: Function,
    userProfile?: Object,
    loading: boolean,
    error: Object,
};

const styles = {
    container: {
        flex: 1,
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

const renderProfile = ({
    avatarUri, realName, userSlug, acStats,
}) => {
    // Avatar
    const renderAvatar = () => {
        const { avatar } = styles;

        return (
            <View>
                <Image style={avatar} source={{ uri: avatarUri }} />
            </View>
        );
    };

    // Names
    const renderNames = () => {
        const { realNameText, nameSlugText, divider } = styles;

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
        const { statsLabelContainer, statsLableTextContainer, statsLabelText } = styles;

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
        } = styles;

        return (
            <View style={badgeContainer}>
                <View style={[badge]}>
                    <Badge containerStyle={greenBadge} value={acStats.acQuestionCount} />
                </View>
                <View style={[badge]}>
                    <Badge containerStyle={greenBadge} value={`${acStats.acSubmissionCount}/${acStats.totalSubmissionCount}`} />
                </View>
                <View style={[badge]}>
                    <Badge containerStyle={blueBadge} value={`${acStats.acRate}%`} />
                </View>
            </View>
        );
    };

    const { profileContainer, profileTextBadgesContainer, statsContainer } = styles;

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

const renderSettingItems = () => {
    const renderItem = (title, handler) => {
        return (
            <TouchableOpacity>
                <Text>{title}</Text>
            </TouchableOpacity>
        );
    };

    return (
        <View>
            {renderItem('Your Submissions')}
            {renderItem('Help')}
            {renderItem('Logout')}
            {renderItem('Versions/1')}
        </View>
    );
};

class Profile extends Component<Props> {
    static defaultProps = {
        userProfile: {
            userAvatar: '',
        },
    };

    componentDidMount() {
        const { profile } = this.props;

        profile();
    }

    render() {
        const { container, settingContainer } = styles;
        const { userProfile, loading, error } = this.props;
        const avatarUri = userProfile.userAvatar;

        if (loading || error) {
        return (
                <View>
                    <Text>Loading</Text>
                </View>
            );
        }

        return (
            <View style={container}>
                {renderProfile({
                    avatarUri, realName: userProfile.realName, userSlug: userProfile.userSlug, acStats: userProfile.acStats,
                })}
                <View style={settingContainer}>
                    <ScrollView>
                        {renderSettingItems()}
                    </ScrollView>
                </View>
            </View>
        );
    }
}

const mapStateToProps = state => {
    const { profile } = state;

    return {
        loading: profile.loading,
        error: profile.error,
        userProfile: profile.user.profile,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        profile: (...args) => dispatch(leetcodeUserProfile(...args)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
