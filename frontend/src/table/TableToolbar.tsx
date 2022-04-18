import React from 'react';

import PropTypes from 'prop-types';
import { Box } from '@mui/material';

// todo type
const TableToolbar = (props: any) => {
  const { toolbar } = props;
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
      <Box>{toolbar.left}</Box>
      <Box>{toolbar.right}</Box>
    </Box>
  );
};

TableToolbar.propTypes = {
  toolbar: PropTypes.object.isRequired,
};

export default TableToolbar;
