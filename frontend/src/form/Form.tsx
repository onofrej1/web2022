import React, { useState, useCallback, FC } from 'react';
import { Field } from './Field';
import { Button, Grid, Box } from '@mui/material';
import { Field as FieldType } from '../resources/resources.types';

interface FormData {
  [key: string]: any;
}

interface Props {
  fields: FieldType[];
  actions: JSX.Element[];
  data: FormData;
  handleSubmit: (data: FormData, e: React.MouseEvent<HTMLButtonElement>) => void;
}

export const Form: FC<Props> = (props) => {
  const { fields, actions = [], data: defaultData = {}, handleSubmit } = props;
  const [data, setData] = useState(defaultData);

  const updateValue = useCallback(
    (name: string) => {
      return (value: string) => {
        //console.log('update value:' + name + ':' + value);
        setData({
          ...data,
          [name]: value,
        });
      };
    },
    [setData, data]
  );

  const submit = (e: React.MouseEvent<HTMLButtonElement>) => {
    handleSubmit(data, e);
  };

  const clone = (el: JSX.Element) => React.cloneElement(el, {
    onClick: (e: React.MouseEvent<HTMLButtonElement>) => {
      if (handleSubmit) {
        handleSubmit(data, e);
      }
    }
  });

  return (
    <Box p={2}>
      <form>
        {fields.map((field: any) => {
          const fieldName: string = field.name;
          const value = data[fieldName] || '';
          
          return (
            <Box mb={2} key={fieldName}>
              <Field
                {...field}
                value={value}
                onChange={updateValue(fieldName)}
              />
            </Box>
          );
        })}
        <Grid container>
          {actions.length ? (
            actions.map((action: any) => (
              <>
                {clone(action)}
              </>
            ))
          ) : (
            <>
              <Button variant="contained" onClick={submit} color="primary">
                Save
              </Button>
            </>
          )}
        </Grid>
      </form>
      
      <code>{JSON.stringify(data, null, 4)}</code>
    </Box>
  );
}