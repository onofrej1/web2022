import { Box } from '@mui/material';
import React, { FC } from 'react';
import { Select } from './Select';
import { CheckboxSelect } from './CheckboxSelect';
import { Text } from './Text';

export interface BaseProps {
  id?: string;
  name?: string;
  label?: string;
  placeholder?: string | undefined;
  value: any;
  onChange: any;
  variant?: 'filled' | 'outlined' | 'standard';
  fullWidth?: boolean;
}

interface FieldProps extends BaseProps {
  type: string;
  required?: boolean;
  multiple?: boolean;
  helpText?: string;
}

export const Field: FC<FieldProps> = (props) => {
  const { name, label, value, type, required, helpText, ...rest } = props;

  const componentProps = {
    name,
    label: label || props.name,
    value,
    // inputType: text|email|color...
    required,
    ...rest,
  };
  if (type === 'many2many') {
    componentProps.multiple = true;
  }

  const components: Record<string, React.ElementType> = {
    text: Text,
    select: Select,
    foreignKey: Select,
    many2many: CheckboxSelect,
  };

  const Component = components[type];

  return (
    <Box sx={{ my: 3 }}>
      {<Component {...componentProps} />}
      <div className="help">{helpText}</div>
    </Box>
  );
};
