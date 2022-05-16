import React, { FC } from 'react';
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select as MuiSelect,
  SelectChangeEvent,
  SelectProps as MuiSelectProps,
} from '@mui/material';
import { BaseProps } from './Field';
import { SxProps } from '@mui/system';

interface SelectOption {
  value: string;
  text: string;
}

interface SelectProps extends BaseProps {
  options: SelectOption[];
  multiple?: boolean;
  fullWidth?: boolean;
  InputProps?: any; // Pick<MuiSelectProps, 'inputProps'>;
  sx?: SxProps;
  wrapperSx?: SxProps;
}

export const Select: FC<SelectProps> = (props) => {
  const { name, value, label, fullWidth = true, variant='outlined', sx, wrapperSx, InputProps, onChange, options = [] } = props;
  const handleChange = (e: SelectChangeEvent<{ value: unknown }>) => {
    onChange(e.target.value as string);
  };

  return (
    <FormControl fullWidth={fullWidth} sx={wrapperSx}>
      {label && <InputLabel shrink id="select-label">{label}</InputLabel>}
      <MuiSelect
        fullWidth={fullWidth}
        id={name}
        displayEmpty
        labelId="select-label"
        name={name}
        size="small"
        value={value || ''}
        label={label}
        onChange={handleChange}
        sx={{ minWidth: 120, ...sx }}
        variant={variant}
        inputProps={InputProps}
      >
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.text}
          </MenuItem>
        ))}
      </MuiSelect>
    </FormControl>
  );
};
