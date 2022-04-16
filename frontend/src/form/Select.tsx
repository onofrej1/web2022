import React, { FC } from 'react';
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select as MuiSelect,
  SelectChangeEvent,
} from '@mui/material';
import { BaseProps } from './Field';


interface Props extends BaseProps {
  options: any[];
  multiple?: boolean;
  sx?: any;
}

export const Select: FC<Props> = (props) => {
  const { name, label, value, multiple, variant='outlined', sx, onChange, options = [] } = props;

  const handleChange = (event: SelectChangeEvent) => {
    console.log(event.target.value);
    onChange(event.target.value);
  };

  return (
    <FormControl sx={[...(Array.isArray(sx) ? sx : [sx])]}>
      <InputLabel id="select-label">abcd</InputLabel>
      <MuiSelect
        fullWidth
        id={name}
        sx={{ minWidth: 120 }}
        labelId="select-label"
        name={name}
        size="small"
        value={value}
        label={label}
        onChange={handleChange}
        multiple={multiple}
        variant={variant}
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
