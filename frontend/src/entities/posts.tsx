export default {
  name: "Post",
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
      text: "last_name",
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
    { name: "email" },
    {
      name: "author",
      type: "foreignKey",
      show: "last_name",
      renderx: ({ author }: any) => {
        if (!author) return "";
        return author.first_name + " x" + author.last_name;
      },
    },
    {
      name: "tags",
      type: "many2many",
      show: "name",
      renderx: ({ tags }: any) => {
        return tags.map((tag: any) => tag.name).join(", ");
      },
    },
  ],
  //footer: footer2,
};
