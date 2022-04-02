import React, { FC } from "react";
import resources from "../entities/index";
import { useTable } from "react-table";
import useAxios from "../useAxios";
import PropTypes from "prop-types";
import { Box, Table, Button, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import settings from './settings';
import useFetch from "use-http";

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
  const columnsStr = JSON.stringify(tableColumns);
  const columns: any = React.useMemo(() => tableColumns, [columnsStr]);
  // @ts-ignore
  const config = resources[resourceName];

  const url = `${settings.baseUrl}/${resourceName}`;
  const { data = [], loading, error } = useFetch(url, [url]);

  const addItem = () => {
    dispatch({ type: 'showForm' });
  };

  const editItem = (row: any) => {
    const rowId = row.original[settings.primaryKey];
    dispatch({ type: "showForm", rowId });
  };
  const {
    getTableProps,
    headerGroups,
    rows,
    prepareRow,
    // getTableBodyProps,
  } = useTable({ columns, data });

  if (loading) return <div>loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <Box m={2}>
        <Button variant="contained" onClick={addItem} color="primary">
          Add new {config.name}
        </Button>
      </Box>
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
