//import { RenderRoutes } from 'admin/Router';
import { routes } from 'admin/Router';
import * as React from 'react';
import {
  Link,
  useNavigate,
  useLocation,
  Outlet,
  useRoutes,
  Navigate,
} from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import theme from 'theme';
import { CssBaseline } from '@mui/material';
import settings from 'admin/settings';
import axios from 'axios';
import jwt from 'jwt-decode';
import useFetch, { Provider } from 'use-http';
import { useLocalStorage } from 'common/useLocalStorage';
//import { fakeAuthProvider } from './auth';

export default function App() {
  const appRoutes = [
    {
      path: '/',
      element: <Layout />,
      children: [
        {
          path: '/mypage',
          element: <PublicPage />,
        },
        {
          path: '/protected',
          element: (
            <RequireAuth>
              <ProtectedPage />
            </RequireAuth>
          ),
        },
      ],
    },
    {
      path: '/login',
      element: <LoginPage />,
    },
  ];

  const Routes = useRoutes([...routes, ...appRoutes]);

  //console.log(RenderRoutes({}));

  //const auth = useAuth();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Provider url="http://localhost:8000/api">
          <h1>Auth Example</h1>
          {Routes}
        </Provider>
      </AuthProvider>
    </ThemeProvider>
  );
}

function Layout() {
  return (
    <div>
      <AuthStatus />

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
}

interface AuthContextType {
  user: any;
  token: string;
  signin: (data: any, callback: VoidFunction) => void;
  signout: (callback: VoidFunction) => void;
}

const AuthContext = React.createContext<AuthContextType>(null!);

function AuthProvider({ children }: { children: React.ReactElement }) {
  const [user, setUser] = React.useState<any>(null);
  const [token, setToken] = useLocalStorage('token', '');
  const [refreshToken, setRefreshToken] = useLocalStorage('refreshToken', '');
  const { error, post, loading } = useFetch('http://localhost:8000/api');

  const signin = async (data: any, callback: VoidFunction) => {
    const result = await post('/token/', data);

    const token = result.access;
    const user = jwt(token);
    console.log(user);
    setToken(token);
    setRefreshToken(result.refresh);
    setUser(user);
    callback();
  };

  const signout = (callback: VoidFunction) => {
    setUser(null);
    setToken(null);
    setRefreshToken(null);
    callback();
  };

  const refreshAccessToken = async() => {
    const result = await post('/token/refresh/', {
      refresh_token: refreshToken,
    });
    if (result.access && result.refresh) {
      const token = result.access;
      setToken(token);
      setRefreshToken(result.refresh);
      return token;
    }
    return null;
  };

  const options = {
    interceptors: {
      request: async ({ options }: any) => {
        if (token) {
          options.headers.Authorization = `Bearer ${token}`;
        }
        return options;
      },
      response: async ({ response }: any) => {
        const res = response;
        console.log(res);
        //if (res.status === 401 && res.code === 'token_not_valid') {
        //}
        //return res;
      },
    },
  };

  const value = { user, token, signin, signout, loading, error };
  const httpProvider = React.cloneElement(children, { options });

  return (
    <AuthContext.Provider value={value}>{httpProvider}</AuthContext.Provider>
  );
}

function useAuth() {
  return React.useContext(AuthContext);
}

function AuthStatus() {
  const auth = useAuth();
  const navigate = useNavigate();
  console.log(auth);

  if (!auth.user) {
    return <p>You are not logged in.</p>;
  }

  return (
    <p>
      Welcome{' '}
      <button
        onClick={() => {
          auth.signout(() => navigate('/'));
        }}
      >
        Sign out
      </button>
    </p>
  );
}

export function RequireAuth({ children }: { children: JSX.Element }) {
  const auth = useAuth();
  const location = useLocation();

  if (!auth.user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const auth = useAuth();

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const username = formData.get('username') as string;

    const data = {
      username: 'test',
      password: 'test',
    };

    //const user = await post(url, data);
    //console.log(user);
    auth.signin(data, () => {
      navigate(from, { replace: true });
    });
  };

  return (
    <div>
      <p>You must log in to view the page at {from}</p>

      <form onSubmit={handleSubmit}>
        <label>
          Username: <input name="username" type="text" />
        </label>{' '}
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

function PublicPage() {
  return <h3>Public</h3>;
}

function ProtectedPage() {
  return <h3>Protected</h3>;
}
