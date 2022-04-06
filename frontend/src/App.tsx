import Admin from './admin/Admin';
import React from 'react';

export default function App() {
  const CustomElement = () => {
    return <div>Custom route</div>;
  };

  const routes = [{ path: 'custom', element: <CustomElement /> }];

  return (
    <>
      <Admin routes={routes}></Admin>
    </>
  );
}
