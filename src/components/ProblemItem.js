import React from 'react';
import { View, Text } from 'react-native';

export default ({ problem }) => {
    return (
        <View key={problem.questionId}>
            <Text>{problem.title}</Text>
            <Text>{problem.difficulty}</Text>
        </View>
    )
};
