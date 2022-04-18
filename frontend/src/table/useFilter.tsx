import React, { Fragment, useState } from 'react';
import { Box, Button, Grid, IconButton, Menu, MenuItem } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import FilterListIcon from '@mui/icons-material/FilterList';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';

const useFilter = (props: any) => {
  const { filterConfig, headerGroups } = props;
  const [filters, setFilters] = useState([] as any[]);

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const addFilter = (filter: any) => {
    setAnchorEl(null);
    filters.push(filter);
    setFilters(filters);
  };

  const removeFilter = (filterName: string) => {
    const newFilters = filters.filter(
      (filter: any) => filter.name !== filterName
    );
    setFilters(newFilters);
  };

  const removeAllFilters = () => {
    setFilters([]);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const menuItems = filterConfig.filter((filter: any) => !filters.includes(filter));

  const renderFilter = () => (
    <Box sx={{ display: 'flex'}}>
      {filters.length > 0 &&
        headerGroups.map((headerGroup: any, index: number) => (
          <Box sx={{ display: 'flex', gap: '5px', justifyContent: 'flex-end' }}  key={index}>
            {headerGroup.headers.map((column: any) => {
              if (!column.canFilter || !filters.map(f => f.name).includes(column.id)) return null;
              const FilterComponent = column.render('Filter');
              return (
                <Box key={column.id}>
                  {FilterComponent}
                  <IconButton sx={{ p: 1 }} onClick={() => removeFilter(column.id)}>
                    <HighlightOffIcon />
                  </IconButton>
                </Box>
              );
            })}
          </Box>
        ))}

      <Box>
        <Button
          disabled={!menuItems.length}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          onClick={handleClick}
        >
          <FilterListIcon /> Add Filter
        </Button>
        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            'aria-labelledby': 'basic-button',
          }}
        >
          {menuItems.map((filter: any) => {
            return (
              <MenuItem key={filter.name} onClick={() => addFilter(filter)}>
                {filter.name}
              </MenuItem>
            );
          })}
        </Menu>
      </Box>
      
    </Box>
  );

  return { renderFilter, removeAllFilters } as any;
};

export { useFilter };
