import React, { FC } from 'react';
import { Form as AdminForm } from '../form/Form';
import { useEffect, useState } from 'react';
import resources from '../resources/index';
import useFetch from 'use-http';
import settings from './settings';
import { getValue } from './utils';
import { Box } from '@mui/material';
import { Field } from '../resources/resources.types';

interface Props {
  resource: any;
  dispatch: any;
}

const mapFieldOptions = (field: any, options: any[]) => {
  return options.map((option: any) => {
    const text = field.render
      ? field.render(option)
      : option[field.textField];
    const value = option[field.valueField];
    return { text, value };
  });
};

export const Form: FC<Props> = (props) => {
  const { resource, dispatch } = props;
  const { get, post, patch, loading, error } = useFetch(settings.baseUrl);
  const [fields, setFields] = useState<Field[]>([]);
  const [data, setData] = useState();

  // @ts-ignore
  const config = resources[resource.name];
  const formConfig: any[] = config.form;

  useEffect(() => {
    async function getData() {
      const url = `/${resource.name}/${resource.rowId}`;
      const data = await get(url);

      Object.keys(data).forEach((key: string) => {
        data[key] = getValue(data[key]);
      });
      setData(data);
    }
    
    async function getOptions() {
      for (const field of formConfig) {
        if (
          ['foreignKey', 'many2many'].includes(field.type) &&
          field.resource
        ) {
          const options = await get(`/${field.resource}`);
          field.options = mapFieldOptions(field, options);
        }
      }
      setFields(formConfig);
    }
    if (resource.rowId) {
      getData();
    } else {
      setData({} as any);
    }
    getOptions();
  }, [formConfig, get, resource.name, resource.rowId]);

  const saveData = async (data: any) => {
    console.log(data);
    if (data.pk) {
      const url = `/${resource.name}/${resource.rowId}/`;
      await patch(url, data);
      setData(data);
    } else {
      const url = `/${resource.name}/`;
      await post(url, data);
      setData(data);
    }
  };
  
  const actions = [
    {
      label: 'Cancel',
      color: 'secondary',
      icon: 'cancel',
      action: () => dispatch({ type: 'showList' }),
    },
    {
      label: 'Save',
      icon: 'save',
      color: 'primary',
      action: saveData,
    },
    {
      label: 'Save & close',
      icon: 'save',
      color: 'secondary',
      action: async (data: any) => {
        await saveData(data);
        dispatch({ type: 'showList' });
      },
    }
  ];

  if (loading || !data) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <Box p={2}>
      <AdminForm
        fields={fields}
        actions={actions}
        data={data}
      ></AdminForm>
    </Box>
  );
};
