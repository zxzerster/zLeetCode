import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { connect } from 'react-redux';

class Problems extends Component {

    static onEnter(props) {
        console.log(`123Problems onEnter.a123456.. ${props}`);
    }

    render() {
        return (
            <View>
                <Text>Problems</Text>
            </View>
        );
    }
}

export default connect()(Problems);