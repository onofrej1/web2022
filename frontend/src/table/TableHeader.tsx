import { Box, TableCell, TableRow, TableSortLabel } from '@mui/material';
import React, { FC, Fragment } from 'react';
import { HeaderGroup } from 'react-table';

interface TableHeaderProps {
  headerGroup: HeaderGroup,
  renderFilter: boolean,
  resetPage: () => void,
}

const TableHeader = (props: TableHeaderProps) => {
  const { headerGroup, renderFilter, resetPage } = props;
  const rowPadding = '8px';

  return (
    <Fragment>
      <TableRow {...headerGroup.getHeaderGroupProps()}>
        {headerGroup.headers.map((column) => (
          <TableCell
            {...(column.id === 'selection'
              ? column.getHeaderProps()
              : column.getHeaderProps(column.getSortByToggleProps()))}
            key={column.id}
            sx={{ padding: rowPadding }}
          >
            {column.render('Header')}
            {column.id !== 'selection' ? (
              <TableSortLabel active={column.isSorted} direction={column.isSortedDesc ? 'desc' : 'asc'} />
            ) : null}
          </TableCell>
        ))}
        <TableCell sx={{ padding: rowPadding }}>Actions</TableCell>
      </TableRow>

      {renderFilter && (
        <TableRow {...headerGroup.getHeaderGroupProps()}>
          {headerGroup.headers.map((column) => {
            const origSetFilter = column.setFilter;
            column.setFilter = (props: any) => {
              origSetFilter(props);
              resetPage();
            };
            return (
              <th {...column.getHeaderProps()} key={'filter' + column.id} align="left">
                <Box mt={1}>
                  <div>{column.canFilter ? column.render('Filter') : null}</div>
                </Box>
              </th>
            );
          })}
        </TableRow>
      )}
    </Fragment>
  );
};

export { TableHeader };
