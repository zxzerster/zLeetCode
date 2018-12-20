import React from 'react';
import { Icon } from 'react-native-elements';

type Props = {
    tintColor: string,
};

export default (props: Props) => {
    const { tintColor } = props;

    return (
        <Icon type="ionicon" name="ios-heart" color={tintColor} />
    );
};
