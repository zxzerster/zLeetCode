import React, { Component } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import _ from 'lodash';
import * as actions from '../actions';
import { Actions } from 'react-native-router-flux';

class ProblemItem extends Component {

    onProblemPress() {
        const {titleSlug, title} = this.props.problem;
        Actions.problemdetails({titleSlug, title: title});
    }

    render() {
        const {title} = this.props.problem;
        return (
            <TouchableOpacity onPress={this.onProblemPress.bind(this)}>
                <View>
                    <Text>{title}</Text>
                </View>
            </TouchableOpacity>
        );
    }
}

class Problems extends Component {

    static onEnter(props) {
        console.log(`13123123Problems onEnter.a123456.. ${props}`);
    }

    componentWillMount() {
        const {csrftoken, LEETCODE_SESSION} = this.props.session;
        this.props.fetchAllProblems(csrftoken, LEETCODE_SESSION);
    }

    renderProblems() {
        const { data } = this.props.allProblems
        return (
            <FlatList 
                data={data.allQuestions}
                keyExtractor={(item) => item.questionId}
                renderItem={({item}) => <ProblemItem problem={item} />}
            /> 
        );
    }

    render() {
        return (
            <View>
                <Text>Problems</Text>
                {this.renderProblems()}
            </View>
        );
    }
}

const mapStateToProps = (state) => {
    const { session, allProblems } = state;
    return {
        session,
        allProblems
    }
}

export default connect(mapStateToProps, actions)(Problems);