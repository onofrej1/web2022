import Paper from "@mui/material/Paper";
import MenuList from "@mui/material/MenuList";
import MenuItem from "@mui/material/MenuItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import ContentCut from "@mui/icons-material/ContentCut";
import ContentPaste from "@mui/icons-material/ContentPaste";
import { Link } from "react-router-dom";

export default function Menu() {
  const items = [
    {
      resource: "posts",
      title: "Posts",
      icon: <ContentCut fontSize="small" />,
    },
    {
      resource: "users",
      title: "Users",
      icon: <ContentPaste fontSize="small" />,
    },
  ];

  return (
    <Paper sx={{ width: 220, height: "100vh" }}>
      <MenuList>
        {items.map((item) => {
          return (
            <MenuItem key={item.title} sx={{ mb: 1 }}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText>
                <Link
                  style={{ textDecoration: "none", color: "black" }}
                  to={"entity/" + item.resource}
                >
                  {item.title}
                </Link>
              </ListItemText>
            </MenuItem>
          );
        })}
      </MenuList>
    </Paper>
  );
}
