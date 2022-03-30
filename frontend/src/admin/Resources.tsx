import List from "./List";
import { useReducer } from "react";
import { useParams } from "react-router-dom";
import Form from "./Form";
import resources from "../entities/index";
import { Box, Typography } from "@material-ui/core";

const defaultState = {
  name: "posts",
  action: "list",
  rowId: null,
  data: null,
};

const Resources = () => {
  const params = useParams();
  const resource = params.resource;

  const [state, dispatch] = useReducer((state: any, action: any) => {
    switch (action.type) {
      case "setName":
        return {
          ...state,
          name: action.name,
        };
      case "add":
        return {
          ...state,
          action: action.name,
        };
      case "edit":
        return {
          ...state,
          action: "edit",
          rowId: action.rowId,
        };
      /*case "setData":
        return {
          ...state,
          data: action.data,
        };*/
      default:
        return state;
    }
  }, defaultState);

  /*const fetchResource = useMemo(async() => {
      const { request } = useAxios({
        method: "get",
        url: "/" + state.name +"/"+state.rowId,
      });
      const data = await request;
      dispatch({ type: "setData", data });
  }, [state.rowId]);*/

  if (resource && state.name !== params.resource) {
    dispatch({ type: "setName", name: params.resource });
  }

  console.log(state);
  // @ts-ignore
  const config = resources[resource];

  return (
    <div>
      {state.action === "list" && 
      <>
        <Box m={2}>
          <Typography variant="h4" component="div">
            {config.name} list
          </Typography>
        </Box>
        <List resource={state} dispatch={dispatch} />
      </>}
      {["add", "edit"].includes(state.action) && (
        <>
          <Box m={2}>
            <Typography variant="h4" component="div">
              {state.action === "add" ? "Add new" : "Edit"}{" "}
              {config.name}
            </Typography>
          </Box>
          <Form resource={state} dispatch={dispatch} />
        </>
      )}
    </div>
  );
};

export { Resources };
