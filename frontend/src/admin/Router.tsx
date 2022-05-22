import { RequireAuth } from 'AppNew';
import React from 'react';
import { useRoutes, BrowserRouter } from 'react-router-dom';
import { Layout } from './Layout';
import { Login } from './Login';
import { Resources } from './Resources';

const DashboardComponent = () => {
  return <h1>component</h1>;
};

const RenderRoutes = (props: any) => {
  const { routes: customRoutes = [] } = props;
  const baseRoutes = [
    {
      path: 'login',
      element: <Login />,
    },
  ];
  const resources = [
    {
      path: 'entity/:resource',
      element: (
        <RequireAuth>
          <Resources />
        </RequireAuth>
      ),
    },
  ];

  const routes = [
    {
      path: '/admin',
      element: <Layout />,
      children: [{ path: 'dashboard', element: <DashboardComponent /> }]
        .concat(resources)
        .concat(customRoutes),
    },
  ];
  return [...routes /*, ...baseRoutes*/];
  //return useRoutes([...routes, ...baseRoutes]);
};

const AdminRouter = (props: any) => {
  const { routes } = props;

  return <BrowserRouter>{/*<RenderRoutes routes={routes} />*/}</BrowserRouter>;
};
const routes = RenderRoutes({});
export { routes, AdminRouter };
