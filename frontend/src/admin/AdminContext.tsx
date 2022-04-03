import DataProviderContext from './DataProviderContext';
import React  from 'react';

function AdminContext(props: any) {
  const { children, dataProvider } = props;

  return (
    <DataProviderContext.Provider value={dataProvider}>
      {children}
    </DataProviderContext.Provider>
  );
}

export default AdminContext;
