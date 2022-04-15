import React, { FC, useCallback } from 'react';
import { BaseProps } from './Field';
import { TextField } from '@mui/material';

interface Props extends BaseProps {
  type?: string;
  min?: number;
  max?: number;
}

export const Text: FC<Props> = (props) => {
  const { name, label, value, type = 'text', min, max, placeholder, onChange } = props;
  const handleChange = useCallback(
    (event) => {
      onChange(event.target.value);
    },
    [onChange]
  );

  const InputProps = {
    inputProps: { 
      min,
      max, 
    }
  };

  return (
    <TextField
      fullWidth
      label={label}
      type={type}
      placeholder={placeholder}
      name={name}
      InputProps={InputProps}
      onChange={handleChange}
      size="small"
      value={value || ''}
      variant="outlined"
    />
  );
};
