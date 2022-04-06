export default {
  name: 'Users',
  resource: 'users',
  filter: [{ name: 'username', type: 'text', op: 'eq' }],
  form: [
    { name: 'first_name', type: 'text' },
    { name: 'last_name', type: 'text' },
    { name: 'email', type: 'text' },
    //{ name: 'content', type: 'editor' },
    //{ name: 'tags', type: 'pivotRelation', resourceTable: 'tag', show: 'title', label: 'Tags' },
  ],
  list: [
    { name: 'first_name', header: 'First name' },
    { name: 'last_name', header: 'Last name' },
    { name: 'email' },
  ],
  //footer: footer,
};
