import React, { FC, useState } from "react";
import resources from "../entities/index";
import { useTable } from "react-table";
import useAxios from "../useAxios";
import PropTypes from "prop-types";
import {
  Box,
  Table,
  Button,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Select,
  Menu,
  MenuItem,
  TextField,
  IconButton,
} from "@mui/material";
import settings from "./settings";
import useFetch from "use-http";
import ClearIcon from '@mui/icons-material/Clear';

const configKeys: any = {
  header: "Header",
  render: "accessor",
};

const mapConfig = (config: any) => {
  return Object.keys(config).reduce((obj: any, key: any) => {
    const newKey: string = configKeys[key] || key;
    obj[newKey] = config[key];
    return obj;
  }, {});
};

const getTableColumns = (resource: string) => {
  // @ts-ignore
  const config = resources[resource];
  let fields = config.list;
  if (!fields) {
    return "Missing list configuration.";
  }
  const columns: any[] = [];
  fields.forEach((list: any) => {
    list = mapConfig(list);
    const { name, type } = list;
    let accessor: any = name;
    if (type === "many2many") {
      accessor = (data: any) => {
        const values = data[name];
        return values
          ? values.map((item: any) => item[list.show]).join(", ")
          : null;
      };
    }
    if (type === "foreignKey") {
      accessor = (data: any) => {
        return data[name] ? data[name][list.show] : null;
      };
    }
    accessor = list.accessor ? list.accessor : accessor;
    const col: any = {
      Header: name,
      accessor,
    };
    columns.push(col);
  });
  return columns;
};

interface ListProps {
  resource: {
    name: string;
    title: string;
  };
  dispatch: Function;
}

const List: FC<ListProps> = ({ resource, dispatch }) => {
  const resourceName = resource.name;
  const tableColumns = getTableColumns(resourceName);
  const [filters, setFilters] = useState([] as any[]);
  const columnsStr = JSON.stringify(tableColumns);
  const columns: any = React.useMemo(() => tableColumns, [columnsStr]);
  // @ts-ignore
  const config = resources[resourceName];

  const url = `${settings.baseUrl}/${resourceName}`;
  const { data = [], loading, error } = useFetch(url, [url]);

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const addFilter = (filter: any) => {
    setAnchorEl(null);
    if (filter.type === 'select') {
      filter.options = data.map((value: any) => {
        const option = value[filter.name];
        return { value: option, text: option };
      });
    }
    filters.push(filter);
    setFilters(filters);
  };

  const removeFilter = (filterName: string) => {
    const newFilters = filters.filter((filter: any) => filter.name !== filterName);
    setFilters(newFilters);
  }

  const handleFilterChange = (e: any) => {
    console.log(e.target);
    const filterName = e.target.name;
    const filter = filters.find((f) => f.name === filterName);
    filter.value = e.target.value;
    setFilters([...filters]);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const addItem = () => {
    dispatch({ type: "showForm" });
  };

  const editItem = (row: any) => {
    const rowId = row.original[settings.primaryKey];
    dispatch({ type: "showForm", rowId });
  };

  const filteredData = data.filter((value: any) => {
    let show = true;
    filters.forEach((filter: any) => {
      if (filter.value === '' || filter.value === undefined) return;
      if (filter.op === 'eq') {
        show = value[filter.name] === filter.value;
      }
      if (filter.op === 'contains') {
        show = value[filter.name].includes(filter.value);
      }
    });
    return show;
  });

  const {
    getTableProps,
    headerGroups,
    rows,
    prepareRow,
    // getTableBodyProps,
  } = useTable({ columns, data: filteredData });

  if (loading) return <div>loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <Box m={2}>
        <Button variant="contained" onClick={addItem} color="primary">
          Add new {config.name}
        </Button>
      </Box>
      <Box alignItems={"end"}>
        <Button
          id="basic-button"
          aria-controls={open ? "basic-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          onClick={handleClick}
        >
          Filter
        </Button>
        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            "aria-labelledby": "basic-button",
          }}
        >
          {config.filter.map((filter: any) => {
            return (
              <MenuItem onClick={() => addFilter(filter)}>
                {filter.name}
              </MenuItem>
            );
          })}
        </Menu>
      </Box>
      <Box>
        {filters.map((filter: any) => {
          return (
            <>
              {filter.type === "text" && (
                <TextField
                  name={filter.name}
                  value={filter.value}
                  onChange={handleFilterChange}
                  size="small"
                ></TextField>
              )}
              {filter.type === "select" && (
                <Select
                size="small"
                name={filter.name}
                value={filter.value}
                onChange={handleFilterChange}
                sx={{ minWidth: 120 }}
            >
                {filter.options.map((option: any) => <MenuItem key={option.value} value={option.value}>{option.text}</MenuItem>)}
            </Select>
              )}
              <IconButton onClick={() => removeFilter(filter.name)}>
                <ClearIcon />
              </IconButton>
            </>
          );
        })}
      </Box>
      <code>{JSON.stringify(filters, null, 4)}</code>

      <Table {...getTableProps()}>
        <TableHead>
          {headerGroups.map((headerGroup) => (
            <TableRow {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <TableCell {...column.getHeaderProps()}>
                  {column.render("Header")}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableHead>
        <TableBody>
          {rows.map((row, i) => {
            prepareRow(row);
            return (
              <TableRow {...row.getRowProps()}>
                {row.cells.map((cell) => {
                  return (
                    <TableCell {...cell.getCellProps()}>
                      {cell.render("Cell")}
                    </TableCell>
                  );
                })}
                <TableCell>
                  <Button onClick={() => editItem(row)}>Edit</Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

/*List.propTypes = {
    resource: PropTypes.shape({
        name: PropTypes.string,
        title: PropTypes.string,
    })
}*/

export default List;
