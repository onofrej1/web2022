import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/styles';
import * as ReactDOMClient from 'react-dom/client';
import App from './App';
//import theme from './theme';
import './main.scss';

const theme = {
  palette: {
    light: 'blue',
    primary: 'blue',
  },
};

const container = document.getElementById('root');

const root = ReactDOMClient.createRoot(container as Element);

// Initial render
root.render(
  <ThemeProvider theme={theme}>
    {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
    <CssBaseline />
    <App />
  </ThemeProvider>
);
