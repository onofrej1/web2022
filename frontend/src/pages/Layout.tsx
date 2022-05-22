import React from 'react';
import { Link, Outlet } from 'react-router-dom';

const Layout = () => {
  return (
    <div>
      <ul>
        <li>
          <Link to="/mypage">Public Page</Link>
        </li>
        <li>
          <Link to="/protected">Protected Page</Link>
        </li>
        <li>
          <Link to="/admin/entity/cost_center">Admin Page</Link>
        </li>
      </ul>

      <Outlet />
    </div>
  );
};

export { Layout };
