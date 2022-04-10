
import React, { Fragment, useEffect, useState } from 'react';
import resources from 'resources/index';
import Table from 'table/Table';
//import makeData from './makeData';
import {
  Box,
  Button,
  Select,
  Menu,
  MenuItem,
  TextField,
  IconButton,
} from '@mui/material';
import settings from 'admin/settings';
import useFetch from 'use-http';
import ClearIcon from '@mui/icons-material/Clear';
import { DefaultFilter, NumberRangeFilter, SelectFilter, SliderFilter } from 'table/filters';

const configKeys: any = {
  header: 'Header',
  render: 'accessor',
};

const filters: any = {
  'text': DefaultFilter,
  'select': SelectFilter,
  'slider': SliderFilter,
  'range': NumberRangeFilter,
};

const mapConfig = (config: any) => {
  return Object.keys(config).reduce((obj: any, key: any) => {
    const newKey: string = configKeys[key] || key;
    obj[newKey] = config[key];
    return obj;
  }, {});
};

const getTableColumns = (resource: string) => {
  // @ts-ignore
  const config = resources[resource];
  const fields = config.list;
  if (!fields) {
    return 'Missing list configuration.';
  }
  const columns: any[] = [];
  fields.forEach((list: any) => {
    list = mapConfig(list);
    const { name, type } = list;
    let accessor: any = name;
    if (type === 'many2many') {
      accessor = (data: any) => {
        const values = data[name];
        return values
          ? values.map((item: any) => item[list.show]).join(', ')
          : null;
      };
    }
    if (type === 'foreignKey') {
      accessor = (data: any) => {
        return data[name] ? data[name][list.show] : null;
      };
    }
    accessor = list.accessor ? list.accessor : accessor;
    const col: any = {
      Header: name,
      accessor,
      Filter: list.filter ? filters[list.filter] : filters.text,
      filter: list.filter ? list.filter : 'text',
      disableFilters: !list.filter,
    };
    columns.push(col);
  });
  return columns;
};

/*interface ListProps {
  resource: {
    name: string;
    title: string;
  };
  dispatch: Function;
}*/

export default function List(props: any) {
  const { resource, dispatch } = props;
  const resourceName = resource.name;
  const [filters, setFilters] = useState([] as any[]);
  const columns: any = React.useMemo(() => getTableColumns(resourceName), [resourceName]);
  // @ts-ignore
  const config = resources[resourceName];

  const url = `${settings.baseUrl}/${resourceName}`;
  const { data = [], loading, error } = useFetch(url, [url]);

  useEffect(() => {
    setFilters([]);
  }, [resourceName]);

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const addFilter = (filter: any) => {
    setAnchorEl(null);
    if (filter.type === 'select') {
      filter.options = data.map((value: any) => {
        const option = value[filter.name];
        return { value: option, text: option };
      });
    }
    filters.push(filter);
    setFilters(filters);
  };

  const removeFilter = (filterName: string) => {
    const newFilters = filters.filter(
      (filter: any) => filter.name !== filterName
    );
    setFilters(newFilters);
  };

  const handleFilterChange = (e: any) => {
    const filterName = e.target.name;
    const filter = filters.find((f) => f.name === filterName);
    filter.value = e.target.value;
    setFilters([...filters]);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const addItem = () => {
    dispatch({ type: 'showForm' });
  };

  const editItem = (e: any) => {
    const rowId = e.row.original[settings.primaryKey];
    dispatch({ type: 'showForm', rowId });
  };

  const actions = [
    <Button key="cancel" onClick={editItem} variant="contained" color="secondary">
      Edit
    </Button>,
    <Button key="save" variant="contained" color="primary">
      Delete
    </Button>,
  ];

  const [tableData, setTableData] = React.useState<any[]>(React.useMemo(() => [], []));
  const [skipPageReset, setSkipPageReset] = React.useState(false);

  const updateMyData = (rowIndex: number, columnId: string, value: string) => {
    // We also turn on the flag to not reset the page
    setSkipPageReset(true);
    setTableData(old =>
      old.map((row, index) => {
        if (index === rowIndex) {
          return {
            ...old[rowIndex],
            [columnId]: value,
          };
        }
        return row;
      })
    );
  };

  if (loading) return <div>loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <Box m={2}>
        <Button variant="contained" onClick={addItem} color="primary">
          Add new {config.name}
        </Button>
      </Box>
      <Box alignItems={'end'}>
        <Button
          id="basic-button"
          aria-controls={open ? 'basic-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          onClick={handleClick}
        >
          Filter
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
          {config.filter.map((filter: any) => {
            return (
              <MenuItem key={filter.name} onClick={() => addFilter(filter)}>
                {filter.name}
              </MenuItem>
            );
          })}
        </Menu>
      </Box>
      <Box>
        {filters.map((filter: any) => {
          return (
            <Fragment key={filter.name}>
              {filter.type === 'text' && (
                <TextField
                  name={filter.name}
                  value={filter.value}
                  onChange={handleFilterChange}
                  size="small"
                ></TextField>
              )}
              {filter.type === 'select' && (
                <Select
                  size="small"
                  name={filter.name}
                  value={filter.value}
                  onChange={handleFilterChange}
                  sx={{ minWidth: 120 }}
                >
                  {filter.options.map((option: any) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.text}
                    </MenuItem>
                  ))}
                </Select>
              )}
              <IconButton onClick={() => removeFilter(filter.name)}>
                <ClearIcon />
              </IconButton>
            </Fragment>
          );
        })}
      </Box>

      <Table
        columns={columns}
        data={data}
        actions={actions}
        setData={setTableData}
        updateMyData={updateMyData}
        skipPageReset={skipPageReset}
      />

    </div>
  );
}

/*List.propTypes = {
    resource: PropTypes.shape({
        name: PropTypes.string,
        title: PropTypes.string,
    })
}*/
