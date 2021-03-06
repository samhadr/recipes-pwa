import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  BrowserRouter as Router,
  Redirect,
  withRouter
} from 'react-router-dom';

import { Auth } from 'aws-amplify';

// import globalStyles from '../styles/GlobalStyles';
// import formStyles from '../styles/FormStyles';

import './index.scss';

class SignIn extends Component {
  static propTypes = {
    authenticate: PropTypes.func,
    user: PropTypes.func
  };

  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
      showSignInError: false,
      // confirmationCode: '',
      userData: {}
    };
  }

  // validateForm() {
  //   const { email, password } = this.state;
  //   return email.length > 0 && password.length > 0;
  // }

  onChangeText = (key, event) => {
    const target = event.target;
    const value = target.value;
    // console.log('key: ', key);
    // console.log('value: ', value);
    this.setState({
      [key]: value
    });
  }

  signIn = (e) => {
    const { email, password, userData } = this.state;
    const { authenticate, user} = this.props;
    e.preventDefault();
    Auth.signIn(email, password)
    .then(dataUser => {
      this.setState({ userData: dataUser });
      console.log('sign in success', dataUser);
      sessionStorage.setItem('isAuthenticated', true);
    })
    .then(() => authenticate(true))
    .then(() => user(userData))
    .then(() => {
      console.log('redirect to recipes');
      this.props.history.push('/recipes');
      // <Router>
      //   <Redirect
      //     to={{
      //       pathname: "/recipes",
      //       state: { isAuthenticated: true }
      //     }}
      //   />
      // </Router>
    })
    .catch(err => {
      console.log(`sign in ERROR: ${err.message}`, err),
      this.setState({ showSignInError: true })
    });
  }

  // confirmSignIn = () => {
  //   Auth.confirmSignIn(this.state.user, this.state.confirmationCode)
  //   .then(() => {
  //     this.props.screenProps.authenticate(true);
  //     console.log('confirm sign in success')
  //   })
  //   .catch(err => console.log('confirm sign in ERROR: ', err));
  //   this.props.navigation.navigate('Search');
  // }

  render() {
    const { email, password, showSignInError, userData } = this.state;
    // console.log('userData: ', userData);

    return (
      <div id="sign-in">
        <div className="container">
          <h1>Sign in to your account:</h1>
          <form className="form-box">
            <input
              type="email"
              value={email}
              onChange={value => this.onChangeText('email', value)}
              placeholder="Email"
            />
            <input
              type="password"
              value={password}
              onChange={value => this.onChangeText('password', value)}
              placeholder="Password"
            />
            {showSignInError ? <span>Incorrect username or password</span> : null}
            <button
              type="submit"
              onClick={this.signIn}
              title="Sign In"
            >
              Submit
            </button>
            <button
              type="submit"
              onClick={() => this.props.navigation.navigate('ForgotPassword')}
              title="Forgot Password?"
            >
              Forgot Password?
            </button>
          </form>
        </div>
      </div>
    );
  }
}

export default withRouter(SignIn);
