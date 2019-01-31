import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-elements';

export default props => {
    const { onPress } = props;

    return (
        <TouchableOpacity onPress={onPress}>
            <Icon containerStyle={{ marginRight: 16 }} type="ionicon" name="ios-refresh" color="white" />
        </TouchableOpacity>
    );
};
