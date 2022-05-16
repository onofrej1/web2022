import React from 'react';

type Option = {
  text: string;
  value: string;
}

interface FormField {
    name: string,
    type: string,
    label: string,
    options?: Option[],
    resource?: string,
    textField?: string,
    valueField?: string,
}

interface TableField {
    name: string,
    header?: string,
    type?: string,
    show?: string,
    accessor?: (row: any) => React.ReactNode,
    render?: (row: any) => React.ReactNode,
}

interface DataFilter {
  name: string,
  type: string,
  label: string,
}

type Resource = {
    name: string;
    name_plural: string;
    resource: string;
    menuIcon: string;
    form: FormField[];
    list: TableField[];
    filter: DataFilter[];
}

export type { Resource, DataFilter, TableField, FormField };
