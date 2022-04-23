import React, { Fragment, useEffect, useState } from 'react';
import { useAsyncDebounce } from 'react-table';
import { Text } from 'form/Text';
import { Select } from 'form/Select';
// A great library for fuzzy filtering/sorting items
//import matchSorter from 'match-sorter';

function GlobalFilter({
  preGlobalFilteredRows,
  globalFilter,
  setGlobalFilter,
}: any) {
  const count = preGlobalFilteredRows.length;
  const [value, setValue] = React.useState(globalFilter);
  const onChange = useAsyncDebounce((value) => {
    setGlobalFilter(value || undefined);
  }, 200);

  return (
    <span>
      Search:{' '}
      <Text
        value={value || ''}
        onChange={(value: string) => {
          setValue(value);
          onChange(value);
        }}
        placeholder={`${count} records...`}
      />
    </span>
  );
}

function DefaultFilter({ column: { filterValue, setFilter, id }, ...rest }: any) {
  useEffect(() => {
    return () => {
      //setFilter(undefined);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  //const [value, setValue] = useState(filterValue);
  //console.log(value);
  return (
    <Text
      id={id}
      label={id}
      value={filterValue}
      variant="filled"
      onChange={(value: string) => {
        //setValue(value);
        setFilter(value);
      }}
      fullWidth={false}
    />
  );
}

function SelectFilter({
  column: { filterValue, setFilter, preFilteredRows, id },
}: any) {
  useEffect(() => {
    return () => {
      //setFilter(undefined);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  const options = React.useMemo(() => {
    const values = new Set<any>();
    preFilteredRows.forEach((row: any) => values.add(row.values[id]));
    const data = Array.from(values).map((o) => ({ text: o, value: o }));
    data.unshift({ text: 'All', value: undefined });
    return data;
  }, [id, preFilteredRows]);

  return (
    <Select
      id={id}
      label={id}
      value={filterValue}
      onChange={setFilter}
      options={options}
      variant="filled"
      sx={{ width: 'auto', minWidth: '200px' }}
    ></Select>
  );
}

function SliderFilter({
  column: { filterValue, setFilter, preFilteredRows, id },
}: any) {
  useEffect(() => {
    return () => {
      setFilter(undefined);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [min, max] = React.useMemo(() => {
    let min = preFilteredRows.length ? preFilteredRows[0].values[id] : 0;
    let max = preFilteredRows.length ? preFilteredRows[0].values[id] : 0;
    preFilteredRows.forEach((row: any) => {
      min = Math.min(row.values[id], min);
      max = Math.max(row.values[id], max);
    });
    return [min, max];
  }, [id, preFilteredRows]);

  return (
    <>
      <Text
        variant="standard"
        type="range"
        min={min}
        max={max}
        value={filterValue || min}
        onChange={(value: string) => {
          setFilter(parseInt(value, 10));
        }}
      />
      <button onClick={() => setFilter(undefined)}>Off</button>
    </>
  );
}

function RangeFilter({
  column: { filterValue = [], preFilteredRows, setFilter, id },
}: any) {
  useEffect(() => {
    return () => {
      setFilter(undefined);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [min, max] = React.useMemo(() => {
    let min = preFilteredRows.length ? preFilteredRows[0].values[id] : 0;
    let max = preFilteredRows.length ? preFilteredRows[0].values[id] : 0;
    preFilteredRows.forEach((row: any) => {
      min = Math.min(row.values[id], min);
      max = Math.max(row.values[id], max);
    });
    return [min, max];
  }, [id, preFilteredRows]);

  return (
    <Fragment>
      <Text
        value={filterValue[0] || ''}
        type="number"
        onChange={(e: any) => {
          const val = e.target.value;
          setFilter((old = []) => [
            val ? parseInt(val, 10) : undefined,
            old[1],
          ]);
        }}
        placeholder={`Min (${min})`}
      />{' '}
      to
      <Text
        value={filterValue[1] || ''}
        type="number"
        onChange={(e: any) => {
          const val = e.target.value;
          setFilter((old = []) => [
            old[0],
            val ? parseInt(val, 10) : undefined,
          ]);
        }}
        placeholder={`Min (${min})`}
      />
    </Fragment>
  );
}

// Add new filter or override existing filters, use with UseMemo
const filterTypes = {
  //fuzzyText: fuzzyTextFilterFn,
};

// Define a custom filter filter function!
function filterGreaterThan(rows: any[], id: string, filterValue: string) {
  return rows.filter((row) => {
    const rowValue = row.values[id];
    return rowValue >= filterValue;
  });
}

filterGreaterThan.autoRemove = (val: string | number) =>
  typeof val !== 'number';

export {
  GlobalFilter,
  DefaultFilter,
  SelectFilter,
  SliderFilter,
  RangeFilter,
  filterTypes,
  filterGreaterThan,
};
