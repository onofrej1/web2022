export default {
  name: "Post",
  menuIcon: 'saveIcon',
  resource: "posts",
  filter: [
    { name: "title", type: "select", op: "eq", label: "Title" },
    { name: "text", type: "text", op: "contains", label: "Text" },
  ],
  form: [
    { name: "title", type: "text" },
    {
      name: "author",
      type: "foreignKey",
      resource: "users",
      value: 'pk',
      //text: "last_name",
      textRender: (author: any) => {
        if (!author) return "";
        return author.first_name + " " + author.last_name;
      }
    },
    {
      name: "tags",
      type: "many2many",
      resource: "tags",
      value: 'pk',
      text: "name",
    },
    { name: "text", type: "text" },
    //{ name: 'content', type: 'editor' },
  ],
  list: [
    { name: "title", custom: "custom" },
    { name: "text" },
    {
      name: "author",
      type: "foreignKey",
      //show: "last_name",
      render: ({ author }: any) => {
        if (!author) return "";
        return author.first_name + " " + author.last_name;
      },
    },
    {
      name: "tags",
      type: "many2many",
      show: "name",
      /*render: ({ tags }: any) => {
        return tags.map((tag: any) => tag.name).join(", ");
      },*/
    },
  ],
  //footer: footer2,
};
