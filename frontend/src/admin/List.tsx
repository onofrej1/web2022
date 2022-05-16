import React, { Dispatch, useState } from 'react';
import { resources } from 'resources';
import Table, { TableAction } from 'table/Table';
import settings from './settings';
import { DefaultFilter, filterGreaterThan, RangeFilter, SelectFilter, SliderFilter } from 'table/filters';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { ResourcesAction, ResourcesState } from './Resources';
import { TableField, Resource } from 'resources/resources.types';
import { Column } from 'react-table';
import useFetch from 'use-http';
import { toast } from 'react-toastify';
import { useConfirmDialog } from 'common/useConfirmDialog';

const configKeys: any = {
  header: 'Header',
  render: 'accessor',
};

const filters: any = {
  text: ['includes', DefaultFilter],
  select: ['equals', SelectFilter],
  slider: [filterGreaterThan, SliderFilter],
  range: ['between', RangeFilter],
};

type NewTableField = Omit<TableField, 'header' | 'render'> & { Header: any; accessor: any };
const mapTableFields = (tableField: Partial<TableField>): NewTableField => {
  return Object.keys(tableField).reduce((obj, key: string) => {
    const newKey: string = configKeys[key] || key;
    // @ts-ignore
    obj[newKey] = tableField[key];
    return obj;
  }, {} as NewTableField);
};

const getTableColumns = (resource: Resource): Column[] | never => {
  const fields = resource.list;
  if (!fields) {
    throw 'Missing list configuration.';
  }
  const columns: Column[] = [];

  fields.forEach((field) => {
    const list = mapTableFields(field);
    const { name, type, Header, show, accessor: fieldAccessor } = list;
    const filter = resource.filter.find((f: any) => f.name === name);

    let accessor: string | ((data: any) => React.ReactNode) = name;
    if (type === 'many2many') {
      const showField = show || settings.primaryKey;
      accessor = (data: any) => {
        const values = data[name];
        return values ? values.map((item: any) => item[showField]).join(', ') : null;
      };
    }
    if (type === 'foreignKey') {
      const showField = show || settings.primaryKey;
      accessor = (data: any) => {
        return data[name] ? data[name][showField] : null;
      };
    }
    accessor = accessor ? accessor : fieldAccessor;
    const column = {
      Header: Header || name,
      accessor,
      filter: filter ? filters[filter.type][0] : null,
      Filter: filter ? filters[filter.type][1] : () => null,
      disableFilters: !filter,
    };
    columns.push(column);
  });
  return columns;
};

interface ListProps {
  resource: ResourcesState;
  dispatch: Dispatch<ResourcesAction>;
}

export default function List(props: ListProps) {
  const { resource, dispatch } = props;
  const [ refreshToken, setRefreshToken ] = useState<string | null>(null);
  const { delete: deleteRow, error, post } = useFetch(settings.baseUrl);
  const { ConfirmDialog, confirm } = useConfirmDialog();

  const resourceName = resource.name;
  const config = resources.find((r) => r.resource === resourceName);
  if (!config) {
    throw 'Missing resource configuration.';
  }

  const columns = React.useMemo(() => getTableColumns(config), [config]);
  const fetchUrl = `${settings.baseUrl}/${resourceName}`;

  const addItem = () => {
    dispatch({ type: 'showForm' });
  };

  const editItem = (row: any) => {
    const rowId = row.original[settings.primaryKey];
    dispatch({ type: 'showForm', rowId });
  };

  const deleteItem = async (row: any) => {
    const rowId = row.original[settings.primaryKey];
    const url = `/${resource.name}/${rowId}/`;
    await deleteRow(url);
    setRefreshToken(new Date().getTime().toString());
    error ? toast.error('An error occured.') : toast.success('Item deleted.');
  };

  const deleteItems = async (rows: any[]) => {
    const url = `/${resource.name}/items/delete`;
    const data = rows.map((r) => parseInt(r.original.id));

    await post(url, data);
    setRefreshToken(new Date().getTime().toString());
    error ? toast.error('An error occured.') : toast.success('Items deleted.');
  };

  const actions: TableAction[] = [
    {
      label: 'Edit',
      color: 'primary',
      action: editItem,
      icon: EditIcon,
    },
    {
      label: 'Delete',
      color: 'secondary',
      type: 'delete',
      action: async(row: any) => {
        const confirmDelete = await confirm('Delete row ?');
        if (confirmDelete) {
          deleteItem(row);
        }
      },
      icon: DeleteIcon,
    },
  ];

  const bulkActions: any[] = [
    {
      label: 'Delete',
      type: 'delete',
      action: async(rows: any) => {
        const confirmDelete = await confirm('Delete selected rows ?');
        if (confirmDelete) {
          deleteItems(rows);
        }
      },
    },
  ];

  return (
    <div>
      {ConfirmDialog}
      <Table
        refreshToken={refreshToken}
        fetchUrl={fetchUrl}
        columns={columns}
        actions={actions}
        bulkActions={bulkActions}
        filters={config.filter}
        handleAddItem={addItem}
      />
    </div>
  );
}
