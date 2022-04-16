import React, { useState, useCallback, FC, Fragment } from 'react';
import { Button, Grid, Box } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import { Field } from './Field';
import { Field as FieldType } from '../resources/resources.types';

interface FormData {
  [key: string]: any;
}

interface Props {
  fields: FieldType[];
  actions: any[];
  data: FormData;
  handleSubmit?: (
    data: FormData,
    e: React.MouseEvent<HTMLButtonElement>
  ) => void;
}

export const Form: FC<Props> = (props) => {
  const { fields, actions = [], data: defaultData = {}, handleSubmit } = props;
  const [data, setData] = useState(defaultData);
  console.log(data);

  const updateValue = useCallback(
    (name: string) => {
      console.log('update'+name);
      return (value: string) => {
        console.log('update'+value);
        setData({
          ...data,
          [name]: value,
        });
      };
    },
    [setData, data]
  );

  const submit = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (handleSubmit) {
      handleSubmit(data, e);
    }
  };

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
            actions.map((action: any, index) => (
              <Button
                key={index}
                onClick={(e) => action.action(data, e)}
                variant="contained"
                color={action.color}
              >
                <SaveIcon fontSize="small" /> {action.label}
              </Button>
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
};
