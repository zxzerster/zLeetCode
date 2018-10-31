import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { connect } from 'react-redux';
import _ from 'lodash';

import * as actions from '../actions'

class Profile extends Component {

    onEnter(props) {
        // const {csrftoken, LEETCODE_SESSION} = this.props.login;
        console.log(`123123Profile onEnter123: ${props}`);
        // console.log(`csrftoken: ${csrftoken}, LEETCODE_SESSION: ${LEETCODE_SESSION}`);
        // actions.leetcodeGraphqlProfile()
    }

    // componentWillMount() {
    //     const {csrftoken, LEETCODE_SESSION} = this.props.session;
    //     console.log(`Profile componentWillMount`);
    //     console.log(`csrftoken: ${csrftoken}, LEETCODE_SESSION: ${LEETCODE_SESSION}`);
    //     this.props.leetcodeGraphqlProfile(csrftoken, LEETCODE_SESSION);
    // }

    renderUserProfile() {
        const { profile } = this.props;
        const ret = _.map(profile, (value, key) =>{
            if (key === 'acStats') {
                return (
                    <View>
                        <Text>Object</Text>
                    </View>
                )
            } 

            let str = '';
            if (value) {
                str = `${value}`;
            } else {
                str = 'Empty';
            }
            return (
                <View>
                    <Text>`${str}`</Text>
                </View>
            )
        });
        return ret;
    }

    render() {
        return (
            <View>
                {this.renderUserProfile()}
            </View>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        session: state.session,
        profile: state.profile
    }
};

export default connect(mapStateToProps, actions)(Profile);
// export default Profile;