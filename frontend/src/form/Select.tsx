import React, {useCallback} from "react";
import useAxios from "../useAxios";
import useFetch from 'use-http';
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

const formControl = {
    minWidth: 120,
    width: '100%',
};

function SelectFC(props: any) {
    const { onChange, value, options = [], label, ...rest } = props;

    const handleChange = (event: any) => {
        console.log(event.target.value);
        onChange(event.target.value)
    };
    console.log(value);
      
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
                {options.map((option: any) => <MenuItem key={option.value} value={option.value}>{option.text}</MenuItem>)}
            </Select>
        </FormControl>
    )
}

export default SelectFC;