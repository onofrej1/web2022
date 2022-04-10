import React, { ChangeEvent, FC, Fragment } from 'react';

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
import { DefaultFilter } from 'table/filters';
import { Box, Button } from '@mui/material';

const IndeterminateCheckbox = React.forwardRef<HTMLInputElement, Props>(
  // eslint-disable-next-line react/prop-types
  ({ indeterminate, ...rest }: any, ref) => {
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
//IndeterminateCheckbox.propTypes = {
//  indeterminate: PropTypes.object,
//};

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

// Create an editable cell renderer
const EditableCell = ({
  value: initialValue,
  row: { index },
  column: { id },
  updateMyData, // This is a custom function that we supplied to our table instance
}: EditableCellProps) => {
  // We need to keep and update the state of the cell normally
  const [value, setValue] = React.useState(initialValue);

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  // We'll only update the external data when the input is blurred
  const onBlur = () => {
    updateMyData(index, id, value);
  };

  // If the initialValue is changed externall, sync it up with our state
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
  setData: any;
  updateMyData: any;
  skipPageReset: boolean;
}

const Table: FC<Props> = ({
  columns,
  data,
  actions,
  setData,
  updateMyData,
  skipPageReset,
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
      // anything we put into these options will automatically be available on the instance.
      // That way we can call this function from our cell renderer!
      updateMyData,
    },
    useFilters,
    useGlobalFilter,
    useSortBy,
    usePagination,
    useRowSelect,
    (hooks) => {
      hooks.allColumns.push((columns) => [
        // Let's make a column for selection
        {
          id: 'selection',
          // works only for server side data
          Header: ({ getToggleAllRowsSelectedProps }: any) => (
            <div>
              <IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} />
            </div>
          ),
          Cell: ({ row }: any) => (
            <div>
              <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
            </div>
          ),
        },
        ...columns,
      ]);
    }
  );

  const handlePageChange = (e: any, newPage: number) => {
    gotoPage(newPage);
  };

  const onRowsPerPageChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPageSize(Number(e.target.value));
  };

  const removeByIndexs = (array: any[], indexs: any[]) => {
    array.filter((_, i) => !indexs.includes(i));
  };

  const deleteUserHandler = () => {
    const newData = removeByIndexs(
      data,
      Object.keys(selectedRowIds).map((x) => parseInt(x, 10))
    );
    setData(newData);
  };

  const addUserHandler = (user: any) => {
    // @ts-ignore
    const newData = data.concat([user]);
    setData(newData);
  };

  const clone = (el: JSX.Element, row: any) =>
  {
    const elem = {...el};
    return React.cloneElement(el, {
      onClick: (e: React.MouseEvent<HTMLButtonElement> & { row: any }) => {
        e.row = row;
        // eslint-disable-next-line prefer-spread
        elem.props.onClick.apply(elem, [e]);
      },
    });
  };

  const useStyles = makeStyles()({
    tableFilter: {
      borderBottom: '1px solid lightgray',
      lineHeight: '43px !important',
    },
    tableRow: {
      height: '15px !important',
    },
    tableCell: {
      padding: '0px !important',
    },
  });
  const { classes } = useStyles();

  // Render the UI for your table
  return (
    <TableContainer>
      <TableToolbar
        numSelected={Object.keys(selectedRowIds).length}
        deleteUserHandler={deleteUserHandler}
        addUserHandler={addUserHandler}
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
              </TableRow>

              <TableRow
                {...headerGroup.getHeaderGroupProps()}
                className={classes.tableFilter}
                key={'filter_' + index}
              >
                {headerGroup.headers.map((column) => (
                  <th
                    {...column.getHeaderProps()}
                    key={'filter' + column.id}
                    align="left"
                  >
                    <Box ml={2} mt={1}>
                      {/* Render the columns filter UI */}
                      <div>
                        {column.canFilter ? column.render('Filter') : null}
                      </div>
                    </Box>
                  </th>
                ))}
              </TableRow>
            </Fragment>
          ))}
        </TableHead>
        <TableBody>
          {page.map((row, index) => {
            prepareRow(row);
            return (
              <TableRow
                {...row.getRowProps()}
                className={classes.tableRow}
                key={index}
              >
                {row.cells.map((cell, index) => {
                  return (
                    <TableCell {...cell.getCellProps()} key={index}>
                      {cell.render('Cell')}
                    </TableCell>
                  );
                })}
                <TableCell key={'action' + index}>
                  {actions.length ? (
                    actions.map((action: any, index) => (
                      <Fragment key={index}>{clone(action, row)}</Fragment>
                    ))
                  ) : (
                    <>
                      <Button>Edit default</Button>
                    </>
                  )}
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
  );
};

Table.propTypes = {
  columns: PropTypes.array.isRequired,
  data: PropTypes.array.isRequired,
  actions: PropTypes.array.isRequired,
  updateMyData: PropTypes.func.isRequired,
  setData: PropTypes.func.isRequired,
  skipPageReset: PropTypes.bool.isRequired,
};

export default Table;
