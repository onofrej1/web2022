import Link from '@mui/material/Link';
import SvgIcon, { SvgIconProps } from '@mui/material/SvgIcon';
import Typography from '@mui/material/Typography';
import AdminContext from './admin/AdminContext';
import DataProviderContext from './admin/DataProviderContext';
import { useContext } from 'react';

export default function ProTip() {

  const dc = useContext(DataProviderContext);
  console.log(dc);

  return (
    <Typography sx={{ mt: 6, mb: 3 }} color="text.secondary">
      my component
    </Typography>
  );
}
