import React from 'react';
import { Box, IconButton } from '@mui/material';
import LastPageIcon from '@mui/icons-material/LastPage';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import { KeyboardArrowLeft, KeyboardArrowRight } from '@mui/icons-material';

const Pagination = (props: any) => {
  const { gotoPage, previousPage, canPreviousPage, nextPage, canNextPage, setPageSize, pageIndex, totalPages, pageSize, pageCount } = props;

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
        <FirstPageIcon />
      </IconButton>
      <IconButton onClick={previousPage} disabled={!canPreviousPage}>
        <KeyboardArrowLeft />
      </IconButton>
      <IconButton onClick={nextPage} disabled={!canNextPage}>
        {' '}
        <KeyboardArrowRight />
      </IconButton>
      <IconButton onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
        <LastPageIcon />
      </IconButton>
      Page: {pageIndex + 1} of {totalPages}
      <Box component="span" sx={{ px: 1 }}>
        Show:
      </Box>
      <select
        value={pageSize}
        onChange={(e) => {
          setPageSize(Number(e.target.value));
        }}
      >
        {[4, 8, 12, 40, 50].map((pageSize) => (
          <option key={pageSize} value={pageSize}>
            {pageSize}
          </option>
        ))}
      </select>
    </Box>
  );
};

export { Pagination };
