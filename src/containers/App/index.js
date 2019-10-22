import { hot } from 'react-hot-loader/root';
import React, { Component } from 'react';

import Amplify from 'aws-amplify';
import awsconfig from '../../aws-exports';
import { withAuthenticator } from 'aws-amplify-react';

Amplify.configure(awsconfig);

// AWS API
// import Amplify from 'aws-amplify';
// import config from '../../config';

// Amplify.configure({
//   Auth: {
//     mandatorySignIn: true,
//     region: config.cognito.REGION,
//     userPoolId: config.cognito.USER_POOL_ID,
//     identityPoolId: config.cognito.IDENTITY_POOL_ID,
//     userPoolWebClientId: config.cognito.APP_CLIENT_ID
//   },
//   Storage: {
//     region: config.s3.REGION,
//     bucket: config.s3.BUCKET,
//     identityPoolId: config.cognito.IDENTITY_POOL_ID
//   },
//   API: {
//     endpoints: [{
//       name: "recipes",
//       endpoint: config.apiGateway.URL,
//       region: config.apiGateway.REGION
//     }, ]
//   }
// });

import SignIn from '../SignIn';
// import Recipes from './containers/Recipes';
import Test from '../../containers/Test';

import './index.scss';

const signUpConfig = {
  header: 'Sign Up',
  hideAllDefaults: true,
  defaultCountryCode: '1',
  signUpFields: [
    {
      label: 'Username',
      key: 'email',
      required: true,
      displayOrder: 1,
      type: 'string'
    },
    {
      label: 'Password',
      key: 'password',
      required: true,
      displayOrder: 2,
      type: 'password'
    },
  ]
};

class App extends Component {
  constructor() {
    super();
    this.state = {
      isLoadingComplete: false,
      isAuthenticated: false,
      currentUser: {}
    }
  }

  authenticate = (isAuthenticated) => {
    this.setState({ isAuthenticated });
  }

  user = (user) => {
    const { isAuthenticated } = this.state;
    isAuthenticated ? this.setState({ currentUser: user }) : null;
  }

  render() {
    const { isAuthenticated, currentUser } = this.state;
    const userEmail = Object.keys(currentUser).length > 0 ? currentUser.signInUserSession.idToken.payload.email : null;
    console.log('App isAuthenticated: ', isAuthenticated);

    if (isAuthenticated){
      return (
        <Test />
      );
    }

    return (
      <div>
        <h1>Recipes</h1>
        {/* <SignIn
          authenticate={this.authenticate}
          user={this.user}
        /> */}
      </div>
    )
  }
}

export default withAuthenticator(hot(App), { signUpConfig });
