import React  from 'react';

import AdminContext from './AdminContext';
import Router from './Router';

const Admin = (props: any) => {
  const {
    //appLayout,
    //authProvider,
    //dataProvider,
    children,
    routes = [],
    dashboard,
    layout,
    theme,
    title = "Admin",
  } = props;

  const AdminDataProvider: any = {};

  return (
    <AdminContext dataProvider={AdminDataProvider}>
      <Router
        routes={routes}
        dashboard={dashboard}
        layout={layout}
        theme={theme}
        title={title}
        //{...props}
      >
        {children}
      </Router>
    </AdminContext>
  );
};

export default Admin;
