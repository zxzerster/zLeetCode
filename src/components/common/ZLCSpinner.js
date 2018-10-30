import React from 'react';
import { View, ActivityIndicator } from 'react-native';

const ZLCSpinner = ({ animating, size }) => {
    return (
        <View>
            <ActivityIndicator 
                animating={animating}
                size={size || 'small'}
            />
        </View>
    )
};

export default ZLCSpinner;