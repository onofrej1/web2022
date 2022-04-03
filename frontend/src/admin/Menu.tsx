import React from 'react';
import ContentCut from '@mui/icons-material/ContentCut';
import { Link } from 'react-router-dom';
import resources from '../entities/index';
import SaveIcon from '@mui/icons-material/Save';
import { ListItemIcon, ListItemText, MenuItem, MenuList, Paper } from '@mui/material';

const menuIcons: any = {
  contentCut: ContentCut,
  saveIcon: SaveIcon,
}

/*const addMenuItemProps = (el: React.ReactElement<any>) => React.cloneElement(el, {
  fontSize: 'small',
});*/

export default function Menu() {
  const items = Object.keys(resources).map((resourceKey: any) => {
    // ts-ignore
    const resource: any = resources[resourceKey];
    const Icon = menuIcons[resource.menuIcon] ? menuIcons[resource.menuIcon] : ContentCut;
    //const MenuIcon = addMenuItemProps(Icon);
    //console.log(MenuIcon);
    const menuItem = {
      resource: resource.resource,
      title: resource.name,
      icon: <Icon />,
    };
    return menuItem;
  });

  return (
    <Paper sx={{ width: 220, height: '100vh' }}>
      <MenuList>
        {items.map((item) => {
          return (
            <MenuItem key={item.title} sx={{ mb: 1 }}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText>
                <Link
                  style={{ textDecoration: 'none', color: 'black' }}
                  to={`entity/${item.resource}`}
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
