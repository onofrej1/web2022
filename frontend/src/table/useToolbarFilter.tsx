import React, { useState } from 'react';
import { Box, Button, IconButton, Menu, MenuItem } from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { DataFilter } from 'resources/resources.types';
import { Column, HeaderGroup } from 'react-table';

interface useToolbarFilterProps {
  headerGroups: HeaderGroup<object>[],
  dataFilters: DataFilter[],
  gotoPage: (page: number) => void,
  disabled: boolean,
}

const useToolbarFilter = (props: useToolbarFilterProps) => {
  const { dataFilters, headerGroups, gotoPage, disabled = false } = props;
  const [filters, setFilters] = useState<DataFilter[]>([]);

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const addFilter = (filter: DataFilter) => {
    setAnchorEl(null);
    filters.push(filter);
    setFilters(filters);
  };

  const removeFilter = (column: Column) => {
    const newFilters = filters.filter((filter) => filter.name !== column.id);
    // @ts-ignore
    column.setFilter(undefined);
    setFilters(newFilters);
  };

  const removeFilters = () => {
    setFilters([]);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const menuItems = dataFilters.filter((f) => !filters.includes(f));

  const renderFilterMenu = () => (
    <Box>
      <Button
        disabled={disabled || !menuItems.length}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      >
        <FilterListIcon /> Add Filter
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        {menuItems.map((filter) => {
          return (
            <MenuItem key={filter.name} onClick={() => addFilter(filter)}>
              {filter.name}
            </MenuItem>
          );
        })}
      </Menu>
    </Box>
  );

  const filtersWrapperStyles = { display: 'flex', gap: '5px', mt: 1, ml: 1, justifyContent: 'flex-end' };

  const renderFilterItems = () => (
    <Box>
      {filters.length > 0 &&
        headerGroups.map((headerGroup, index: number) => (
          <Box sx={filtersWrapperStyles} key={index}>
            {headerGroup.headers.map((column) => {
              if (!column.canFilter || !filters.map((f) => f.name).includes(column.id)) return null;

              const filter = dataFilters.find((f) => f.name === column.id);
              const label = filter?.label || column.Header;
              const origSetFilter = column.setFilter;
              column.setFilter = (props: any) => {
                origSetFilter(props);
                gotoPage(0);
              };
              const FilterComponent = column.render('Filter', { label, position: 'toolbar' });

              return (
                <Box key={column.id}>
                  <Box>{label}</Box>
                  {FilterComponent}
                  <IconButton sx={{ p: 1 }} onClick={() => removeFilter(column)}>
                    <HighlightOffIcon />
                  </IconButton>
                </Box>
              );
            })}
          </Box>
        ))}
    </Box>
  );

  return { renderFilterMenu, renderFilterItems, removeFilters, hasFilters: filters.length };
};

export { useToolbarFilter };
