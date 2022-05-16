import { Box } from '@mui/material';
import React, { FC } from 'react';
import { Select } from './Select';
import { MultiSelect } from './MultiSelect';
import { Text } from './Text';

export interface BaseProps {
  id?: string;
  name?: string;
  label?: string;
  placeholder?: string;
  helperText?: string;
  disabled?: boolean;
  value: any
  //onChange: (e: React.ChangeEvent<{ value: unknown }>) => void;
  onChange: (value: unknown) => void;
  variant?: 'filled' | 'outlined' | 'standard';
  fullWidth?: boolean;
}

interface FieldProps extends BaseProps {
  type: string;
  required?: boolean;
  multiple?: boolean;
}

export const Field: FC<FieldProps> = (props) => {
  const { name, label, value, type, required, helperText, ...rest } = props;

  const componentProps = {
    name,
    label,
    value,
    required,
    helperText,
    // inputType: text|email|color...
    ...rest,
  };
  if (type === 'many2many') {
    componentProps.multiple = true;
  }

  const components: Record<string, React.ElementType> = {
    text: Text,
    select: Select,
    foreignKey: Select,
    many2many: MultiSelect,
  };

  const Component = components[type];

  return (
    <Box sx={{ my: 3 }}>
      {<Component {...componentProps} />}
    </Box>
  );
};
