import { Box, Button } from "@material-ui/core";
import useAxios from "../useAxios";
import Form from "../form/Form";
import { FC, useEffect, useState } from "react";
import resources from "../entities/index";
import useFetch from "use-http";

interface AdminFormProps {
  resource: {
    name: string;
    title: string;
    rowId: number;
  };
  dispatch: Function;
}

function isObject(obj: any) {
  return obj === Object(obj);
}
const pkField = "pk";

export default function AdminForm({ resource, dispatch }: AdminFormProps) {
  const { get, loading, error } = useFetch("http://localhost:8000/api");
  const [fields, setFields] = useState([] as any[]);
  const [data, setData] = useState();

  // @ts-ignore
  const config = resources[resource.name];
  const fieldsCfg: any[] = config.form;

  useEffect(() => {
    async function getData() {
      const url = `/${resource.name}/${resource.rowId}`;
      const data = await get(url);

      Object.keys(data).forEach((key: string) => {
        let value = data[key];
        if (Array.isArray(value) && value.length && isObject(value[0])) {
          value = value.map((v: any) => v[pkField]);
        }
        if (!Array.isArray(value) && isObject(value)) {
          value = value[pkField];
        }
        data[key] = value;
      });

      setData(data);
    }
    async function getFk() {
      for (const field of fieldsCfg) {
        if (
          ["foreignKey", "many2many"].includes(field.type) &&
          field.resource
        ) {
          let options = await get("/" + field.resource);
          // @ts-ignore
          options = options.map(
            // @ts-ignore
            ({ [field.text]: text, [field.value]: value }) => ({ text, value })
          );
          field.options = options;
        }
      }
      setFields(fieldsCfg);
    }
    getData();
    getFk();
  }, []);

  const save = (data: any, e: any) => {
    console.log(data);
    console.log(e);
  };
  const saveAndClose = () => {};

  const Actions = [
    <Button variant="contained" id="save" color="primary">
      Save
    </Button>,
    <Button variant="contained" id="save-and-close" color="primary">
      Save and close
    </Button>,
  ];

  if (loading || !data) return <div>loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <Box p={2}>
      <Form
        handleSubmit={save}
        fields={fields}
        actions={Actions}
        data={data}
      ></Form>
    </Box>
  );
}
