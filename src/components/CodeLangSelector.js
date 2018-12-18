import React, { Component } from 'react';
import {
    TouchableOpacity, Text, FlatList,
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import { ListItem } from 'react-native-elements';

import { connect } from 'react-redux';
import { leetcodeSelectedIndex } from '../actions';

type Props = {
    langsConfig: Array,
    selectedIndex: number,
    langSelected: number => Object,
};

class CodeLangSelector extends Component<Props> {
    indexSelected = index => {
        // action(index);
        const { langSelected } = this.props;

        langSelected(index);
        Actions.pop();
    };

    renderLangItem = ({ item, index }) => {
        const { selectedIndex } = this.props;
        const rightCheck = index === selectedIndex ? '✓' : ' ';

        return (
            <ListItem
                key={item.lang}
                title={item.displayName}
                rightTitle={rightCheck}
                onPress={() => this.indexSelected(index)}
                hideChevron
            />
        );
    };

    render() {
        const { langsConfig } = this.props;

        return (
            <FlatList
                style={{ backgroundColor: 'white' }}
                data={langsConfig}
                keyExtractor={item => item.lang}
                renderItem={this.renderLangItem}
            />
        );
    }
}

const mapDispatchToProps = dispatch => {
    return {
        langSelected: (...args) => dispatch(leetcodeSelectedIndex(...args)),
    };
};

export default connect(null, mapDispatchToProps)(CodeLangSelector);
