import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator } from 'react-native';

const styles = {
    buttonStyle: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: 'rgb(64, 137, 214)',
        opacity: 0.8,
        position: 'absolute',
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.3,
    },
    titleStyle: {
        color: 'white',
        fontSize: 26,
        fontWeight: '600',
        paddingBottom: 3,
    },
};

type Props = {
    title: string,
    color: string,
    position: string,
    loading: boolean,
    style: Object,
    onPress: (object) => void,
};

export default ({
    position, title, color, style, onPress, loading, ...others
}: Props) => {
    const { buttonStyle, titleStyle } = styles;
    const buttonPosition = position || 'right';
    const positonStyle = buttonPosition === 'right' ? { right: 0 } : { left: 0 };
    const verticalMargin = { marginBottom: style ? (style.marginBottom || 0) : 0 };
    const colorStyle = color || buttonStyle.backgroundColor;
    const pressHandler = onPress || (() => {});
    let horizontalMargin = 0;

    if (buttonPosition === 'right') {
        horizontalMargin = { marginRight: style ? (style.marginRight || 0) : 0 };
    } else {
        horizontalMargin = { marginLeft: style ? (style.marginLeft || 0) : 0 };
    }
    const renderChildren = text => {
        if (loading) {
            return <ActivityIndicator color="white" animating />;
        }

        return <Text style={titleStyle}>{text}</Text>;
    };

    return (
        <TouchableOpacity
            {...others}
            disabled={loading}
            style={[buttonStyle, { backgroundColor: colorStyle }, positonStyle, horizontalMargin, verticalMargin]}
            onPress={pressHandler}
        >
            {renderChildren(title)}
        </TouchableOpacity>
    );
};
