import React, { FC } from 'react';
import {
  Checkbox,
  FormControl,
  InputLabel,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Select,
  SelectChangeEvent,
} from '@mui/material';
import { BaseProps } from './Field';

interface SelectOption {
  value: string;
  text: string;
}

interface MultiSelectProps extends Omit<BaseProps, 'value'> {
  value: string[];
  options: SelectOption[];
}

export const MultiSelect: FC<MultiSelectProps> = (props) => {
  const {
    name,
    value = [],
    label,
    variant = 'outlined',
    onChange,
    options = [],
  } = props;

  const isAllSelected = options.length > 0 && value.length === options.length;

  const handleChange = (e: SelectChangeEvent<string[]>) => {
    const values = e.target.value;
    if (values[values.length - 1] === 'all') {
      const newValue = value.length === options.length ? [] : options.map(o => o.value);
      onChange(newValue);
      return;
    }
    onChange(values);
  };

  const renderValue = (selected: string[]) => {
    return options.filter(o => selected.includes(o.value)).map(o => o.text).join(', ');
  };

  return (
    <FormControl fullWidth variant="outlined">
      <InputLabel shrink id="select-label">{label}</InputLabel>
      <Select
        id={name}
        size="small"
        labelId="select-label"
        label={label}
        multiple
        variant={variant}
        value={value || []}
        onChange={handleChange}
        renderValue={renderValue}
      >
        <MenuItem
          value="all"
          classes={{
            root: isAllSelected ? 'selectAll' : '',
          }}
        >
          <ListItemIcon>
            <Checkbox
              checked={isAllSelected}
              indeterminate={
                value.length > 0 && value.length < options.length
              }
            />
          </ListItemIcon>
          <ListItemText primary="Select All" />
        </MenuItem>
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            <ListItemIcon>
              <Checkbox checked={value.indexOf(option.value) > -1} />
            </ListItemIcon>
            <ListItemText primary={option.text} />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
