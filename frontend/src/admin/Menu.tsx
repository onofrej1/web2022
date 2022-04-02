import Paper from "@mui/material/Paper";
import MenuList from "@mui/material/MenuList";
import MenuItem from "@mui/material/MenuItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import ContentCut from "@mui/icons-material/ContentCut";
import ContentPaste from "@mui/icons-material/ContentPaste";
import { Link } from "react-router-dom";
import resources from "../entities/index";
import SaveIcon from '@mui/icons-material/Save';
import React from "react";

const menuIcons: any = {
  contentCut: ContentCut,
  saveIcon: SaveIcon,
}

const cloneMenuItem = (el: any) => React.cloneElement(el, {
  fontSize: 'small',
});

export default function Menu() {
  const items = Object.keys(resources).map((resourceKey: any) => {
    // @ts-ignore
    const resource: any = resources[resourceKey];
    console.log(resource);
    const icon = menuIcons[resource.menuIcon] ? menuIcons[resource.menuIcon] : ContentCut;
    const menuItem = {
      resource: resource.resource,
      title: resource.name,
      icon: cloneMenuItem(icon),
    };
    return menuItem;
  });

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
