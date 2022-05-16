import React, { FC } from 'react';
import { Data, Form as AdminForm, FormAction } from 'form/Form';
import { useEffect, useState } from 'react';
import { resources } from 'resources/index';
import useFetch from 'use-http';
import settings from './settings';
import { getValue } from 'utils/utils';
import { Box } from '@mui/material';
import { FormField } from 'resources/resources.types';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { toast } from 'react-toastify';

interface Props {
  resource: any;
  dispatch: any;
}

const mapFieldOptions = (field: any, options: any[]) => {
  options = options.map((option: any) => {
    const text = field.render
      ? field.render(option)
      : option[field.textField];
    const value = option[field.valueField];
    return { text, value };
  });
  options.unshift({ text: '--Choose--', value: '' });
  return options;
};

export const Form: FC<Props> = (props) => {
  const { resource, dispatch } = props;
  const { get, post, patch, error } = useFetch(settings.baseUrl);
  const [fields, setFields] = useState<FormField[]>([]);
  const [data, setData] = useState();

  const config = resources.find(r => r.resource === resource.name);
  if (!config) {
    throw 'Missing resource configuration.';
  }
  const formConfig = config.form;

  useEffect(() => {
    async function getData() {
      const url = `/${resource.name}/${resource.rowId}`;
      const data = await get(url);

      Object.keys(data).forEach((key: string) => {
        data[key] = getValue(data[key]);
      });
      setData(data);
    }

    async function setFormFields() {
      for (const field of formConfig) {
        if (
          ['foreignKey', 'many2many'].includes(field.type) &&
          field.resource
        ) {
          const options = await get(`/${field.resource}`);
          field.options = mapFieldOptions(field, options.results);
        }
      }
      setFields(formConfig);
    }
    if (resource.rowId) {
      getData();
    } else {
      setData({} as any);
    }
    setFormFields();
  }, [formConfig, get, resource.name, resource.rowId]);

  const saveData = async (data: any) => {
    console.log(data);

    // set relation fields for django rest framework
    for (const field of formConfig) {
      if (field.type === 'foreignKey') {
      //  data[field.name+'_id'] = data[field.name] || null;
      //  delete data[field.name];
      }
      if (field.type === 'many2many') {
        //data[field.name+'_idset'] = data[field.name] || [];
        //delete data[field.name];
      }
    }

    if (data[settings.primaryKey]) {
      const url = `/${resource.name}/${resource.rowId}/`;
      await patch(url, data);
      setData(data);
    } else {
      const url = `/${resource.name}/`;
      await post(url, data);
      setData(data);
    }
    error ? toast.error('An error occured.') : toast.success('Changes saved.');
  };

  const actions: FormAction[] = [
    {
      label: 'Cancel',
      color: 'secondary',
      icon: CancelIcon,
      action: () => dispatch({ type: 'showList' }),
    },
    {
      label: 'Save',
      icon: SaveIcon,
      color: 'primary',
      action: saveData,
    },
    {
      label: 'Save & close',
      icon: CheckCircleIcon,
      color: 'primary',
      sx: { backgroundColor: 'text.primary.dark' },
      action: async (data: Data) => {
        await saveData(data);
        dispatch({ type: 'showList' });
      },
    }
  ];


  if (!data) return null;
  if (error) return <>{error}</>;

  const title = data[settings.primaryKey] ? `Edit ${config.name}` : `Add new ${config.name}`;

  return (
    <Box p={2}>
      <AdminForm
        fields={fields}
        actions={actions}
        title={title}
        data={data}
      ></AdminForm>
    </Box>
  );
};
