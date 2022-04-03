import React from 'react';
import { TextField } from '@mui/material';
import { useCallback } from 'react';

function Text (props: any) {
    const { onChange, value, ...rest } = props;

    const handleChange = useCallback((event) => {
        onChange(event.target.value);
    }, [onChange]);

    return (
        <TextField size="small" fullWidth variant="outlined" onChange={handleChange} value={value} {...rest}/>
    )
}

export default Text;