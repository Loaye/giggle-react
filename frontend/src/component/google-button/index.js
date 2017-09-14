import * as querystring from 'querystring';
import React from 'react';



class GoogleButton extends React.Component {
  render() {
    let googleLoginBaseURL = 'https://accounts.google.com/o/oauth2/v2/auth';
    let googleLoginQuery = querystring.stringify({
      client_id: __GOOGLE_CLIENT_ID__,
      response_type: 'code',
      redirect_uri: `${__API_URL__}/oauth/google/code`,
      scope: 'openid profile email',
      prompt: __DEBUG__ ? 'consent' : undefined
    });

    let googleLoginURL = `${googleLoginBaseURL}?${googleLoginQuery}`;

    return (
      <div>
        <meta name="google-signin-client_id" content={__GOOGLE_CLIENT_ID__} />
        <a className="g-signin2" href={googleLoginURL}>_</a>
      </div>
    )
  }
}

export default GoogleButton;