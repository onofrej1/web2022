
import React from 'react';
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
  const { data = [], loading, error } = useFetch(url, [url]);

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

      <Table
        columns={columns}
        data={data}
        actions={actions}
        filters={config.filter}
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
