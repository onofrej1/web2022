
import React, { useEffect } from 'react';
import resources from 'resources/index';
import Table from 'table/Table';
//import makeData from './makeData';
import {
  Box,
  Button,
} from '@mui/material';
import settings from 'admin/settings';
import useFetch from 'use-http';
import { DefaultFilter, filterGreaterThan, RangeFilter, SelectFilter, SliderFilter } from 'table/filters';

const configKeys: any = {
  header: 'Header',
  render: 'accessor',
};

const filters: any = {
  'text': ['includes', DefaultFilter],
  'select': ['equals', SelectFilter],
  'slider': [filterGreaterThan, SliderFilter],
  'range': ['between', RangeFilter],
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
    const filter = config.filter.find((f: any) => f.name === name);

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
      //filter: list.filter ? filters[list.filter][0] : null,
      //Filter: list.filter ? filters[list.filter][1] : () => null,
      //disableFilters: !list.filter,
      filter: filter ? filters[filter.type][0] : null,
      Filter: filter ? filters[filter.type][1] : () => null,
      disableFilters: !filter,
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
  const columns: any = React.useMemo(() => getTableColumns(resourceName), [resourceName]);
  // @ts-ignore
  const config = resources[resourceName];
  const url = `${settings.baseUrl}/${resourceName}`;
  const { data = [], cache, loading, error } = useFetch(url, [url]);

  useEffect(() => {
    return () => {
      cache.clear();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addItem = () => {
    dispatch({ type: 'showForm' });
  };

  const editItem = (row: any) => {
    const rowId = row.original[settings.primaryKey];
    dispatch({ type: 'showForm', rowId });
  };

  const actions = [
    {
      label: 'Edit',
      color: 'primary',
      action: editItem,
    },
    {
      label: 'Delete',
      action: () => null,
    }
  ];

  //const [skipPageReset, setSkipPageReset] = React.useState(false);

  const addNewItem = () => (
    <Box ml={2} mb={2}>
      <Button variant="contained" onClick={addItem} color="primary">
        Add new {config.name}
      </Button>
    </Box>
  );

  if (loading) return <div>loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <Table
        columns={columns}
        data={data}
        actions={actions}
        filters={config.filter}
        toolbar={{ left: addNewItem }}
        //skipPageReset={skipPageReset}
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
