import React, { useState, useCallback, FC } from 'react';
import { Button, Card, ButtonProps, Box, CardContent, CardActions, CardHeader, Typography, SxProps } from '@mui/material';
import { Field } from './Field';
import { FormField } from 'resources/resources.types';

export interface Data {
  [key: string]: number | string | string[];
}

interface FormProps {
  fields: FormField[];
  actions: FormAction[];
  title: string;
  data: Data;
  handleSubmit?: (data: Data, e: React.MouseEvent<HTMLButtonElement>) => void;
}

export interface FormAction {
  icon: React.ComponentType;
  color: ButtonProps['color'];
  action: (data: Data) => Promise<void>;
  label: string;
  sx?: SxProps;
}

export const Form: FC<FormProps> = (props) => {
  const { title, fields, actions = [], data: defaultData = {}, handleSubmit } = props;
  const [data, setData] = useState(defaultData);

  const updateField = useCallback(
    (name: string) => {
      return (value: any) => {
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

  const formWrapperStyles = { px: 2, maxWidth: '600px', marginX: 'auto', backgroundColor: 'white' };

  return (
    <Card sx={formWrapperStyles}>
      <CardHeader component={Typography} title={title} />
      <CardContent sx={{ py: 0 }}>
        {fields.map((field) => {
          const fieldName: string = field.name;
          const value = data[fieldName] || '';
          const onChange = updateField(fieldName);

          return (
            <Box mb={2} key={fieldName}>
              <Field {...field} value={value} type={field.type} onChange={onChange} />
            </Box>
          );
        })}
        {/*<div><code>{JSON.stringify(data, null, 4)}</code></div>*/}
      </CardContent>
      <CardActions sx={{ display: 'flex', justifyContent: 'flex-end', m: 1 }}>
        {actions.length ? (
          actions.map((action, index) => {
            const Icon = action.icon;

            return (
              <Button
                key={index}
                onClick={() => action.action(data)}
                variant="contained"
                color={action.color}
                sx={action.sx}
                startIcon={<Icon />}
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
      </CardActions>
    </Card>
  );
};
