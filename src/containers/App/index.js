import { hot } from 'react-hot-loader/root';
import React, { Component } from 'react';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
  useHistory,
  useLocation
} from 'react-router-dom';

import routes from '../../routes';

// import Amplify from 'aws-amplify';
// import awsconfig from '../../aws-exports';
// import { withAuthenticator } from 'aws-amplify-react';

// Amplify.configure(awsconfig);

// AWS API
import Amplify from 'aws-amplify';
import config from '../../config';

Amplify.configure({
  Auth: {
    mandatorySignIn: true,
    region: config.cognito.REGION,
    userPoolId: config.cognito.USER_POOL_ID,
    identityPoolId: config.cognito.IDENTITY_POOL_ID,
    userPoolWebClientId: config.cognito.APP_CLIENT_ID
  },
  Storage: {
    region: config.s3.REGION,
    bucket: config.s3.BUCKET,
    identityPoolId: config.cognito.IDENTITY_POOL_ID
  },
  API: {
    endpoints: [{
      name: "recipes",
      endpoint: config.apiGateway.URL,
      region: config.apiGateway.REGION
    }, ]
  }
});

import SignIn from '../SignIn';
import Recipes from '../../containers/Recipes';
import Test from '../../containers/Test';

import './index.scss';

// const signUpConfig = {
//   header: 'Sign Up',
//   hideAllDefaults: true,
//   defaultCountryCode: '1',
//   signUpFields: [
//     {
//       label: 'Username',
//       key: 'email',
//       required: true,
//       displayOrder: 1,
//       type: 'string'
//     },
//     {
//       label: 'Password',
//       key: 'password',
//       required: true,
//       displayOrder: 2,
//       type: 'password'
//     },
//   ]
// };

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
    sessionStorage.setItem('isAuthenticated', isAuthenticated);
  }

  user = (user) => {
    const { isAuthenticated } = this.state;
    isAuthenticated ? this.setState({ currentUser: user }) : null;
  }

  render() {
    const { isAuthenticated, currentUser } = this.state;
    // const userEmail = Object.keys(currentUser).length > 0 ? currentUser.signInUserSession.idToken.payload.email : null;
    const checkAuthenticated = !!sessionStorage.getItem('isAuthenticated');
    // const checkAuth = this.checkAuth();

    console.log('App isAuthenticated: ', isAuthenticated);

    return (
      <Router>
        <div id="app">
        {
          checkAuthenticated ?
          (
            <Recipes
              isAuthenticated={checkAuthenticated}
            />
          )
          :
            <SignIn
              authenticate={this.authenticate}
              user={this.user}
            />
        }
        {/* {
          routes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              component={route.component}
            />
          ))
        } */}
        </div>
      </Router>
    )
  }
}

export default hot(App);
