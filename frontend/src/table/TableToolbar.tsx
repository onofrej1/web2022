import React from 'react';

import PropTypes from 'prop-types';
import { Grid, Toolbar } from '@mui/material';

// todo type
const TableToolbar = (props: any) => {
  const { slots } = props;
  return (
    <Toolbar>
      <Grid container spacing={2}>
        <Grid item xs={8}>
          { slots.left }
        </Grid>
        <Grid item xs={4}>
          { slots.right }
        </Grid>
      </Grid>
    </Toolbar>
  );
};

TableToolbar.propTypes = {
  slots: PropTypes.object.isRequired,
};

export default TableToolbar;
