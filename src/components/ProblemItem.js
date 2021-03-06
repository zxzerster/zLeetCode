import React from 'react';
import {
    View, TouchableOpacity, Text, Alert, Linking,
} from 'react-native';
import { Badge, Icon } from 'react-native-elements';
import { Actions } from 'react-native-router-flux';
import _ from 'lodash';

import { URLs } from '../network';
import { ColorScheme } from '../utils/Config';

const styles = {
    itemStyle: {
        flexDirection: 'row',
        padding: 10,
    },
    leftPart: {
        flex: 4,
        flexDirection: 'row',
    },
    rightPart: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'flex-end',
        marginRight: 12,
    },
    topBorder: {
        borderTopWidth: 0.5,
        borderTopColor: ColorScheme.separateLineGray,
    },
    bottomBorder: {
        borderBottomWidth: 0.5,
        bottomBottomColor: ColorScheme.separateLineGray,
    },
    titleStyle: {
        fontSize: 18,
        fontWeight: '500',
        color: ColorScheme.textDarkGray,
    },
    easyGreen: {
        backgroundColor: ColorScheme.easyGreen,
    },
    mediumYellow: {
        backgroundColor: ColorScheme.mediumYellow,
    },
    hardRed: {
        backgroundColor: ColorScheme.hardRed,
    },
    tagIcon: {
        justifyContent: 'center',
        marginTop: 4,
        marginRight: 5,
    },
    tagText: {
        color: ColorScheme.textGray,
    },
    tagTextWrapper: {
        marginTop: 5,
        backgroundColor: ColorScheme.lightGrayBackground,
        padding: 5,
        borderRadius: 5,
    },
};

type ProblemItemProps = {
    index: number,
    problem: {
        title: string,
        titleSlug: string,
        questionId: string,
        difficulty: string,
        status: string,
        like: number,
        dislike: number,
    },
    from: string,
};

export default ({ problem, index, from }: ProblemItemProps) => {
    const {
        itemStyle, leftPart, rightPart, topBorder,
        easyGreen, mediumYellow, hardRed, titleStyle, tagIcon, tagText, tagTextWrapper,
    } = styles;
    const {
        questionId, titleSlug, title, difficulty, likes, status, isPaidOnly, topicTags, isPremiumUser,
    } = problem;
    let difficultyColor;

    if (difficulty === 'Easy') {
        difficultyColor = easyGreen;
    } else if (difficulty === 'Medium') {
        difficultyColor = mediumYellow;
    } else {
        difficultyColor = hardRed;
    }
    const listItem = [
        itemStyle,
        index === 0 ? {} : topBorder, isPaidOnly ? { backgroundColor: ColorScheme.lightGrayBackground } : {},
    ];

    const tags = arr => {
        const t = _.map(arr, item => {
          return `${item.name}   `;
        });

        return t;
    };

    const check = st => {
        if (st === 'ac') {
            return (
                <Icon size={32} type="ionicon" name="ios-checkmark-circle-outline" color={ColorScheme.easyGreen} />
            );
        }

        if (st === 'notac') {
            return (
                <Icon size={32} type="ionicon" name="ios-timer" color={ColorScheme.textGray} />
            );
        }

        return null;
    };

    const lock = paidOnly => {
        if (paidOnly && !isPremiumUser) {
            return (
                <Icon size={32} type="evilicon" name="lock" color={ColorScheme.lightGray} />
            );
        }

        return null;
    };

    const goToDetails = () => {
        if (!isPaidOnly) {
            if (from && from === 'SearchTab') {
                Actions.taggedProblemDetails({ titleSlug, from });
            } else {
                Actions.problemDetails({ titleSlug });
            }
        } else if (isPaidOnly && !isPremiumUser) {
            Alert.alert('LeetCode', 'Premium user only', [
                {
                    text: 'Subscribe', onPress: () => { Linking.openURL(URLs.premium); },
                },
                {
                    text: 'Cencel',
                },
            ]);
        }
    };

    const renderRightPart = () => {
        if (isPaidOnly && status) {
            return (
                <View style={rightPart}>
                    {check(status)}
                    {lock(isPaidOnly)}
                </View>
            );
        }

        if (isPaidOnly) {
            return (
                <View style={rightPart}>
                    {lock(isPaidOnly)}
                </View>
            );
        }

        if (status) {
            return (
                <View style={rightPart}>
                    {check(status)}
                </View>
            );
        }

        return null;
    };

    const renderTags = () => {
        if (topicTags.length > 0) {
            return (
                <View style={{ flexDirection: 'row', marginRight: 8 }}>
                    <Icon size={16} type="font-awesome" name="tags" color={ColorScheme.lightGray} containerStyle={tagIcon} />
                    <View style={tagTextWrapper}><Text numberOfLines={100} style={tagText}>{tags(topicTags)}</Text></View>
                </View>
            );
        }

        return null;
    };

    return (
        <TouchableOpacity style={listItem} key={questionId} onPress={() => { goToDetails(); }}>
            <View style={leftPart}>
                {/* <View style={[listId]}>
                    <Text numberOfLines={1} style={idTextStyle}>{`${questionId}`}</Text>
                </View> */}
                <View style={{ flex: 3, marginLeft: 10 }}>
                    <Text style={{ color: ColorScheme.textGray }}>{`#${questionId}`}</Text>
                    <Text
                        style={titleStyle}
                        numberOfLines={1}
                    >
                        {`${title}`}
                    </Text>
                    <Badge containerStyle={[{ width: 70, marginTop: 5 }, difficultyColor]}>
                        <Text style={{ fontSize: 11, color: ColorScheme.white }}>{difficulty}</Text>
                    </Badge>
                    {renderTags()}
                    <View style={{ flexDirection: 'row' }}>
                        <Icon type="simple-line-icon" name="like" size={17} color={ColorScheme.lightGray} containerStyle={{ marginTop: 4, marginRight: 5 }} />
                        <Text style={{ marginTop: 5, color: ColorScheme.textGray }}>{likes}</Text>
                    </View>
                </View>
            </View>
            {renderRightPart()}
        </TouchableOpacity>
    );
};
