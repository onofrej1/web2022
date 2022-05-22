import React from 'react';
import ContentCut from '@mui/icons-material/ContentCut';
import { Link } from 'react-router-dom';
import { resources } from '../resources/index';
import SaveIcon from '@mui/icons-material/Save';
import {
  Box,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
} from '@mui/material';

const menuIcons: any = {
  contentCut: ContentCut,
  saveIcon: SaveIcon,
};

/*const addMenuItemProps = (el: React.ReactElement<any>) => React.cloneElement(el, {
  fontSize: 'small',
});*/

export default function Menu(props: any) {
  const { open } = props;
  const items = Object.keys(resources).map((resourceKey: any) => {
    // @ts-ignore
    const resource: any = resources[resourceKey];
    const Icon = menuIcons[resource.menuIcon]
      ? menuIcons[resource.menuIcon]
      : ContentCut;
    //const MenuIcon = addMenuItemProps(Icon);
    const menuItem = {
      resource: resource.resource,
      title: resource.name,
      icon: <Icon />,
    };
    return menuItem;
  });

  const drawerWidth = 240;

  const openedMixin = (theme: any) => ({
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
  });
  
  const closedMixin = (theme: any) => ({
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up('sm')]: {
      width: `calc(${theme.spacing(8)} + 1px)`,
    },
  });

  return (
    <Drawer
      open={open}
      variant="permanent"
      sx={(theme: any) => ({
        width: drawerWidth,
        flexShrink: 0,
        ...(open && {
          ...openedMixin(theme),
          '& .MuiDrawer-paper': openedMixin(theme),
        }),
        ...(!open && {
          ...closedMixin(theme),
          '& .MuiDrawer-paper': closedMixin(theme),
        }),
      })}
    >
      <Toolbar />
      <Box sx={{ overflow: 'auto' }}>
        <List>
          {items.map((item) => (
            <>
              <ListItem
                button
                component={(props) => (
                  <Link {...props} to={`entity/${item.resource}`} />
                )}
                key={item.title}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.title}>{item.title}</ListItemText>
              </ListItem>
              <Divider />
            </>
          ))}
        </List>
      </Box>
    </Drawer>
  );
}
