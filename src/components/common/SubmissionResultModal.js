import React from 'react';
import {
    View, Button, Text, Modal,
} from 'react-native';

import { ColorScheme } from '../../utils/Config';

const styles = {
    backgroundView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    contentArea: {
        backgroundColor: 'white',
        width: '75%',
        height: '40%',
        borderRadius: 12,
    },
    titleArea: {
        marginTop: 12,
        marginBottom: 12,
        alignSelf: 'center',
        fontSize: 18,
        fontWeight: '500',
        color: ColorScheme.textDarkerGray,
    },
    resultArea: {
        flex: 4,
        borderTopColor: ColorScheme.separateLineGray,
        borderTopWidth: 1,
    },
    buttonArea: {
        justifyContent: 'center',
        borderTopColor: ColorScheme.separateLineGray,
        borderTopWidth: 1,
        flex: 1,
    },
    itemArea: {
        marginHorizontal: 5,
    },
    resultItemWrapper: {
        flexDirection: 'row',
        // flex: 1,
    },
    resultItemTitle: {
        flex: 3,
        alignItems: 'flex-end',
    },
    resultItemTitleText: {
        color: ColorScheme.textDarkerGray,
        fontWeight: '500',
        marginLeft: 10,
        marginTop: 15,
    },
    resultItemContent: {
        flex: 7,
        justifyContent: '',
    },
    resultItemContentText: {
        color: ColorScheme.textDarkGray,
        marginLeft: 10,
        marginTop: 16,
        marginRight: 10,
    },
};

export default ({
    title, buttonTitle, pressHandler, error, input, output, expected, ...other
}) => {
    const {
        backgroundView, contentArea, titleArea, resultArea, buttonArea,
        resultItemWrapper, resultItemTitle, resultItemTitleText, resultItemContent, resultItemContentText
    } = styles;

    const titleText = title || '';
    const buttonTitltText = buttonTitle || 'OK';
    const handler = pressHandler || (() => {});
    const renderItem = (itemTitle, itemContent) => {
        return (
            <View style={resultItemWrapper}>
                <View style={resultItemTitle}>
                    <Text style={resultItemTitleText}>{itemTitle}</Text>
                </View>
                <View style={resultItemContent}>
                    <Text style={resultItemContentText}>{itemContent}</Text>
                </View>
            </View>
        );
    };
    const renderResult = (input, output, expected) => {
        return (
            <View style={resultArea}>
                {renderItem('Input:', input)}
                {renderItem('Output:', output)}
                {renderItem('Expected:', expected)}
            </View>
        );
    };
    const renderError = err => {
        return (
            <View style={resultArea}>
                <Text style={{ margin: 8, color: ColorScheme.hardRed }}>{err}</Text>
            </View>
        );
    };

    const renderContentArea = (error, input, output, expected) => {
        if (error && error.length > 0) {
            return renderError(error);
        }

        return renderResult(input, output, expected);
    }

    return (
        <Modal
            animationType="fade"
            transparent
            {...other}
        >
            <View style={backgroundView}>
                <View style={contentArea}>
                    <Text style={titleArea}>{titleText}</Text>
                    {/* <View style={resultArea}>
                        {renderItem('Input:', input)}
                        {renderItem('Output:', output)}
                        {renderItem('Expected:', expected)}
                    </View> */}
                    {renderContentArea(error, input, output, expected)}
                    <View style={buttonArea}>
                        <Button title={buttonTitltText} onPress={handler} />
                    </View>
                </View>
            </View>
        </Modal>
    );
};
