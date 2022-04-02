import React, { useState, useCallback, FC } from "react";
import Field from "./Field";
import Button from "@material-ui/core/Button";
import Box from "@mui/material/Box";
import { Grid } from "@material-ui/core";
import { Typography } from "@mui/material";

interface FormProps {
  fields: any;
  handleSubmit?: (data: any, e?: any) => void;
  actions?: Array<any>;
  data?: any;
}

const Form: FC<FormProps> = (props: any) => {
  const { fields, actions = [], data: defaultData = {}, handleSubmit } = props;
  const [data, setData] = useState(defaultData);
  //const updateValue = //useCallback(
  const updateValue = (name: string) => {
      return (value: any) => {
        console.log("update value:" + name + ":" + value);
        setData({
          ...data,
          [name]: value,
        });
      };
    };
    //[setForm, form]
  //);

  const submit = (e: any) => {
    handleSubmit(data);
  };

  const clone = (el: any) => React.cloneElement(el, {
    onClick: (e: any) => {
      if (handleSubmit) {
        handleSubmit(data, e);
      }
    }
  });

  return (
    <Box p={2}>
      <form>
        {fields.map((field: any) => {
          const fieldName: string = field.name;
          //@ts-ignore
          const value = form[fieldName] || '';
          
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
                {clone(action)}
                &nbsp;
              </>
            ))
          ) : (
            <>
              <Button variant="contained" onClick={submit} color="primary">
                Save
              </Button>
            </>
          )}
        </Grid>
      </form>
      <p>
        <code>{JSON.stringify(data, null, 4)}</code>
      </p>
    </Box>
  );
};

export default Form;
