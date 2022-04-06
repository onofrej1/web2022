type Input = {
    name: string,
    label: string,
    type: string,
    resource?: string,
    textField?: string,
    valueField?: string,
}

type Field = {
    name: string,
    type: string,
    Render: string,
}

type Filter = {
    name: string,
    type: string,
    op: string,
    label?: string,
}

type Resource = {
    title: string;
    resource: string;
    menuIcon: string;
    form: Input[];
    list: Field[];
    filter: Filter[];
}

export type { Resource, Input, Field, Filter };