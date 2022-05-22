import React, { useCallback } from 'react';
import { GoogleLogin } from 'react-google-login';
import useFetch from 'use-http';



const Login2 = () => {
  const { cache, error, post, loading } = useFetch('http://localhost:8000');

  const handleUserInit = (data: any) => {
    console.log('init');
    console.log(data);
  };

  const onGoogleLoginSuccess = useCallback(
    response => {
      const idToken = response.tokenId;
      console.log(response);
      const data = {
        email: response.profileObj.email,
        first_name: response.profileObj.givenName,
        last_name: response.profileObj.familyName
      };
  
      validateTokenAndObtainSession({ data, idToken })
        .then(handleUserInit);
    },
    [handleUserInit]
  );

  const onGoogleLoginFailure = (error: any) => {
    console.log(error);
  };
  
  const validateTokenAndObtainSession = ({ data, idToken }: any) => {
    const headers = {
      Authorization: idToken,
      'Content-Type': 'application/json'
    };
  
    return post('users/init/', data);
  };

  return (
    <GoogleLogin
      clientId={'517026192063-vpe49fob5mmmt4uj4bo4ql1ag2ved4sq.apps.googleusercontent.com'}  // your Google app client ID
      buttonText="Sign in with Google"
      onSuccess={onGoogleLoginSuccess} // perform your user logic here
      onFailure={onGoogleLoginFailure} // handle errors here
    />
  );
};

const Login = () => {
  return (
    <div>
      login
    </div>
  );
};

export { Login };