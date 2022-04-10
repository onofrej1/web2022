import React, { FC, useCallback } from 'react';
import { BaseProps } from './Field';
import { TextField } from '@mui/material';

interface Props extends BaseProps {
  type?: string;
}

export const Text: FC<Props> = (props) => {
  const { name, label, value, type = 'text', placeholder, onChange } = props,
    handleChange = useCallback(
      (event) => {
        onChange(event.target.value);
      },
      [onChange]
    );

  return (
    <TextField
      fullWidth
      label={label}
      type={type}
      placeholder={placeholder}
      name={name}
      onChange={handleChange}
      size="small"
      value={value || ''}
      variant="outlined"
    />
  );
};
