import React from 'react';
import { View, Text, TextInput } from 'react-native';

const ZLCTextInput = ({ label, onChangeText, value, secureTextEntry }) => {
    const {containerStyle, labelStyle, inputStyle} = styles;

    return (
        <View style={containerStyle} >
            <Text style={labelStyle} >{label}</Text>
            <TextInput 
                secureTextEntry={secureTextEntry}
                style={inputStyle}
                onChangeText={onChangeText}
                value={value}
            />
        </View>
    )
};

styles = {
    containerStyle: {
        flexDirection: 'row',
    },
    labelStyle: {
        fontSize: 16,
        paddingLeft: 15,
        flex: 1
    },
    inputStyle: {
        flex: 3,
        fontSize: 16
    }
}

export default ZLCTextInput;