import Form from "../form/Form";
import { FC, useEffect, useState } from "react";
import resources from "../entities/index";
import useFetch from "use-http";
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import settings from './settings';
import { getValue } from "./utils";
import { Box, Button } from "@mui/material";

interface AdminFormProps {
  resource: {
    name: string;
    title: string;
    rowId: number;
  };
  dispatch: Function;
}

export default function AdminForm({ resource, dispatch }: AdminFormProps) {
  const { get, post, patch, loading, error } = useFetch(settings.baseUrl);
  const [fields, setFields] = useState([] as any[]);
  const [data, setData] = useState();

  // @ts-ignore
  const config = resources[resource.name];
  const formConfig: any[] = config.form;

  useEffect(() => {
    async function getData() {
      const url = `/${resource.name}/${resource.rowId}`;
      const data = await get(url);

      Object.keys(data).forEach((key: string) => {
        data[key] = getValue(data[key]);
      });
      setData(data);
    }
    async function getOptions() {
      for (const field of formConfig) {
        if (
          ["foreignKey", "many2many"].includes(field.type) &&
          field.resource
        ) {
          let options = await get("/" + field.resource);
          options = options.map((option: any) => {
            const text = field.textRender ? field.textRender(option) : option[field.text];
            const value = option[field.value];
            return { text, value };
          });
          field.options = options;
        }
      }
      setFields(formConfig);
    }
    getData();
    getOptions();
  }, []);

  const handleSubmit = async(data: any, e: any) => {
    console.log('submit');
    const button = e.target;
    console.log(e.target);

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
