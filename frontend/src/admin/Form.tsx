import React, { FC } from 'react';
import { Form as AdminForm } from '../form/Form';
import { useEffect, useState } from 'react';
import resources from '../resources/index';
import useFetch from 'use-http';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import settings from './settings';
import { getValue } from './utils';
import { Box, Button } from '@mui/material';
import { Field } from '../resources/resources.types';

interface Props {
  resource: any;
  dispatch: any;
}

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
          let options = await get(`/${field.resource}`);
          options = options.map((option: any) => {
            const text = field.render
              ? field.render(option)
              : option[field.textField];
            const value = option[field.valueField];
            return { text, value };
          });
          field.options = options;
        }
      }
      setFields(formConfig);
    }
    getData();
    getOptions();
  }, []);

  const handleSubmit = async (data: any, e: any) => {
    const button = e.target;

    if (button.id === 'cancel') {
      dispatch({ type: 'showList' });
      return;
    }
    console.log(data);

    if (data.pk) {
      const url = `/${resource.name}/${resource.rowId}/`;
      await patch(url, data);
    } else {
      const url = `/${resource.name}`;
      await post(url, data);
    }

    if (button.id === 'save-and-close') {
      dispatch({ type: 'showList' });
    }
  };

  const actions = [
    <Button key="cancel" variant="contained" id="cancel" color="secondary">
      <CancelIcon fontSize="small" /> Cancel
    </Button>,
    <Button key="save" variant="contained" id="save" color="primary">
      <SaveIcon fontSize="small" /> Save
    </Button>,
    <Button
      key="save-and-close"
      variant="contained"
      id="save-and-close"
      color="primary"
    >
      <SaveIcon fontSize="small" /> Save and close
    </Button>,
  ];

  if (loading || !data) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <Box p={2}>
      <AdminForm
        handleSubmit={handleSubmit}
        fields={fields}
        actions={actions}
        data={data}
      ></AdminForm>
    </Box>
  );
};
