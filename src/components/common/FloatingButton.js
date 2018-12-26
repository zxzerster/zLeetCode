import React from 'react';
import { TouchableOpacity, Text } from 'react-native';

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
    style: Object,
    onPress: (object) => void,
};

export default (props: Props) => {
    const {
        position, title, color, style, onPress,
    } = props;
    const { buttonStyle, titleStyle } = styles;
    const buttonPosition = position || 'right';
    const positonStyle = buttonPosition === 'right' ? { right: 0 } : { left: 0 };
    const verticalMargin = { marginBottom: style.marginBottom || 0 };
    const colorStyle = color || buttonStyle.backgroundColor;
    const pressHandler = onPress || (() => {});
    let horizontalMargin = 0;

    if (buttonPosition === 'right') {
        horizontalMargin = { marginRight: style.marginRight || 0 };
    } else {
        horizontalMargin = { marginLeft: style.marginLeft || 0 };
    }

    return (
        <TouchableOpacity
            style={[buttonStyle, { backgroundColor: colorStyle }, positonStyle, horizontalMargin, verticalMargin]}
            onPress={pressHandler}
        >
            <Text style={titleStyle}>{title}</Text>
        </TouchableOpacity>
    );
};
