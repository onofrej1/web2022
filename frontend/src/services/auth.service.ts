import { User } from 'context/auth.context';

const getRefreshToken = () => {
  return localStorage.getItem('refreshToken');
};
const getAccessToken = () => {
  return localStorage.getItem('accessToken');
};

const setRefreshToken = (refreshToken: string) => {
  localStorage.setItem('refreshToken', refreshToken);
};
const setAccessToken = (accessToken: string) => {
  localStorage.setItem('accessToken', accessToken);
};
const setUser = (user: User) => {
  localStorage.setItem('user', JSON.stringify(user));
};

const getUser = () => {
  const user = localStorage.getItem('user');
  if (user) {
    return JSON.parse(user);
  }
  return null;
};

const AuthService = {
  getRefreshToken,
  getAccessToken,
  setRefreshToken,
  setAccessToken,
  setUser,
  getUser,
};
export default AuthService;
