import React from 'react';
import {
    View, requireNativeComponent,
} from 'react-native';

const MarkdownView = requireNativeComponent('MarkdownView');

export default ({ markdown }) => {
    let markdownString = markdown || '';

    markdownString = markdownString.replace('[TOC]', '');

    return (
        <View style={{ flex: 1 }}>
            <MarkdownView style={{ flex: 4, backgroundColor: 'blue' }} markdown={markdownString} />
        </View>
    )
}
