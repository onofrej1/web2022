export default {
  name: 'Users',
  name_plural: 'Users',
  resource: 'users',
  menuIcon: 'saveIcon',
  filter: [{ name: 'username', label: 'Username', type: 'text', op: 'eq' }],
  form: [
    { name: 'first_name', label: 'First name', type: 'text' },
    { name: 'last_name', label: 'Last name', type: 'text' },
    { name: 'email', label: 'Email', type: 'text' },
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
