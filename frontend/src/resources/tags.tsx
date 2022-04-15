export default {
  name: 'Tag',
  resource: 'tags',
  filter: [
    { name: 'name', type: 'select', op: 'eq', label: 'Title' },
  ],
  form: [{ name: 'name', type: 'text' }],
  list: [{ name: 'name' }],
};
