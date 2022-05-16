import React from 'react';
import { Hooks } from 'react-table';
import { IndeterminateCheckbox } from './IndeterminateCheckbox';

interface SelectionHeaderType {
  getToggleAllRowsSelectedProps: () => JSX.Element;
}

const RowSelection = (hooks: Hooks) => {
  hooks.allColumns.push((columns) => {
    // works only for server side data
    return [
      {
        id: 'selection',
        disableFilters: true,
        Filter: () => null,
        Header: ({ getToggleAllRowsSelectedProps }: SelectionHeaderType) => (
          <div>
            <IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} sx={{ padding: 0 }} />
          </div>
        ),
        Cell: ({ row }: { row: { getToggleRowSelectedProps: any } }) => (
          <div>
            <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} sx={{ padding: 0 }} />
          </div>
        ),
      },
      ...columns,
    ];
  });
};

export { RowSelection };
