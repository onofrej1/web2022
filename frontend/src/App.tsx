//import Admin from './admin/Admin';
import React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import theme from 'theme';

export default function App() {
  const CustomElement = () => {
    return <div>Custom route</div>;
  };

  const routes = [{ path: 'custom', element: <CustomElement /> }];

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {/* <Admin routes={routes}></Admin>*/}
    </ThemeProvider>
  );
}
