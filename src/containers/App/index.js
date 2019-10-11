import React, { Component } from 'react';
import ReactDOM from 'react-dom';

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
// import Recipes from './containers/Recipes';

import './index.scss';

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
    // console.log('App isAuthenticated: ', isAuthenticated);

    // if (isAuthenticated){
    //   return (
    //     <Recipes />
    //   );
    // }

    return (
      <SignIn
        authenticate={this.authenticate}
        user={this.user}
      />
    )
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
