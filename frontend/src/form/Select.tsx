import React, { FC } from 'react';
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select as MuiSelect,
  SelectChangeEvent,
} from '@mui/material';
import { BaseProps } from './Field';

const formControl = {
  //minWidth: 120,
  width: '100%',
};

interface Props extends BaseProps {
  multiple?: boolean;
  options: any[];
}

export const Select: FC<Props> = (props) => {
  const { name, label, value, multiple, onChange, options = [] } = props;

  const handleChange = (event: SelectChangeEvent) => {
    console.log(event.target.value);
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
        multiple={multiple}
      >
        {options.map((option: any) => (
          <MenuItem key={option.value} value={option.value}>
            {option.text}
          </MenuItem>
        ))}
      </MuiSelect>
    </FormControl>
  );
};
