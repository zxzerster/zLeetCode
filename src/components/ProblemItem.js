import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { Badge, Icon } from 'react-native-elements';
import { Actions } from 'react-native-router-flux';
import _ from 'lodash';

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
        borderTopColor: 'rgb(219, 219, 219)',
    },
    bottomBorder: {
        borderBottomWidth: 0.5,
        bottomBottomColor: 'rgb(239, 239, 239)',
    },
    idStyle: {
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    idTextStyle: {
        fontSize: 18,
        fontWeight: '500',
        color: 'rgb(73, 78, 82)',
    },
    titleStyle: {
        fontSize: 18,
        fontWeight: '500',
        color: 'rgb(73, 78, 82)',
    },
    easyGreen: {
        backgroundColor: 'rgb(116,181, 102)',
    },
    mediumYellow: {
        backgroundColor: 'rgb(231, 175, 95)',
    },
    hardRed: {
        backgroundColor: 'rgb(202, 92, 84)',
    },
    tagIcon: {
        justifyContent: 'center',
        marginTop: 4,
        marginRight: 5,
    },
    tagText: {
        color: 'gray',
    },
    tagTextWrapper: {
        flex: 1,
        // maxWidth: '90%',
        marginTop: 5,
        backgroundColor: '#f7f9fa',
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
};

export default ({ problem, index }: ProblemItemProps) => {
    const {
        itemStyle, leftPart, rightPart, topBorder, idTextStyle, idStyle,
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
        index === 0 ? {} : topBorder, isPaidOnly ? { backgroundColor: '#eaeaea' } : {},
    ];
    const listId = [idStyle, difficultyColor];

    const tags = arr => {
        const t = _.map(arr, item => {
          return `${item.name}   `;
        });

        return t;
    };

    const check = resovled => {
        if (resovled) {
            return (
                <Icon size={36} type="evilicon" name="check" color="rgb(116,181, 102)" />
            );
        }

        return null;
    };

    const lock = paidOnly => {
        if (paidOnly) {
            return (
                <Icon size={36} type="evilicon" name="lock" color="gray" />
            );
        }

        return null;
    };

    const goToDetails = () => {
        if (!isPaidOnly) {
            Actions.problemDetails({ titleSlug });
        }
    };

    const renderRightPart = () => {
        if (isPaidOnly) {
            return (
                <View style={rightPart}>
                    {check(status)}
                    {lock(isPaidOnly)}
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
                <View style={[listId]}>
                    <Text numberOfLines={1} style={idTextStyle}>{`${index}`}</Text>
                </View>
                <View style={{ flex: 3, marginLeft: 10 }}>
                    <Text
                        style={titleStyle}
                        numberOfLines={1}
                    >
                        {`${title}`}
                    </Text>
                    <Badge containerStyle={[{ width: 70, marginTop: 5 }, difficultyColor]}>
                        <Text style={{ fontSize: 11, color: 'white' }}>{difficulty}</Text>
                    </Badge>
                    {renderTags()}
                    <View style={{ flexDirection: 'row' }}>
                        <Icon type="simple-line-icon" name="like" size={17} color="gray" containerStyle={{ marginTop: 4, marginRight: 5 }} />
                        <Text style={{ marginTop: 5, color: 'gray' }}>{likes}</Text>
                    </View>
                </View>
            </View>
            {renderRightPart()}
        </TouchableOpacity>
    );
};
