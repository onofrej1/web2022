import { Box, Button } from "@material-ui/core";
import useAxios from "../useAxios";
import Form from "../form/Form";
import { FC, useEffect, useState } from "react";
import resources from "../entities/index";
import useFetch from "use-http";
import CheckIcon from '@mui/icons-material/Check';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';

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
  const { get, post, patch, loading, error } = useFetch("http://localhost:8000/api");
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

  const handleSubmit = async(data: any, e: any) => {
    console.log(data);
    console.log(e);
    const button = e.target.parentNode;
    if (button.id === 'cancel') {
      dispatch({ type: "showList" });
      return;
    }

    if (button.id === 'save-and-close') {
      dispatch({ type: "showList" });
    }
    return;
    if (data.pk) {
      const url = `/${resource.name}/${resource.rowId}/`;
      patch(url, data);
    } else {
      const url = `/${resource.name}`;
      post(url, data);
    }
  };
  const saveAndClose = () => {
    dispatch({ type: "list" });
  };
 
  const Actions = [
    <Button variant="contained" id="cancel" color="secondary">
      <CancelIcon fontSize="small" /> Cancel
    </Button>,
    <Button variant="contained" id="save" color="primary">
      <SaveIcon fontSize="small" /> Save
    </Button>,
    <Button variant="contained" id="save-and-close" color="primary">
      <SaveIcon fontSize="small" /> Save and close
    </Button>,
  ];

  if (loading || !data) return <div>loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <Box p={2}>
      <Form
        handleSubmit={handleSubmit}
        fields={fields}
        actions={Actions}
        data={data}
      ></Form>
    </Box>
  );
}
