import React, { ChangeEvent, FC, Fragment, useCallback, useEffect, useRef, useState } from 'react';

import {
  Checkbox,
  Table as MuiTable,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableRow,
  TableSortLabel,
  TableContainer,
  Typography,
  IconButton,
} from '@mui/material';

import PropTypes from 'prop-types';
import TableToolbar from 'table/TableToolbar';
import GlobalFilter from 'table/GlobalFilter';
import GetAppIcon from '@mui/icons-material/GetApp';
import LastPageIcon from '@mui/icons-material/LastPage';
import FirstPageIcon from '@mui/icons-material/FirstPage';

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
import useFetch from 'use-http';
import { KeyboardArrowLeft, KeyboardArrowRight } from '@mui/icons-material';

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
  data?: any; //todo type
  actions: any[]; // todo type
  fetchUrl?: string;
  skipPageReset?: boolean;
  toolbar: any;
  filterPosition?: 'table' | 'toolbar';
  filters: string[];
  //page: number;
  //setPage: any;
  //pagination: any;
}

const queryString = (params: any) => Object.keys(params).map(key => key + '=' + params[key]).join('&');

const Table: FC<Props> = ({
  columns,
  fetchUrl,
  actions,
  skipPageReset,
  filterPosition = 'table',
  filters: filtersConfig = [],
  toolbar,
}) => {
  //const PAGE_NO = 0;
  const [queryPage, setQueryPage] = useState(0);
  const [queryPageSize, setQueryPageSize] = useState(4);
  const [totalPages, setTotalPages] = useState<number | undefined>(1);
  const [tableData, setTableData] = useState([]);

  //const [filtersChanged, setFiltersChanged] = useState(false);
  const resetPage = useRef(false);

  //const url = `${fetchUrl}?page=${queryPage + 1}&page_size=${queryPageSize}`;
  //const { data = [], cache, loading, error } = useFetch(url, [url]);

  const { cache, loading, error, get } = useFetch(fetchUrl);

  const fetchData = useCallback(
    async (pageNo, recordsPerPage, search = '', filters) => {
      const filtersParam = filters.reduce((query: string, f: { id: string, value: string}) => {
        //queryString(filters)
        query += `&${f.id}=${f.value}`;
        return query;
      }, '');
      const doReset = resetPage.current === true;
      if (doReset) {
        pageNo = 1;
      }
      const url = `?page=${pageNo}&page_size=${recordsPerPage}&search=${search}${filtersParam}`;
      //await new Promise(r => setTimeout(r, 3000));
      const data = await get(url);
      const pages = data.count && data.count > 0
        ? Math.ceil(data.count / recordsPerPage)
        : undefined;

      
      setTableData(data.results);
      setTotalPages(pages);
      if (doReset) {
        console.log('go to page 1');
        setQueryPage(0);
        //setPage(0);
        //gotoPage(0);
      }
      
      resetPage.current = false;

      //setFiltersChanged(false);
    }, []);

  const {
    getTableProps,
    headerGroups,
    prepareRow,
    page: pageData,
    //page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    preGlobalFilteredRows,
    setGlobalFilter,
    state: { pageIndex, pageSize, filters, /*selectedRowIds,*/ globalFilter },
  } = useTable(
    {
      columns,
      data: tableData,
      initialState: {
        pageIndex: queryPage,
        pageSize: queryPageSize,
      },
      manualPagination: true,
      manualGlobalFilter: true,
      manualFilters: true,
      pageCount: totalPages,
      autoResetPage: !skipPageReset,
      // anything we put into these options will automatically be available on the instance. That way we can call this function from our cell renderer!
      //updateMyData,
      //defaultColumn,
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

  useEffect(() => {
    cache.clear();
  //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageIndex, pageSize, filters]);

  // todo better check
  //const filtersHasChanged = pageIndex === queryPage && pageSize === queryPageSize;
  //const filtersHasChanged = false;
  console.log(pageIndex);
  useEffect(() => {
    fetchData(pageIndex + 1, pageSize, globalFilter, filters);
  }, [pageIndex, pageSize, globalFilter, fetchData, filters]);

  useEffect(() => {
    if (pageIndex !== queryPage) {
      setQueryPage(pageIndex);
    }
  }, [pageIndex, queryPage]);

  useEffect(() => {
    setQueryPageSize(pageSize);
    //gotoPage(0);
  }, [pageSize, gotoPage]);

  //useEffect(() => {
  //  gotoPage(0);
  //}, [gotoPage, filters]);

  useEffect(() => {
    return () => {
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const rowPadding = '8px';
  const { renderFilter, removeAllFilters } = useFilter({
    filterConfig: filtersConfig,
    headerGroups,
  });
  //useEffect(() => {
    //removeAllFilters();
  //}, [data, removeAllFilters]);

  const toolbarTopRight = () => (
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

  //if (loading) return <div>loading...</div>;
  if (error) return <div>{error}</div>;

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
            left: toolbar ? toolbar.topLeft() : '',
            right: toolbarTopRight(),
          }}
        />
        <MuiTable
          {...getTableProps()}
          //defaultFilterMethod={(filter, row) =>
          //  String(row[filter.id]) === filter.value}
        >
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
                      const f = column;
                      const orig = f.setFilter;
                      f.setFilter = (props) => {
                        resetPage.current = true;
                        orig(props);
                      };
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
            {pageData.map((row, index) => {
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
                            {Icon ? (
                              <Icon sx={{ fontSize: '15px', mr: 0.5 }} />
                            ) : null}{' '}
                            {action.label}
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
            <TableRow>
              <TableCell
                sx={{ whiteSpace: 'nowrap', padding: 0, textAlign: 'center' }}
                colSpan={columns.length + 2}
              >
                <Box sx={{ flexShrink: 0, ml: 2.5 }}>
                  <IconButton
                    onClick={() => gotoPage(0)}
                    disabled={!canPreviousPage}
                  >
                    <FirstPageIcon />
                  </IconButton>
                  <IconButton
                    onClick={previousPage}
                    disabled={!canPreviousPage}
                  >
                    <KeyboardArrowLeft />
                  </IconButton>
                  <IconButton onClick={nextPage} disabled={!canNextPage}>
                    {' '}
                    <KeyboardArrowRight />
                  </IconButton>
                  <IconButton
                    onClick={() => gotoPage(pageCount - 1)}
                    disabled={!canNextPage}
                  >
                    <LastPageIcon />
                  </IconButton>
                  Page: {pageIndex + 1}
                  Show{' '}
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
              </TableCell>
            </TableRow>
          </TableFooter>
        </MuiTable>
      </TableContainer>
    </>
  );
};

Table.propTypes = {
  columns: PropTypes.array.isRequired,
  //data: PropTypes.array.isRequired,
  actions: PropTypes.array.isRequired,
  skipPageReset: PropTypes.bool,
};

export default Table;
