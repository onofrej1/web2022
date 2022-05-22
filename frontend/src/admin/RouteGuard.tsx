import React from 'react';
import { Route } from 'react-router-dom';
import { Login } from './Login';

const RouteGuard = ({ component: Component, ...rest }: any) => {
  function hasJWT() {
    let flag = false;

    //check user has JWT token
    localStorage.getItem('token') ? (flag = true) : (flag = false);

    return flag;
  }

  return (
    <Route
      {...rest}
      render={(props: any) =>
        hasJWT() ? (
          <Component {...props} />
        ) : (
          <Login />
        )
      }
    />
  );
};

export { RouteGuard };
