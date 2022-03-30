import * as React from 'react';
import { useCallback } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import ProTip from './ProTip';
import Button from '@mui/material/Button';
import Admin from './admin/Admin';

export default function App() {

  const CustomElement = () => {
    return (
      <div>Custom route</div>
    );
  };

  const routes = [
    { path: "custom", element: <CustomElement /> }
  ];

  return (
    <>
      <Admin routes={routes}>
      </Admin>
    </>
  );
}
