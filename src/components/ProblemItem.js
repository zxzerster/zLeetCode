import React from 'react';
import { ListItem } from 'react-native-elements';
import { Actions } from 'react-native-router-flux';

export default ({ problem }) => {
    return (
        <ListItem
            key={problem.questionId}
            title={problem.title}
            subtitle={problem.difficulty}
            onPress={() => { Actions.problemDetails({ titleSlug: problem.titleSlug }); }}
        />
    );
};
