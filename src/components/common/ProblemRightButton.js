import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-elements';

export default props => {
    return (
        <TouchableOpacity>
            <Icon containerStyle={{ marginRight: 16 }} type="ionicon" name="ios-options" color="white" />
        </TouchableOpacity>
    );
};
