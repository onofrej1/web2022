import MaUTable from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import React, { FC } from "react";
import resources from "../entities/index";
import { useTable } from "react-table";
import useAxios from "../useAxios";
import PropTypes from "prop-types";
import { Button } from "@mui/material";
import { Box } from "@material-ui/core";

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
    const col: any = {
      Header: name,
      accessor: name,
    };
    if (type === "many2many") {
      col.accessor = (data: any) => {
        const values = data[name];
        return values
          ? values.map((item: any) => item[list.show]).join(", ")
          : null;
      };
    }
    if (type === "foreignKey") {
      col.accessor = (data: any) => {
        return data[list.show];
      };
    }
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

  const {
    data = [],
    loading,
    error,
  } = useAxios({
    method: "get",
    url: "/" + resourceName,
  });

  const add = () => {
    dispatch({ type: 'showForm' });
  };

  const edit = (rowId: number | string) => {
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
        <Button variant="contained" onClick={add} color="primary">
          Add new {resourceName}
        </Button>
      </Box>
      <MaUTable {...getTableProps()}>
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
                  <Button onClick={() => edit(row.id)}>Edit</Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </MaUTable>
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
