import React, { useState } from 'react';

import { Box, InputAdornment } from '@mui/material';
import PropTypes from 'prop-types';
import SearchIcon from '@mui/icons-material/Search';
import { Text } from 'form/Text';
import ReactDOM from 'react-dom';

const GlobalFilter = ({
  preGlobalFilteredRows,
  globalFilter,
  setGlobalFilter,
}: any) => {
  const count = preGlobalFilteredRows.length;
  const [element, setElement] = useState();

  // Global filter only works with pagination from the first page.
  // This may not be a problem for server side pagination when
  // only the current page is downloaded.

  const Filter = (
    <Box>
      <Text
        variant="filled"
        value={globalFilter || ''}
        onChange={(value: string) => {
          setGlobalFilter(value || undefined);
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          )
        }}
        placeholder={`${count} records...`}
      />
    </Box>
  );

  React.useEffect(() => {
    setElement(document.getElementById('table-search') as any);
  }, []);

  if(!element) return null;

  return ReactDOM.createPortal(Filter, element);
};

GlobalFilter.propTypes = {
  preGlobalFilteredRows: PropTypes.array.isRequired,
  globalFilter: PropTypes.string,
  setGlobalFilter: PropTypes.func.isRequired,
};

export default GlobalFilter;
