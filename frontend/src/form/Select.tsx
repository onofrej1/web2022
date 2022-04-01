import React, {useCallback} from "react";
import { makeStyles } from '@material-ui/core/styles';
import useAxios from "../useAxios";
import useFetch from 'use-http';
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

const useStyles = makeStyles((theme) => ({
    formControl: {
        minWidth: 120,
        width: '100%'
    },
    /* selectEmpty: {
        marginTop: theme.spacing(2),
    }, */
}));

function SelectFC(props: any) {
    const { onChange, value, options = [], label, ...rest } = props;
    const classes = useStyles();

    const handleChange = (event: any) => {
        onChange(event.target.value)
    };
    console.log(value);
      
    return (
        <FormControl className={classes.formControl}>
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