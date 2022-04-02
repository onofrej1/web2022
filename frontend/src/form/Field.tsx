import React, { FC } from "react";
import Select from "./Select";
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
        // inputType: text|email|color...
        required,
        ...rest,
    }
    if (type === 'many2many') {
        inputProps.multiple = true;
    }

    const components: Record<string, FC> = {
       'text': Text, 
       'select': Select,
       'foreignKey': Select,
       'many2many': Select,
    };

    const Component: FC = components[type];
    //console.log(inputProps);

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