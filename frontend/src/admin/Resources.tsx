import List from './List';
import { useReducer } from 'react';
import { useParams } from 'react-router-dom';
import Form from './Form';
import resources from '../entities/index';
import { Box, Typography } from '@mui/material';

const defaultState = {
  name: 'posts',
  page: 'list',
  rowId: null,
  data: null,
};

const Resources = () => {
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
  }
  // @ts-ignore
  const config = resources[resource];

  return (
    <div>
      {state.page === 'list' && 
      <>
        <Box m={2}>
          <Typography variant="h4" component="div">
            {config.name} list
          </Typography>
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

export { Resources };
