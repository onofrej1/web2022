import React, { FC } from 'react';
import { TextField } from '@mui/material';
import { useCallback } from 'react';
import { BaseProps } from './Field';

interface Props extends BaseProps {
    inputType?: string;
}

export const Text: FC<Props> = (props) => {
    const { name, label, value, onChange, ...rest } = props;

    const handleChange = useCallback((event) => {
        onChange(event.target.value);
    }, [onChange]);

    return (
        <TextField name={name} label={label} size="small" fullWidth variant="outlined" onChange={handleChange} value={value} {...rest}/>
    )
}