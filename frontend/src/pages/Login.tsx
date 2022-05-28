import { useAuth } from 'context/auth.context';
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import useFetch from 'use-http';
import jwt from 'jwt-decode';
import AuthService from 'services/auth.service';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const auth = useAuth();
  const { error, post } = useFetch('http://localhost:8000/api');

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    //const username = formData.get('username') as string;

    const data = {
      username: 'test',
      password: 'test',
    };

    const result = await post('/token/', data);
    console.log(result);
    if (error) {
      console.log(error);
      return;
    }
    const user = jwt(result.access);
    auth.setUser({user});
    AuthService.setAccessToken(result.access);
    AuthService.setRefreshToken(result.refresh);
    navigate(from, { replace: true });
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          Username: <input name="username" type="text" />
        </label>{' '}
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export { Login };
