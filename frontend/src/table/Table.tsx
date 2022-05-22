import React, { FC, Fragment, useCallback, useEffect, useState } from 'react';

import {
  Table as MuiTable,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableRow,
  TableContainer,
  Typography,
  ButtonProps,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import GetAppIcon from '@mui/icons-material/GetApp';
import {
  Column,
  useAsyncDebounce,
  useFilters,
  useGlobalFilter,
  usePagination,
  useRowSelect,
  useSortBy,
  useTable,
} from 'react-table';
import { Box, Button, CircularProgress } from '@mui/material';
import { useToolbarFilter } from './useToolbarFilter';
import useFetch from 'use-http';
import { DataFilter } from 'resources/resources.types';
import { GlobalFilter } from './filters';
import { BulkActions } from './BulkActions';
import { Pagination } from './Pagination';
import { RowSelection } from './Hooks';
import { TableHeader } from './TableHeader';

export interface TableAction {
  label: string;
  icon: React.ComponentType;
  color: ButtonProps['color'];
  action: (data: any) => void;
  type?: 'edit' | 'delete' | 'info';
}

export interface TableBulkAction {
  label: string;
  action: (data: any) => void;
  type?: 'edit' | 'delete' | 'info';
}

const filterTypeQuery: Record<string, string> = {
  text: '__like',
  select: '',
};
const toolbarWrapperStyles = { display: 'flex', flexDirection: 'column', alignItems: 'end' };

interface TableProps {
  fetchUrl?: string;
  columns: Column[];
  actions: TableAction[];
  bulkActions: TableBulkAction[];
  refreshToken: string | null;
  filterPosition?: 'table' | 'toolbar';
  filters: DataFilter[];
  handleAddItem: () => void;
}

const rowPadding = '8px';
const toolbarActionWrapperStyles = { display: 'flex', gap: 2, mr: 4 };
const tableCellStyles = { whiteSpace: 'nowrap', padding: 0, textAlign: 'center' };

const Table: FC<TableProps> = ({
  columns,
  fetchUrl,
  actions,
  refreshToken,
  bulkActions,
  filterPosition = 'toolbar',
  filters: resourceFilters = [],
  handleAddItem,
}) => {
  const [queryPageSize, setQueryPageSize] = useState(4);
  const [totalRows, setTotalRows] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [tableData, setTableData] = useState<any[]>([]);

  const { cache, error, get, loading } = useFetch(fetchUrl);

  const fetchData = useCallback(
    async (pageNo, recordsPerPage, search, filters, gotoPage) => {
      const filtersParam = filters.reduce((query: string, field: { id: string; value: string }) => {
        const resourceFilter = resourceFilters.find((f) => f.name === field.id);
        if (!resourceFilter) {
          throw 'Filter not found';
        }
        const queryOperator = filterTypeQuery[resourceFilter.type] as string;
        query += `&${field.id}${queryOperator}=${field.value}`;
        return query;
      }, '');
      const searchParam = search && search.length ? `&search=${search}` : '';
      const url = `?page=${pageNo + 1}&page_size=${recordsPerPage}${filtersParam}${searchParam}`;
      const data = await get(url);
      const pages = data.count && data.count > 0 ? Math.ceil(data.count / recordsPerPage) : 1;

      setTableData(data.results);
      setTotalRows(data.count);
      setTotalPages(pages);
      if (pageNo + 1 > pages) {
        gotoPage(pages - 1);
      }
    },
    [get, resourceFilters]
  );
  const {
    getTableProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    selectedFlatRows,
    setGlobalFilter,
    state: { pageIndex, pageSize, filters, globalFilter },
  } = useTable(
    {
      columns,
      data: tableData,
      initialState: {
        pageIndex: 0,
        pageSize: queryPageSize,
      },
      manualPagination: true,
      manualGlobalFilter: true,
      manualFilters: true,
      pageCount: totalPages,
      autoResetSortBy: false,
      autoResetExpanded: false,
      autoResetPage: false
    },
    useFilters,
    useGlobalFilter,
    useSortBy,
    usePagination,
    useRowSelect,
    (hooks) => RowSelection(hooks),
  );

  useEffect(() => {
    cache.clear();
  }, [pageIndex, refreshToken, pageSize, filters, cache]);

  const onFetchDataDebounced = useAsyncDebounce(fetchData, 200);

  useEffect(() => {
    onFetchDataDebounced(pageIndex, pageSize, globalFilter, filters, gotoPage);
  }, [pageIndex, refreshToken, pageSize, globalFilter, filters, onFetchDataDebounced, gotoPage]);

  useEffect(() => {
    setQueryPageSize(pageSize);
  }, [pageSize, gotoPage]);

  const { renderFilterMenu, renderFilterItems, hasFilters } = useToolbarFilter({
    dataFilters: resourceFilters,
    headerGroups,
    gotoPage,
    disabled: !!globalFilter,
  });

  const toolbarStyles = {
    display: 'flex',
    justifyContent: 'space-between', mb: 1
  };

  const TableActions = (
    <Box sx={toolbarWrapperStyles}>
      <Box sx={toolbarActionWrapperStyles}>
        {filterPosition === 'toolbar' ? renderFilterMenu() : null}
        <Box sx={{ display: 'flex', padding: 0.8 }}>
          <GetAppIcon color="primary" />
          <Typography component="span" color="primary">
            EXPORT
          </Typography>
        </Box>
      </Box>
      <Box>{!globalFilter && renderFilterItems()}</Box>
    </Box>
  );

  const bulkActionOptions = bulkActions.map((a) => a.label);
  bulkActionOptions.unshift('Select action');

  const AddNewItem = (
    <Box ml={2} mb={2}>
      <Button size="small" variant="contained" onClick={handleAddItem} color="primary">
        <AddIcon /> Add item
      </Button>
    </Box>
  );

  const BulkActionsToolbar = (
    <Box ml={2}>
      <BulkActions
        options={bulkActionOptions}
        onChange={async (value: string) => {
          const bulkAction = bulkActions.find((a) => a.label === value);
          bulkAction?.action(selectedFlatRows);
        }}
      />
      <Typography color="inherit" variant="subtitle1">
        {selectedFlatRows.length} items selected
      </Typography>
    </Box>
  );

  if (error) return <>{error}</>;

  return (
    <Box>
      {loading && (
        <CircularProgress size={40} sx={{ position: 'absolute', left: 'calc(50% - 35px)', top: 'calc(50% + 1px)' }} />
      )}
      <TableContainer>
        {/* portal element replacing "id='table-search'" element in page layout */}
        {filters.length === 0 && !hasFilters && (
          <GlobalFilter globalFilter={globalFilter} setGlobalFilter={setGlobalFilter} totalRows={totalRows} />
        )}
        <Box sx={toolbarStyles}>
          {selectedFlatRows.length === 0 ? AddNewItem : BulkActionsToolbar}
          {TableActions}
        </Box>
        <MuiTable {...getTableProps()}>
          <TableHead>
            {headerGroups.map((headerGroup, index) => (
              <TableHeader
                headerGroup={headerGroup}
                key={index}
                renderFilter={filterPosition === 'table' && !globalFilter}
                resetPage={() => gotoPage(0)}
              />
            ))}
          </TableHead>
          <TableBody>
            {page.map((row, index) => {
              prepareRow(row);
              return (
                <TableRow {...row.getRowProps()} key={index}>
                  {row.cells.map((cell, index) => {
                    return (
                      <TableCell {...cell.getCellProps()} key={index} sx={{ padding: rowPadding }}>
                        {cell.render('Cell')}
                      </TableCell>
                    );
                  })}
                  <TableCell key={'action_' + index} sx={{ whiteSpace: 'nowrap', padding: rowPadding }}>
                    {actions.map((action) => {
                      const Icon = action.icon as any;
                      return (
                        <Box pr={1} key={action.label} sx={{ display: 'inline' }}>
                          <Button
                            onClick={async () => {
                              action.action(row);
                            }}
                            variant="contained"
                            size="small"
                            color={action.color || 'secondary'}
                          >
                            <Icon sx={{ fontSize: '15px', mr: 0.5 }} /> {action.label}
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
              <TableCell sx={tableCellStyles} colSpan={columns.length + 2}>
                <Pagination
                  gotoPage={gotoPage}
                  nextPage={nextPage}
                  previousPage={previousPage}
                  canNextPage={canNextPage}
                  canPreviousPage={canPreviousPage}
                  pageSize={pageSize}
                  totalPages={pageOptions.length}
                  pageCount={pageCount}
                  pageIndex={pageIndex}
                  pageInfo={pageOptions}
                  setPageSize={setPageSize}
                />
              </TableCell>
            </TableRow>
          </TableFooter>
        </MuiTable>
      </TableContainer>
    </Box>
  );
};

export default Table;
