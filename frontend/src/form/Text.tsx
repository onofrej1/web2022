import React, { FC, useCallback } from 'react';
import { BaseProps } from './Field';
import { TextField } from '@mui/material';

interface Props extends BaseProps {
  type?: string;
  min?: number;
  max?: number;
}

export const Text: FC<Props> = (props) => {
  const { name, label, value, variant = 'outlined', fullWidth=true, type = 'text', min, max, placeholder = '', onChange } = props;
  const handleChange = useCallback(
    (e) => {
      onChange(e.target.value);
    },
    [onChange]
  );

  const InputProps = {
    inputProps: { 
      min,
      max, 
    }
  };

  const InputLabelProps={
    shrink: true,
  };

  return (
    <TextField
      label={label}
      type={type}
      placeholder={placeholder}
      name={name}
      InputProps={InputProps}
      InputLabelProps={InputLabelProps}
      onChange={handleChange}
      size="small"
      value={value || ''}
      variant={variant}
      fullWidth={fullWidth}
    />
  );
};
