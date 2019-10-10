import React, { Component } from 'react';
import PropTypes from 'prop-types';

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

  validateForm() {
    const { email, password } = this.state;
    return email.length > 0 && password.length > 0;
  }

  onChangeText = (key, value) => {
    this.setState({
      [key]: value
    });
  }

  signIn = () => {
    const { email, password, userData } = this.state;
    const { authenticate, user} = this.props;

    Auth.signIn(email, password)
    .then(dataUser => {
      this.setState({ userData: dataUser });
      console.log('sign in success', dataUser);
    })
    .then(() => authenticate(true))
    .then(() => user(userData))
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
    const { email, password, showSignInError } = this.state;

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

export default SignIn;
