import React, { FC } from 'react';
import { Select } from './Select';
import { Text } from './Text';

export interface BaseProps {
  name: string;
  label: string;
  value: string;
  onChange: any;
}

interface FieldProps extends BaseProps {
  type: string;
  required?: boolean;
  multiple?: boolean;
  helpText?: string;
}

export const Field: FC<FieldProps> = (props) => {
  const { name, label, value, type, required, helpText, ...rest } = props;

  const componentProps = {
    name,
    label: label || props.name,
    value,
    // inputType: text|email|color...
    required,
    ...rest,
  };
  if (type === 'many2many') {
    componentProps.multiple = true;
  }

  const components: Record<string, React.ElementType> = {
    text: Text,
    select: Select,
    foreignKey: Select,
    many2many: Select,
  };

  const Component = components[type];

  return (
    <div className="field mb-4 mt-4">
      <div className="field__input">{<Component {...componentProps} />}</div>
      {<div className="field__help">{helpText}</div>}
    </div>
  );
};
