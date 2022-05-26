interface User {
    access: string;
    refresh: string;
    username: string;
    email: string;
}

const getRefreshToken = () => {
  return getUser().refresh;
};
const getAccessToken = () => {
  return getUser().access;
};
const updateAccessToken = (token: string) => {
  const user = getUser();
  user.accessToken = token;
  localStorage.setItem('user', JSON.stringify(user));
};
const getUser = () => {
  const user = localStorage.getItem('user');
  if (user) {
    return JSON.parse(user);
  }
  return null;
};
const setUser = (user: User) => {
  console.log('set user');
  localStorage.setItem('user', JSON.stringify(user));
};
const removeUser = () => {
  localStorage.removeItem('user');
};
const TokenService = {
  getRefreshToken,
  getAccessToken,
  updateAccessToken,
  getUser,
  setUser,
  removeUser,
};
export default TokenService;
