import React, { useState, useCallback, FC } from 'react';
import { Button, Box } from '@mui/material';
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

  const updateField = useCallback(
    (name: string) => {
      return (value: string) => {
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
    <Box sx={{ p: 2, maxWidth: '600px', marginX: 'auto' }}>
      <form>
        {fields.map((field: any) => {
          const fieldName: string = field.name;
          const value = data[fieldName] || '';

          return (
            <Box mb={2} key={fieldName}>
              <Field
                {...field}
                value={value}
                onChange={updateField(fieldName)}
              />
            </Box>
          );
        })}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: '5px' }}>
          {actions.length ? (
            actions.map((action: any, index) => {
              const Icon = action.icon;
              console.log(action);

              return (
                <Button
                  key={index}
                  onClick={(e) => action.action(data, e)}
                  variant="contained"
                  color={action.color}
                  startIcon={<Icon fontSize="small" />}
                >
                  {action.label}
                </Button>
              );
            })
          ) : (
            <>
              <Button variant="contained" onClick={submit} color="primary">
                Save
              </Button>
            </>
          )}
        </Box>
      </form>

      <p>
        <code>{JSON.stringify(data, null, 4)}</code>
      </p>
    </Box>
  );
};
