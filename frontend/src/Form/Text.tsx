import {useCallback, useEffect, useState} from "react";
import {TextField} from "@material-ui/core";

function Text (props: any) {
    const { onChange, value, ...rest } = props;
    console.log(rest);
    useEffect(() => {
        onChange(value);
    }, [value]);

    const handleChange = useCallback((event) => {
        onChange(event.target.value);
    }, [onChange]);

    return (
        <TextField size="small" fullWidth variant="outlined" onChange={handleChange} value={value} {...rest}/>
    )
}

export default Text;