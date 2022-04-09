import React, { FC, useCallback } from 'react';
import { BaseProps } from './Field';
import { TextField } from '@mui/material';

interface Props extends BaseProps {
  inputType?: string;
}

export const Text: FC<Props> = (props) => {
  const { name, label, value, onChange } = props,
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
      name={name}
      onChange={handleChange}
      size="small"
      value={value}
      variant="outlined"
      
    />
  );
};
