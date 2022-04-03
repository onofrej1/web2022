import React, { FC } from 'react';
import { FormControl, InputLabel, MenuItem, Select as MuiSelect } from '@mui/material';
import { BaseProps } from './Field';

const formControl = {
  //minWidth: 120,
  width: '100%',
};

interface Props extends BaseProps {
  multiple?: boolean;
  options: [];
}

export const Select: FC<Props> = (props) => {
  const { name, label, value, onChange, options = [], ...rest } = props;

  const handleChange = (event: any) => {
    onChange(event.target.value);
  };

  return (
    <FormControl sx={formControl}>
      <InputLabel>{label}</InputLabel>
      <MuiSelect
        name={name}
        size="small"
        value={value}
        label={label}
        onChange={handleChange}
        {...rest}
      >
        {options.map((option: any) => (
          <MenuItem key={option.value} value={option.value}>
            {option.text}
          </MenuItem>
        ))}
      </MuiSelect>
    </FormControl>
  );
}