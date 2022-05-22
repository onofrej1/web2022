import { Box } from '@mui/system';
import AppBar from './AppBar';
import Menu from './Menu';
import { Outlet } from 'react-router-dom';
import React from 'react';
import { CssBaseline, Toolbar } from '@mui/material';

const Layout = () => {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBar toggleDrawer={() => setOpen((open) => !open)} />
        <Menu open={open} />
        <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === 'light'
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            flexGrow: 1,
            height: '100vh',
            overflow: 'auto',
          }}
        >
          <Toolbar />
          <Outlet />
        </Box>
      </Box>
    </>
  );
};

export { Layout };
