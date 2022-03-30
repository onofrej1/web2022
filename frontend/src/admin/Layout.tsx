import { Box } from "@mui/system";
import AppBar from "./AppBar";
import Menu from "./Menu";
import { Outlet } from "react-router-dom";

const Layout = () => {
  const BoxStyles = {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: 1,
    gridTemplateRows: "auto",
    gridTemplateAreas: `"header header header header"
        "sidebar main main main"
        "footer footer footer footer"`,
  };

  return (
    <>
      <Box sx={BoxStyles}>
        <Box sx={{ gridArea: "header" }}>
          <AppBar />
        </Box>
        <Box sx={{ gridArea: "main" }}>
          <Outlet />
        </Box>
        <Box sx={{ gridArea: "sidebar" }}>
          <Menu />
        </Box>
        <Box sx={{ gridArea: "footer" }}>Footer</Box>
      </Box>
    </>
  );
};

export { Layout };
