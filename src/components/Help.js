import React from 'react';
import {
    View, Text,
} from 'react-native';

import { ColorScheme } from '../utils/Config';

export default () => {
    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <View style={{ marginHorizontal: 8, marginVertical: 12 }}>
                <View style={{ marginBottom: 12 }}>
                    <Text style={{ fontSize: 18, fontWeight: '500', color: ColorScheme.textDarkerGray }}>Need Re-Login sometimes?</Text>
                </View>
                <View>
                    <Text style={{ fontSize: 14, color: ColorScheme.textGray }}>This is because leetcode only allow user stay logged in on one device. If you logged in somewhere else, then your credential is invalid, a re-login is needed.</Text>
                </View>
            </View>
            <View style={{ marginHorizontal: 8, marginVertical: 12 }}>
                <View style={{ marginBottom: 12 }}>
                    <Text style={{ fontSize: 18, fontWeight: '500', color: ColorScheme.textDarkerGray }}>Data storage</Text>
                </View>
                <View>
                    <Text style={{ linefontSize: 14, color: ColorScheme.textGray }}>All your data is stored only on device, especially your account data, no other apps can get them.</Text>
                </View>
            </View>
        </View>
    );
};
