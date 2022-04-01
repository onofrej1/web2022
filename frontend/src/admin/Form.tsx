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

export default function AdminForm({ resource, dispatch }: AdminFormProps) {
  const { get, loading, error } = useFetch('http://localhost:8000/api');
  const [fields, setFields] = useState([] as any[]);
  const [data, setData] = useState();

  // @ts-ignore
  const config = resources[resource.name];
  const fieldsCfg: any[] = config.form;

  useEffect(() => {
    async function getData() {
      const url = "/"+resource.name + "/" + resource.rowId;
      const data = await get(url);
      
      setData(data);
    }
    async function getFk() {
      for (const field of fieldsCfg) {
        if (['foreignKey', 'many2many'].includes(field.type) && field.resource) {
          let options = await get('/'+ field.resource);
          // @ts-ignore
          options = options.map(({ [field.text]: text, [field.value]: value }) => ({ text, value }));
          field.options = options;
        }
      }
      setFields(fieldsCfg);
    }
    getData();
    getFk();
    //getFk().then(getData);
    //Promise.all([getData, getFk]);
 }, []);


  const save = () => {
    console.log("save");
  };
  const saveAndClose = () => {};

  const Actions = [
    <Button variant="contained" onClick={save} color="primary">
      Save
    </Button>,
    <Button variant="contained" onClick={saveAndClose} color="primary">
      Save and close
    </Button>,
  ];

  if (loading || !data) return <div>loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <Box p={2}>
      <Form fields={fields} actions={Actions} data={data}></Form>
    </Box>
  );
}
