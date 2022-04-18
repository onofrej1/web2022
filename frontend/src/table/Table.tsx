import React, { ChangeEvent, FC, Fragment, useEffect } from 'react';

import {
  Checkbox,
  Table as MuiTable,
  TableBody,
  TableCell,
  TableFooter,
  TablePagination,
  TableHead,
  TableRow,
  TableSortLabel,
  TableContainer,
  Typography,
} from '@mui/material';

import PropTypes from 'prop-types';
import TableToolbar from 'table/TableToolbar';
import TablePaginationActions from 'table/TablePaginationActions';
import GlobalFilter from 'table/GlobalFilter';
import GetAppIcon from '@mui/icons-material/GetApp';

import {
  useFilters,
  useGlobalFilter,
  usePagination,
  useRowSelect,
  useSortBy,
  useTable,
} from 'react-table';
import { Box, Button } from '@mui/material';
import { useFilter } from './useFilter';

const IndeterminateCheckbox = React.forwardRef<HTMLInputElement, Props>(
  (props: any, ref) => {
    // eslint-disable-next-line react/prop-types
    const { indeterminate, ...rest } = props;
    const defaultRef = React.useRef();
    const resolvedRef = ref || defaultRef;

    React.useEffect(() => {
      if (typeof resolvedRef === 'object' && resolvedRef.current) {
        resolvedRef.current.indeterminate = indeterminate;
      }
    }, [resolvedRef, indeterminate]);

    return (
      <>
        <Checkbox ref={resolvedRef} {...rest} />
      </>
    );
  }
);
IndeterminateCheckbox.displayName = 'IndeterminateCheckboxDisplayName';

interface Props {
  columns: any[]; // todo type
  data: any[]; //todo type
  actions: any[]; // todo type
  skipPageReset?: boolean;
  toolbar: any;
  filterPosition?: 'table' | 'toolbar';
  filters: string[];
}

const Table: FC<Props> = ({
  columns,
  data,
  actions,
  skipPageReset,
  filterPosition = 'toolbar',
  filters = [],
  toolbar,
}) => {
  const {
    getTableProps,
    headerGroups,
    prepareRow,
    page,
    gotoPage,
    setPageSize,
    preGlobalFilteredRows,
    setGlobalFilter,
    state: { pageIndex, pageSize, selectedRowIds, globalFilter },
  } = useTable(
    {
      columns,
      data,
      //defaultColumn,
      autoResetPage: !skipPageReset,
      // anything we put into these options will automatically be available on the instance. That way we can call this function from our cell renderer!
      //updateMyData,
    },
    useFilters,
    useGlobalFilter,
    useSortBy,
    usePagination,
    useRowSelect,
    (hooks) => {
      hooks.allColumns.push((columns) => {
        // works only for server side data
        return [
          {
            id: 'selection',
            disableFilters: true,
            Filter: () => null,
            Header: ({ getToggleAllRowsSelectedProps }: any) => (
              <div>
                <IndeterminateCheckbox
                  {...getToggleAllRowsSelectedProps()}
                  sx={{ padding: 0 }}
                />
              </div>
            ),
            Cell: ({ row }: any) => (
              <div>
                <IndeterminateCheckbox
                  {...row.getToggleRowSelectedProps()}
                  sx={{ padding: 0 }}
                />
              </div>
            ),
          },
          ...columns,
        ];
      });
    }
  );

  const rowPadding = '8px';
  const { renderFilter, removeAllFilters } = useFilter({
    filterConfig: filters,
    headerGroups,
  });
  useEffect(() => {
    //removeAllFilters();
  }, [data, removeAllFilters]);

  const handlePageChange = (e: any, newPage: number) => {
    gotoPage(newPage);
  };

  const onRowsPerPageChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPageSize(Number(e.target.value));
  };

  const toolbarRight = () => (
    <Box sx={{ display: 'flex', gap: 2, mr: 2 }}>
      {renderFilter()}
      <Box sx={{ display: 'flex', padding: 0.8 }}>
        <GetAppIcon color="primary" />
        <Typography component="span" color="primary">
          EXPORT
        </Typography>
      </Box>
    </Box>
  );

  /*{numSelected > 0 ? (
    <Typography color="inherit" variant="subtitle1">
      {numSelected} selected
    </Typography>
  ) : <span></span>}*/

  return (
    <>
      <TableContainer>
        {/* portal element replacing "id='table-search'" element in page layout */}
        <GlobalFilter
          preGlobalFilteredRows={preGlobalFilteredRows}
          globalFilter={globalFilter}
          setGlobalFilter={setGlobalFilter}
        />
        <TableToolbar
          toolbar={{
            left: toolbar ? toolbar.left() : '',
            right: toolbarRight(),
          }}
        />
        <MuiTable {...getTableProps()}>
          <TableHead>
            {headerGroups.map((headerGroup, index) => (
              <Fragment key={index}>
                <TableRow
                  {...headerGroup.getHeaderGroupProps()}
                  key={'header_' + index}
                >
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
                        <TableSortLabel
                          active={column.isSorted}
                          direction={column.isSortedDesc ? 'desc' : 'asc'}
                        />
                      ) : null}
                    </TableCell>
                  ))}
                  <TableCell sx={{ padding: rowPadding }}>Actions</TableCell>
                </TableRow>

                {filterPosition === 'table' && (
                  <TableRow
                    {...headerGroup.getHeaderGroupProps()}
                    key={'filter_' + index}
                  >
                    {headerGroup.headers.map((column) => {
                      return (
                        <th
                          {...column.getHeaderProps()}
                          key={'filter' + column.id}
                          align="left"
                        >
                          <Box ml={2} mt={1}>
                            <div>
                              {column.canFilter
                                ? column.render('Filter')
                                : null}
                            </div>
                          </Box>
                        </th>
                      );
                    })}
                  </TableRow>
                )}
              </Fragment>
            ))}
          </TableHead>
          <TableBody>
            {page.map((row, index) => {
              prepareRow(row);
              return (
                <TableRow {...row.getRowProps()} key={index}>
                  {row.cells.map((cell, index) => {
                    return (
                      <TableCell
                        {...cell.getCellProps()}
                        key={index}
                        sx={{ padding: rowPadding }}
                      >
                        {cell.render('Cell')}
                      </TableCell>
                    );
                  })}
                  <TableCell
                    key={'action' + index}
                    sx={{ whiteSpace: 'nowrap', padding: rowPadding }}
                  >
                    {actions.map((action: any, index) => {
                      const Icon = action.icon;
                      return (
                        <Box pr={1} key={index} sx={{ display: 'inline' }}>
                          <Button
                            key="cancel"
                            onClick={(e) => action.action(row, e)}
                            variant="contained"
                            size="small"
                            color={action.color || 'secondary'}
                          >
                            {Icon ? <Icon sx={{ fontSize: '15px', mr: 0.5 }} />: null} {action.label}
                          </Button>
                        </Box>
                      );
                    })}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>

          <TableFooter>
            <TableRow sx={{ align: 'center' }}>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                colSpan={headerGroups[0].headers.length + 1}
                count={data.length}
                rowsPerPage={pageSize}
                page={pageIndex}
                SelectProps={{
                  native: true,
                }}
                onPageChange={handlePageChange}
                onRowsPerPageChange={onRowsPerPageChange}
                ActionsComponent={TablePaginationActions}
              />
            </TableRow>
          </TableFooter>
        </MuiTable>
      </TableContainer>
    </>
  );
};

Table.propTypes = {
  columns: PropTypes.array.isRequired,
  data: PropTypes.array.isRequired,
  actions: PropTypes.array.isRequired,
  skipPageReset: PropTypes.bool,
};

export default Table;
