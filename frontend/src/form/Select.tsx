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
  const { name, value, label, variant='outlined', sx, onChange, options = [] } = props;
  const handleChange = (e: SelectChangeEvent) => {
    onChange(e.target.value);
  };

  return (
    <FormControl fullWidth sx={[...(Array.isArray(sx) ? sx : [sx])]}>
      <InputLabel shrink id="select-label">{label}</InputLabel>
      <MuiSelect
        fullWidth
        id={name}
        displayEmpty
        sx={{ minWidth: 120 }}
        labelId="select-label"
        name={name}
        size="small"
        value={value}
        label={label}
        onChange={handleChange}
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
