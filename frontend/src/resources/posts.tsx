export default {
  name: 'Post',
  menuIcon: 'saveIcon',
  resource: 'posts',
  filter: [
    { name: 'title', type: 'select', op: 'eq', label: 'Title' },
    { name: 'text', type: 'text', op: 'contains', label: 'Text' },
  ],
  form: [
    { name: 'title', type: 'text' },
    {
      name: 'author',
      type: 'foreignKey',
      resource: 'users',
      valueField: 'pk',
      //textField: 'last_name',
      render: (author: any) => {
        if (!author) return '';
        return author.first_name + ' ' + author.last_name;
      }
    },
    {
      name: 'tags',
      type: 'many2many',
      resource: 'tagexs',
      valueField: 'pk',
      textField: 'name',
    },
    { name: 'text', type: 'text' },
    //{ name: 'content', type: 'editor' },
  ],
  list: [
    { name: 'title' },
    { name: 'text' },
    {
      name: 'author',
      type: 'foreignKey',
      //show: 'last_name',
      render: ({ author }: any) => {
        if (!author) return '';
        return author.first_name + ' ' + author.last_name;
      },
    },
    {
      name: 'tags',
      type: 'many2many',
      show: 'name',
      /*render: ({ tags }: any) => {
        return tags.map((tag: any) => tag.name).join(', ');
      },*/
    },
  ],
  //footer: footer2,
};