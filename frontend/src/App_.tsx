import React from 'react';
import { AuthProvider } from 'context/auth.context';
import { ThemeProvider } from '@mui/material/styles';
import theme from 'theme';
import { CssBaseline } from '@mui/material';
import useFetch, { Provider } from 'use-http';
import { Routes } from 'Routes';
import { useRoutes } from 'react-router-dom';
import TokenService from 'services/token.service';

const App = () => {
  // we get the user from the localStorage because that's where we will save their account on the login process

  const RenderRoutes = useRoutes(Routes);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider userData={TokenService.getUser()}>
        <Provider url="http://localhost:8000/api">
          <h1>Auth Example</h1>
          {RenderRoutes}
        </Provider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
