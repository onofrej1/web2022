import { Typography } from '@mui/material';
import DataProviderContext from './admin/DataProviderContext';
import { useContext } from 'react';

export default function ProTip() {
  const dc = useContext(DataProviderContext);

  return (
    <Typography sx={{ mt: 6, mb: 3 }} color="text.secondary">
      my component
    </Typography>
  );
}
