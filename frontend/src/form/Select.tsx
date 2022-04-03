import React from 'react';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';

const formControl = {
  minWidth: 120,
  width: '100%',
};

function SelectFC(props: any) {
  const { onChange, value, options = [], label, ...rest } = props;

  const handleChange = (event: any) => {
    onChange(event.target.value);
  };

  return (
    <FormControl sx={formControl}>
      <InputLabel>{label}</InputLabel>
      <Select
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
      </Select>
    </FormControl>
  );
}

export default SelectFC;
