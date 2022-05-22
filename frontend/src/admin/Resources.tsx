import React from 'react';
import { useReducer } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import List from 'admin/List';
import { Form } from 'admin/Form';
import { resources } from 'resources/index';

type ResourcesState =
 | { name: string, view: 'list', rowId: null }
 | { name: string, view: 'form', rowId: string | null | undefined };

const defaultState: ResourcesState = {
  name: 'posts',
  view: 'list',
  rowId: null,
};

type ResourcesAction =
 | { type: 'setName', name: string }
 | { type: 'showList' }
 | { type: 'showForm', rowId?: string | null };

const Resources = () => {
  const params = useParams();
  const resourceName = params.resource || '';

  const [state, dispatch] = useReducer((state: ResourcesState, action: ResourcesAction): ResourcesState => {
    switch (action.type) {
      case 'setName':
        return {
          ...state,
          rowId: null,
          view: 'list',
          name: action.name,
        };
      case 'showList':
        return {
          ...state,
          view: 'list',
          rowId: null,
        };
      case 'showForm':
        return {
          ...state,
          view: 'form',
          rowId: action.rowId,
        };
      default:
        return { ...state };
    }
  }, defaultState);

  if (resourceName && state.name !== resourceName) {
    dispatch({ type: 'setName', name: resourceName });
  }
  const config = resources.find(r => r.resource === resourceName);
  if (!config) {
    throw 'Missing resource configuration.';
  }

  const tableSearchStyles = { m: 2, mt: 3, width: '300px' };
  const listWrapperStyles = { display: 'flex', justifyContent: 'space-between'};

  return (
    <>
      <div id="confirmDialog" style={{ zIndex: 999 }}></div>

      {state.view === 'list' &&
      <>
        <Box sx={listWrapperStyles}>
          <Box m={2}>
            <Typography variant="h4" component="div">
              {config.name} list
            </Typography>
          </Box>
          <Box sx={tableSearchStyles} id="table-search"></Box>
        </Box>
        <List resource={state} dispatch={dispatch} />
      </>}
      {state.view === 'form' &&
          <Form resource={state} dispatch={dispatch} />
      }
    </>
  );
};

export { Resources };
export type { ResourcesState, ResourcesAction };

