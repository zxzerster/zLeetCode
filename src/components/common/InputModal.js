import React, { Component } from 'react';
import {
    View, Button, Text, Modal, TextInput, KeyboardAvoidingView,
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
        height: 300,
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
    buttonArea: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        borderTopColor: ColorScheme.separateLineGray,
        borderTopWidth: 1,
        marginVertical: 8,
    },
    textInput: {
        flex: 1,
        margin: 8,
        borderWidth: 1,
        borderColor: ColorScheme.separateLineGray,
        borderRadius: 5,
        padding: 5,
    },
};

class InputModal extends Component {
    render() {
        const {
            title, onChangeText, value, cancel, ok, ...other
        } = this.props;
        const {
            backgroundView, contentArea, titleArea, buttonArea, textInput,
        } = styles;
        const titleText = title || '';
        const cancelHandler = cancel || (() => {});
        const okHandler = ok || (() => {});

        return (
        <Modal
            animationType="fade"
            transparent
            {...other}
        >
            <KeyboardAvoidingView style={backgroundView} behavior="padding">
                <View style={contentArea}>
                    <Text style={titleArea}>{titleText}</Text>
                    <View style={{ flex: 1 }}>
                        <TextInput
                            style={textInput}
                            multiline
                            value={value}
                            onChangeText={onChangeText}
                        />
                    </View>
                    <View style={buttonArea}>
                        <Button title="OK" onPress={okHandler} />
                    </View>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
    }
}

export default InputModal;
