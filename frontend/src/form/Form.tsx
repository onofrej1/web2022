import React, { useState, useCallback } from 'react';
import Field from './Field';
import { Button, Grid, Box } from '@mui/material';

/*interface FormProps {
  fields: any;
  handleSubmit?: (data: any, e?: any) => void;
  actions?: Array<any>;
  data?: any;
}*/

interface DataEntry {
  [key: string]: {

  };
}

interface FormProps {
  fields: [];
  actions: [];
  data: DataEntry;
  handleSubmit: (data: DataEntry) => void;
}

export default function Form (props: FormProps) {
  const { fields, actions = [], data: defaultData = {}, handleSubmit } = props;
  const [data, setData] = useState(defaultData);

  const updateValue = useCallback(
    (name: string) => {
      return (value: any) => {
        //console.log('update value:' + name + ':' + value);
        setData({
          ...data,
          [name]: value,
        });
      };
    },
    [setData, data]
  );

  const submit = () => {
    handleSubmit(data);
  };

  const clone = (el: any) => React.cloneElement(el, {
    onClick: (e: any) => {
      if (handleSubmit) {
        handleSubmit(data);
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
                onChange={updateValue(fieldName)}
                value={value}
              />
            </Box>
          );
        })}
        <Grid container>
          {actions.length ? (
            actions.map((action: any) => (
              <>
                {clone(action)}
                &nbsp;
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