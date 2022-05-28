import React from 'react';
import { AuthProvider } from 'context/auth.context';
import { ThemeProvider } from '@mui/material/styles';
import theme from 'theme';
import { Provider } from 'use-http';
import { Routes } from 'router/Routes';
import { useRoutes } from 'react-router-dom';
import AuthService from 'services/auth.service';
import { CssBaseline } from '@mui/material';
import { getRequestOptions } from 'services/http.service';

const App = () => {
  const RenderRoutes = useRoutes(Routes);
  const options = getRequestOptions();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider userData={AuthService.getUser()}>
        <Provider options={options} url="http://localhost:8000/api">
          <h1>Auth Example</h1>
          {RenderRoutes}
        </Provider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
