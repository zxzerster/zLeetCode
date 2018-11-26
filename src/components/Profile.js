import React, { Component } from 'react';
import { View, Image, Text } from 'react-native';
import { Badge, Divider } from 'react-native-elements';

import { connect } from 'react-redux';
import { leetcodeUserProfile } from '../actions';

type Props = {
    profile: Function,
    userProfile: Object,
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
    profileTextContainer: {
        height: 95,
        justifyContent: 'space-between',
        flex: 1,
        paddingTop: 3,
        // backgroundColor: 'yellow',
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
        const {
            container, profileContainer, settingContainer, avatar,
            profileTextContainer, realNameText, nameSlugText, statsContainer,
            badgeContainer, divider, statsLabelContainer, statsLableTextContainer,
            statsLabelText, badge, greenBadge, blueBadge,
        } = styles;
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
                <View style={profileContainer}>
                    <View>
                        <Image style={avatar} source={{ uri: avatarUri }} />
                    </View>
                    <View style={profileTextContainer}>
                        <View>
                            <Text style={realNameText}>{userProfile.realName}</Text>
                            <Text style={nameSlugText}>{userProfile.userSlug}</Text>
                            <Divider style={divider} />
                        </View>
                        <View style={statsContainer}>
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
                            <View style={badgeContainer}>
                                <View style={[badge]}>
                                    <Badge containerStyle={greenBadge} value={userProfile.acStats.acQuestionCount} />
                                </View>
                                <View style={[badge]}>
                                    <Badge containerStyle={greenBadge} value={`${userProfile.acStats.acSubmissionCount}/${userProfile.acStats.totalSubmissionCount}`} />
                                </View>
                                <View style={[badge]}>
                                    <Badge containerStyle={blueBadge} value={`${userProfile.acStats.acRate}%`} />
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
                <View style={settingContainer} >

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

// class Profile extends Component {

//     static onEnter() {
//         console.log('Hello Profile');
//     }

//     componentWillMount() {
//         const {csrftoken, LEETCODE_SESSION} = this.props.session;
//         console.log(`Profile componentWillMount`);
//         console.log(`csrftoken: ${csrftoken}, LEETCODE_SESSION: ${LEETCODE_SESSION}`);
//         this.props.leetcodeGraphqlProfile(csrftoken, LEETCODE_SESSION);
//     }

//     renderUserProfile() {
//         const { profile } = this.props;
//         const ret = _.map(profile, (value, key) =>{
//             if (key === 'acStats') {
//                 return (
//                     <View>
//                         <Text>Object</Text>
//                     </View>
//                 )
//             } 

//             let str = '';
//             if (value) {
//                 str = `${value}`;
//             } else {
//                 str = 'Empty';
//             }
//             return (
//                 <View>
//                     <Text>`${str}`</Text>
//                 </View>
//             )
//         });
//         return ret;
//     }

//     render() {
//         return (
//             <View>
//                 {this.renderUserProfile()}
//             </View>
//         );
//     }
// }

// const mapStateToProps = (state) => {
//     return {
//         session: state.session,
//         profile: state.profile
//     }
// };

// export default connect(mapStateToProps, actions)(Profile);
// export default Profile;