import { useEffect, useReducer } from 'react';

const initialState = {
  queryPageIndex: 0,
  queryPageSize: 5,
  totalCount: null,
};

const PAGE_CHANGED = 'PAGE_CHANGED';
const PAGE_SIZE_CHANGED = 'PAGE_SIZE_CHANGED';
const TOTAL_COUNT_CHANGED = 'TOTAL_COUNT_CHANGED';

const reducer = (state: any, { type, payload }: any) => {
  switch (type) {
    case PAGE_CHANGED:
      return {
        ...state,
        queryPageIndex: payload,
      };
    case PAGE_SIZE_CHANGED:
      return {
        ...state,
        queryPageSize: payload,
      };
    case TOTAL_COUNT_CHANGED:
      return {
        ...state,
        totalCount: payload,
      };
    default:
      throw new Error(`Unhandled action type: ${type}`);
  }
};

export const useTablePagination = () => {
  const [{ queryPageIndex, queryPageSize, totalCount }, dispatch] = useReducer(
    reducer,
    initialState
  );
  /*
  useEffect(() => {
    dispatch({ type: PAGE_CHANGED, payload: queryPageIndex });
  }, [queryPageIndex]);

  useEffect(() => {
    dispatch({ type: PAGE_SIZE_CHANGED, payload: queryPageSize });
    //gotoPage(0);
  }, [queryPageSize]);

  useEffect(() => {
    if (totalCount) {
      dispatch({
        type: TOTAL_COUNT_CHANGED,
        payload: totalCount,
      });
    }
  }, [totalCount]);*/

  return { PAGE_CHANGED, TOTAL_COUNT_CHANGED, PAGE_SIZE_CHANGED, queryPageIndex, queryPageSize, totalCount, dispatch };
};
