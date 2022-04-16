import React, { ChangeEvent, FC, Fragment, useEffect } from 'react';

import Checkbox from '@mui/material/Checkbox';
import MaUTable from '@mui/material/Table';
import PropTypes from 'prop-types';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableFooter from '@mui/material/TableFooter';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import TableToolbar from 'table/TableToolbar';
import TablePaginationActions from 'table/TablePaginationActions';
import { makeStyles } from 'tss-react/mui';

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

const inputStyle = {
  padding: 0,
  margin: 0,
  border: 0,
  background: 'transparent',
};

interface EditableCellProps {
  value: any;
  row: any;
  column: any;
  updateMyData: any;
}

const EditableCell = ({
  value: initialValue,
  row: { index },
  column: { id },
  updateMyData, // This is a custom function that we supplied to our table instance
}: EditableCellProps) => {
  const [value, setValue] = React.useState(initialValue);

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const onBlur = () => {
    updateMyData(index, id, value);
  };

  React.useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  return (
    <input
      style={inputStyle}
      value={value || ''}
      onChange={onChange}
      onBlur={onBlur}
    />
  );
};

EditableCell.propTypes = {
  cell: PropTypes.shape({
    value: PropTypes.any, //.isRequired,
  }),
  row: PropTypes.shape({
    index: PropTypes.number.isRequired,
  }),
  column: PropTypes.shape({
    id: PropTypes.string.isRequired,
  }),
  updateMyData: PropTypes.func.isRequired,
};

// Set our editable cell renderer as the default Cell renderer
const defaultColumn = {
  Cell: EditableCell,
};

interface Props {
  columns: any[]; // todo type
  data: any[]; //todo type
  actions: any[]; // todo type
  skipPageReset?: boolean;
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
                <IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} sx={{ padding: 0 }} />
              </div>
            ),
            Cell: ({ row }: any) => (
              <div>
                <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} sx={{ padding: 0 }} />
              </div>
            ),
          },
          ...columns,
        ];
      });
    }
  );

  const { renderFilter, removeAllFilters } = useFilter({filterConfig: filters, headerGroups });
  useEffect(() => {
    //removeAllFilters();
  }, [data, removeAllFilters]);

  const handlePageChange = (e: any, newPage: number) => {
    gotoPage(newPage);
  };

  const onRowsPerPageChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPageSize(Number(e.target.value));
  };

  const useStyles = makeStyles()({
    tableFilter: {
      borderBottom: '1px solid lightgray',
      lineHeight: '43px !important',
    },
  });
  const { classes } = useStyles();

  // Render the UI for your table
  return (
    <>
      {renderFilter()}
      <TableContainer>
        <TableToolbar
          numSelected={Object.keys(selectedRowIds).length}
          preGlobalFilteredRows={preGlobalFilteredRows}
          setGlobalFilter={setGlobalFilter}
          globalFilter={globalFilter}
        />
        <MaUTable {...getTableProps()}>
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
                      sx={{ padding: '10px' }}
                    >
                      {column.render('Header')}
                      {column.id !== 'selection' ? (
                        <TableSortLabel
                          active={column.isSorted}
                          // react-table has a unsorted state which is not treated here
                          direction={column.isSortedDesc ? 'desc' : 'asc'}
                        />
                      ) : null}
                    </TableCell>
                  ))}
                  <TableCell sx={{ padding: '10px' }}>Actions</TableCell>
                </TableRow>

                {filterPosition === 'table' && (
                  <TableRow
                    {...headerGroup.getHeaderGroupProps()}
                    className={classes.tableFilter}
                    key={'filter_' + index}
                  >
                    {headerGroup.headers.map((column) => {
                      console.log(column);
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
                <TableRow
                  {...row.getRowProps()}
                  key={index}
                >
                  {row.cells.map((cell, index) => {
                    return (
                      <TableCell {...cell.getCellProps()} key={index} sx={{ padding: '10px' }}>
                        {cell.render('Cell')}
                      </TableCell>
                    );
                  })}
                  <TableCell
                    key={'action' + index}
                    sx={{ whiteSpace: 'nowrap', padding: '10px' }}
                  >
                    {actions.map((action: any, index) => (
                      <Box pr={1} key={index} sx={{ display: 'inline' }}>
                        <Button
                          key="cancel"
                          onClick={(e) => action.action(row, e)}
                          variant="contained"
                          size="small"
                          color={action.color || 'secondary'}
                        >
                          {action.label}
                        </Button>
                      </Box>
                    ))}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>

          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[
                  5,
                  10,
                  25,
                  { label: 'All', value: data.length },
                ]}
                colSpan={3}
                count={data.length}
                rowsPerPage={pageSize}
                page={pageIndex}
                SelectProps={{
                  inputProps: { 'aria-label': 'rows per page' },
                  native: true,
                }}
                onPageChange={handlePageChange}
                onRowsPerPageChange={onRowsPerPageChange}
                ActionsComponent={TablePaginationActions}
              />
            </TableRow>
          </TableFooter>
        </MaUTable>
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
