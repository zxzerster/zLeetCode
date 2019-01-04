import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { Badge, Icon } from 'react-native-elements';
import { Actions } from 'react-native-router-flux';
import _ from 'lodash';

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
        questionId, titleSlug, title, difficulty, likes, status, isPaidOnly, topicTags,
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
        index === 0 ? {} : topBorder, isPaidOnly ? { backgroundColor: ColorScheme.separateLineGray } : {},
    ];

    const tags = arr => {
        const t = _.map(arr, item => {
          return `${item.name}   `;
        });

        return t;
    };

    const check = resolved => {
        if (resolved) {
            return (
                <Icon size={36} type="evilicon" name="check" color={ColorScheme.easyGreen} />
            );
        }

        return null;
    };

    const lock = paidOnly => {
        if (paidOnly) {
            return (
                <Icon size={36} type="evilicon" name="lock" color={ColorScheme.lightGray} />
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
                <View style={{ flexDirection: 'row' }}>
                    <Icon size={16} type="font-awesome" name="tags" color="gray" containerStyle={tagIcon} />
                    <View style={tagTextWrapper}><Text numberOfLines={100} style={tagText}>{tags(topicTags)}</Text></View>
                </View>
            );
        }

        return null;
    };

    return (
        <TouchableOpacity disabled={isPaidOnly} style={listItem} key={questionId} onPress={() => { goToDetails(); }}>
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
                        <Icon type="simple-line-icon" name="like" size={17} color="gray" containerStyle={{ marginTop: 4, marginRight: 5 }} />
                        <Text style={{ marginTop: 5, color: ColorScheme.textGray }}>{likes}</Text>
                    </View>
                </View>
            </View>
            {renderRightPart()}
        </TouchableOpacity>
    );
};
