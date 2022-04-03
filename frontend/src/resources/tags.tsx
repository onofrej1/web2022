export default {
    name: 'Tag',
    resource: 'tags',
    filter: [
      { name: 'title', type: 'select', op: 'eq', label: 'Title' },
      { name: 'text', type: 'text', op: 'contains', label: 'Text' },
    ],
    form: [
      { name: 'name', type: 'text' },
    ],
    list: [
      { name: 'name' },
    ],
  };
  