import React, { FC } from "react";
import Text from "./Text";

function Field (props: any) {
    const fieldId = new Date().getTime().toString();

    const {
        label,
        type,
        required,
        helpText,
        ...rest
    } = props

    const inputProps = {
        id: fieldId,
        label: label || props.name,
        required,
        ...rest,
    }

    const components: Record<string, FC> = {
       'text': Text, 
    };
    const Component: FC = components[type];

    return (
        <div className="field mb-4 mt-4">
            <div className="field__input">
                {<Component {...inputProps}/>}
            </div>
            {<div className="field__help">
                {helpText}
            </div>}
        </div>
    )
}

export default Field;