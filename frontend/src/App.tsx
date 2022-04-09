import Admin from './admin/Admin';
import React from 'react';
import CssBaseline from '@mui/material/CssBaseline';

export default function App() {
  const CustomElement = () => {
    return <div>Custom route</div>;
  };

  const routes = [{ path: 'custom', element: <CustomElement /> }];

  return (
    <>
      <CssBaseline />
      <Admin routes={routes}></Admin>
    </>
  );
}
