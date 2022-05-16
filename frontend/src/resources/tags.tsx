export default {
  name: 'Tag',
  name_plural: 'Tags',
  menuIcon: 'saveIcon',
  resource: 'tags',
  filter: [
    { name: 'name', type: 'select', op: 'eq', label: 'Title' },
  ],
  form: [{ name: 'name', label: 'Name', type: 'text' }],
  list: [{ name: 'name' }],
};
