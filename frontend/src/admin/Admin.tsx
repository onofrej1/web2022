import React from 'react';

import AdminContext from 'admin/AdminContext';

const Admin = (props: any) => {
  const {
    children,
  } = props;

  const AdminDataProvider: any = {};

  return (
    <AdminContext dataProvider={AdminDataProvider}>
      {children}
    </AdminContext>
  );
};

export default Admin;
