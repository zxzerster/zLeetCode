import React, { Component } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import * as actions from '../actions';
// import styled from 'styled-components';
// import Icon from 'react-native-vector-icons/FontAwesome';
// import { Input } from 'react-native-elements';
import { connect } from 'react-redux';

class Login extends Component {
    onButtonPress() {
        const { login } = this.props;

        login('zxz_er', '454127927');
    }

    onButtonPress1() {
        const { logout } = this.props;
        logout();
    }

    render() {
        return (
            <View>
                <TouchableOpacity onPress={this.onButtonPress.bind(this)}>
                    <Text>Verify User Status</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={this.onButtonPress1.bind(this)}>
                    <Text>Verify User Status</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

// import { ZLCViewContainer } from './common/ZLCViewContainer';
// import ZLCTextInput from './common/ZLCTextInput';
// import ZLCButton from './common/ZLCButton';
// import ZLCSpinner from './common/ZLCSpinner';

// import * as actions from '../actions';

// const Modal = styled.Modal`
//     flex: 1;
//     justify-content: center;
//     align-items: center;
// `;

// class Login extends Component {

//     state = { username: '', pwd: '' };

//     onButtonPress() {
//         console.log('button pressed');
//         const {csrftoken, LEETCODE_SESSION} = this.props;
//         const {username, pwd} = this.state;

//         this.props.leetcodeLogin('zxz_er', '454127927', csrftoken, LEETCODE_SESSION);
//     }

//     renderButton() {
//         if (this.props.loading) {
//             return (
//                 <ZLCSpinner 
//                     animating
//                 />
//             );
//         }

//         return (
//             <ZLCButton 
//                 onPress={() => this.onButtonPress()}
//                 title='Click me!'
//             />
//         );
//     }

//     renderLoginInfo() {
//         return (
//             <View>
//                 <Text>Login Info:</Text>
//                 <Text>{ this.props.LEETCODE_SESSION }</Text>
//                 <Text>{ this.props.csrftoken }</Text>
//                 <Text>{ this.props.username }</Text>
//             </View>
//         );
//     }

//     render() {
//         return (
//         <View>
//             <ZLCTextInput 
//                 label='User name'
//                 onChangeText={username => this.setState({ username })}
//                 value={this.state.username}
//             />
//             <ZLCTextInput
//                 label='Password'
//                 onChangeText={pwd => this.setState({ pwd })}
//                 value={this.state.pwd}
//                 secureTextEntry
//             />

//             {this.renderButton()}
//             {this.renderLoginInfo()}
//             <ZLCViewContainer style={{ flex: 5 }}>
//                 <Modal>
//                     <Text>This is a styled modal component</Text>
//                 </Modal>
//             </ZLCViewContainer>
            
//         </View>);
//     }

// }

// const mapStateToProps = (state) => {
//     return state.session
// }

// export default connect(mapStateToProps, actions)(Login);
export default connect(null, actions)(Login);
