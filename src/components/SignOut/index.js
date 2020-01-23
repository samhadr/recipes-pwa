import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

import Auth from 'aws-amplify';

class SignOut extends Component {
  static propTypes = {
    authenticate: PropTypes.func,
    user: PropTypes.func
  };

  constructor(props) {
    super(props);
  }

  signUserOut = async () => {
    // e.preventDefault();
    // await Auth.signOut()
    // .then(() => {
      // this.setState({ userData: dataUser });
      console.log('sign out success');
      sessionStorage.clear();
    // })
    // .then(() => authenticate(true))
    // .then(() => user(userData))
    // .then(() => {
      console.log('redirect to home');
      this.props.history.push('/');
      // <Router>
      //   <Redirect
      //     to={{
      //       pathname: "/recipes",
      //       state: { isAuthenticated: true }
      //     }}
      //   />
      // </Router>
    // })
    // .catch(err => {
    //   console.log(`sign out ERROR: ${err.message}`, err);
      // this.setState({ showSignInError: true })
    // });
  }

  render() {

    return (
      <div id="sign-out" onClick={() => this.signUserOut()}>Sign Out</div>
    )
  }

}

export default withRouter(SignOut);