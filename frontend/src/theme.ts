import { createTheme } from '@mui/material/styles';

// A custom theme for this app
const theme = createTheme({
  components: {
    MuiInputLabel: {
      styleOverrides: {
        shrink: {
          backgroundColor: 'white !important',
          padding: '0 3px',
        },
      },
    },
  },
});

export default theme;
