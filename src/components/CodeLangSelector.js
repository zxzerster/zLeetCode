import React, { Component } from 'react';
import {
    TouchableOpacity, Text, FlatList,
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import { ListItem } from 'react-native-elements';

import { connect } from 'react-redux';
import { leetcodeSelectedIndex } from '../actions';

class CodeLangSelector extends Component {
    static renderLangItem({ item, index }) {
        const { selectedIndex, select } = this.props;
        const title = index === selectedIndex ? '✓' : ' ';

        return (
            <ListItem
                key={item.lang}
                title={item.displayName}
                rightTitle={title}
                onPress={() => select(index, select)}
                hideChevron
            />
        );
    }

    static indexSelected(index, action) {
        action(index);
        Actions.pop();
    }

    render() {
        const { langsConfig } = this.props;

        return (
            <FlatList
                data={langsConfig}
                keyExtractor={item => item.lang}
                renderItem={CodeLangSelector.renderLangItem.bind(this)}
            />
        );
    }
}

const mapDispatchToProps = dispatch => {
    return {
        select: (...args) => dispatch(leetcodeSelectedIndex(...args)),
    };
};

export default connect(null, mapDispatchToProps)(CodeLangSelector);
