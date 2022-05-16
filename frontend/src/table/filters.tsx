import React, { Fragment, useState } from 'react';
import { Text } from 'form/Text';
import { Select } from 'form/Select';
import { Box, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ReactDOM from 'react-dom';

const InputProps= {
  style: {
    height: '40px',
  },
};

interface GlobalFilterProps {
  globalFilter: any;
  setGlobalFilter: (filterValue: any) => void;
  totalRows: number;
}

const GlobalFilter = ({
  globalFilter,
  setGlobalFilter,
  totalRows,
}: GlobalFilterProps) => {
  const [element, setElement] = useState();

  // override big top padding for "filled" variant, add bottom padding to icon
  const sxProps = {
    minWidth: 200,
    '& .MuiFilledInput-input': {
      paddingTop: '14px !important',
    },
    '& .MuiInputAdornment-filled': {
      paddingBottom: '5px !important',
    },
  };

  const Filter = (
    <Box>
      <Text
        variant="filled"
        value={globalFilter || ''}
        onChange={(value) => {
          setGlobalFilter(value);
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          )
        }}
        placeholder={`${totalRows} records...`}
        sx={sxProps}
      />
    </Box>
  );

  React.useEffect(() => {
    setElement(document.getElementById('table-search') as any);
  }, []);

  if(!element) return null;

  return ReactDOM.createPortal(Filter, element);
};

function DefaultFilter({ column: { filterValue, setFilter, id }, disabled  }: any) {
  return (
    <Text
      id={id}
      value={filterValue}
      placeholder=""
      variant="filled"
      disabled={disabled}
      onChange={(value) => {
        setFilter(value);
      }}
      fullWidth={false}
      InputProps={InputProps}
    />
  );
}

function SelectFilter({
  column: { filterValue, setFilter, preFilteredRows, id },
}: any) {
  const options = React.useMemo(() => {
    const values = new Set<any>();
    preFilteredRows.forEach((row: any) => values.add(row.values[id]));
    const data = Array.from(values).map((o) => ({ text: o, value: o }));
    data.unshift({ text: 'All', value: null });
    return data;
  }, [id, preFilteredRows]);

  // override top padding for "filled" variant
  const sxProps = {
    minWidth: 200,
    '& .MuiFilledInput-input': {
      paddingTop: '14px !important',
    },
  };

  return (
    <Select
      id={id}
      value={filterValue}
      onChange={setFilter}
      options={options}
      variant="filled"
      fullWidth={false}
      sx={sxProps}
      InputProps={InputProps}
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
        onChange={(value) => {
          setFilter(value);
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
        placeholder={`Max (${max})`}
      />
    </Fragment>
  );
}

// Add new filter or override existing filters, use with UseMemo
const filterTypes = {};

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
