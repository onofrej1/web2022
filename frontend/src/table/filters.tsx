import React, { Fragment } from 'react';
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

function DefaultFilter({ column: { filterValue, setFilter, id } }: any) {
  return (
    <Text id={id} value={filterValue} variant="standard" onChange={setFilter} fullWidth={false} />
  );
}

function SelectFilter({
  column: { filterValue, setFilter, preFilteredRows, id },
}: any) {
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
      value={filterValue}
      onChange={setFilter}
      options={options}
      variant="standard"
      sx={{ verticalAlign: 'baseline' }}
    ></Select>
  );
}

function SliderFilter({
  column: { filterValue, setFilter, preFilteredRows, id },
}: any) {
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
  test: () => {},
  // Add a new fuzzyTextFilterFn filter type.
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
