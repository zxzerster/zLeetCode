import React, { Component } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import * as actions from '../actions';

class ProblemDetails extends Component {

    static onEnter(props) {
        console.log(`problemdetails`);
        
    }
    // static onEnter(props) {
    //     console.log(`Enter titleSlug: ${this.props.titleSlug}, title: ${this.props.problemTitle}`);
    // }

    componentDidMount() {
        const {csrftoken, LEETCODE_SESSION} = this.props.session;
        const {titleSlug} = this.props;
        this.props.fetchProblem(titleSlug, csrftoken, LEETCODE_SESSION);
    }

    render() {
        return (
            <View>
                <Text>{this.props.problem.data.content}</Text>
            </View>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        session: state.session,
        problem: state.problem
    };
}

export default connect(mapStateToProps, actions)(ProblemDetails);