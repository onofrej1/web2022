export default {
  name: 'Post',
  name_plural: 'Posts',
  menuIcon: 'saveIcon',
  resource: 'posts',
  filter: [
    { name: 'title', type: 'select', label: 'Title' },
    { name: 'text', type: 'text', label: 'Text' },
  ],
  form: [
    { name: 'title', label: 'Title', type: 'text' },
    { name: 'views', label: 'Views', type: 'text'},
    {
      name: 'author',
      type: 'foreignKey',
      label: 'Author',
      resource: 'users',
      valueField: 'pk',
      textField: 'last_name',
      render: (author: any) => {
        if (!author) return '';
        return author.first_name + ' ' + author.last_name;
      },
    },
    {
      name: 'tags',
      type: 'many2many',
      label: 'Tags',
      resource: 'tags',
      valueField: 'pk',
      textField: 'name',
    },
    { name: 'text', label: 'Text', type: 'text' },
    //{ name: 'content', type: 'editor' },
  ],
  list: [
    { name: 'pk' },
    { name: 'title' },
    { 
      name: 'text', 
      //filter: 'text' 
    },
    //{ name: 'views', filter: 'text' },
    {
      name: 'author',
      type: 'foreignKey',
      //filter: 'select',
      //show: 'last_name',
      //render: ({ author }: any) => {
      //  if (!author) return '';
      //  return author.first_name + ' ' + author.last_name;
      //},
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
