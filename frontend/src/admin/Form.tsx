import { Box, Button } from "@material-ui/core";
import useAxios from "../useAxios";
import Form from "../Form/Form";
import { FC } from "react";
import resources from "../entities/index";

interface AdminFormProps {
  resource: {
    name: string;
    title: string;
    rowId: number;
  };
  dispatch: Function;
}

export default function AdminForm({ resource, dispatch }: AdminFormProps) {
  const {
    data = {},
    loading,
    error,
  } = useAxios({
    method: "get",
    url: "/" + resource.name + "/" + resource.rowId,
  });

  const save = () => {
    console.log("save");
  };

  // @ts-ignore
  const config = resources[resource.name];
  const fields = config.form;

  const saveAndClose = () => {};

  const Actions = [
    <Button variant="contained" onClick={save} color="primary">
      Save
    </Button>,
    <Button variant="contained" onClick={saveAndClose} color="primary">
      Save and close
    </Button>,
  ];

  if (loading) return <div>loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <Box p={2}>
      <Form fields={fields} actions={Actions} data={data}></Form>
    </Box>
  );
}
