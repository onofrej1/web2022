import {useCallback, useEffect, useState} from "react";
import {TextField} from "@material-ui/core";

function Text (props: any) {
    const { onChange, value, ...rest } = props;
    useEffect(() => {
        //onChange(value);
    }, []);

    const handleChange = useCallback((event) => {
        onChange(event.target.value);
    }, [onChange]);
    console.log(value);

    return (
        <TextField size="small" fullWidth variant="outlined" onChange={handleChange} value={value} {...rest}/>
    )
}

export default Text;