import React, { useState, useCallback, FC } from "react";
import Field from "./Field";
import Button from "@material-ui/core/Button";
import Box from "@mui/material/Box";
import { Grid } from "@material-ui/core";
import { Typography } from "@mui/material";

interface FormProps {
  fields: any;
  handleSubmit?: () => void;
  actions?: Array<any>;
  data?: any;
}

const Form: FC<FormProps> = (props: any) => {
  const { fields, data = {}, handleSubmit, actions = [] } = props;
  const [form, setForm] = useState(data);

  const updateValue = useCallback(
    (name) => {
      // console.log('update value '+name);
      return (value: any) => {
        console.log("update value:" + name + ":" + value);
        setForm({
          ...form,
          [name]: value,
        });
      };
    },
    [setForm, form]
  );

  const submit = (e: any) => {
    e.preventDefault();
  };
  console.log(form);

  return (
    <Box p={2}>
      <form onSubmit={submit}>
        {fields.map((field: any) => {
          const fieldName: string = field.name;
          //@ts-ignore
          const value = form[fieldName];
          return (
            <Box mb={2}>
              <Field
                {...field}
                onChange={updateValue(fieldName)}
                value={value}
                key={fieldName}
              />
            </Box>
          );
        })}
        <Grid container justify="flex-end">
          {actions.length ? (
            actions.map((action: any) => (
              <>
                {action}
                &nbsp;
              </>
            ))
          ) : (
            <>
              <Button variant="contained" onClick={handleSubmit} color="primary" type="submit">
                Save
              </Button>
            </>
          )}
        </Grid>
      </form>
      <p>
        <code>{JSON.stringify(form, null, 4)}</code>
      </p>
    </Box>
  );
};

export default Form;
