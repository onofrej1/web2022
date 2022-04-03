import React from 'react';
import Select from './Select';
import Text from './Text';

export default function Field (props: any) {
    const {
        label,
        type,
        required,
        helpText,
        ...rest
    } = props

    
    const inputProps = {
        label: label || props.name,
        // inputType: text|email|color...
        required,
        ...rest,
    }
    if (type === 'many2many') {
        inputProps.multiple = true;
    }

    const components: Record<string, React.ElementType> = {
       'text': Text, 
       'select': Select,
       'foreignKey': Select,
       'many2many': Select,
    };

    const Component = components[type];
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