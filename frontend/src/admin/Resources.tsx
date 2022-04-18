import React from 'react';
import { useReducer } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Grid, Typography } from '@mui/material';
import List from 'admin/List';
import { Form } from 'admin/Form';
import resources from 'resources/index';

const defaultState = {
  name: 'posts',
  page: 'list',
  rowId: null,
  data: null,
};

export const Resources = () => {
  const params = useParams();
  const resource = params.resource;

  const [state, dispatch] = useReducer((state: any, action: any) => {
    switch (action.type) {
      case 'setName':
        return {
          ...state,
          name: action.name,
        };
      case 'showList':
        return {
          ...state,
          page: 'list',
        };
      case 'showForm':
        return {
          ...state,
          page: 'form',
          rowId: action.rowId,
        };
      default:
        return state;
    }
  }, defaultState);

  if (resource && state.name !== params.resource) {
    dispatch({ type: 'setName', name: params.resource });
    if (state.type !== 'list') {
      dispatch({ type: 'showList' });
    }
  }
  // @ts-ignore
  const config = resources[resource];

  return (
    <div>
      {state.page === 'list' && 
      <>
        <Box sx={{ display: 'flex', justifyContent: 'space-between'}}>
          <Box m={2}>
            <Typography variant="h4" component="div">
              {config.name} list
            </Typography>
          </Box>
          <Box sx={{ m: 2, mt: 3, width: '300px' }} id="table-search"></Box>
        </Box>
        <List resource={state} dispatch={dispatch} />
      </>}
      {state.page === 'form' && 
        <>
          <Box m={2}>
            <Typography variant="h4" component="div">
              {state.action === 'add' ? 'Add new' : 'Edit'}{' '}
              {config.name}
            </Typography>
          </Box>
          <Form resource={state} dispatch={dispatch} />
        </>
      }
    </div>
  );
};