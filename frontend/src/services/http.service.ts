import { User } from 'context/auth.context';
import TokenService from './token.service';

const getOptions = (user: User, setUser: any, fetch: any) => {
  const { error: err, post } = fetch;
  return {
    retries: 1,
    //retryDelay: 2000,
    retryOn: async ({ attempt, error, response }: any) => {
      console.log(response);
      console.log(error);
      if (response) {
        const data = await response.json();
        if (data.code === 'token_not_valid') {
          const result = await post('/token/refresh/', {
            refresh: user.refresh,
          });
          if (err) {
            console.log(err);
            return false;
          }
          const updatedUser = { ...user };
          updatedUser.access = result.access;
          setUser(updatedUser);
          return true;
        }
      }
      return false;
    },
    interceptors: {
      request: async (data: any) => {
        const { options } = data;
        const a = TokenService.getAccessToken();
        if (a) {
          options.headers.Authorization = `Bearer ${a}`;
        }
        return options;
      },
      //response: async ({ response }: any) => {
      //  console.log(response);
      // check if refresh token is valid first
      //if (response.status === 401 && response.data.code === 'token_not_valid') {

      //}
      //  return response;
      //},
    },
  };
};

export { getOptions };
