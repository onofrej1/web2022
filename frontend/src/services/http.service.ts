import AuthService from './auth.service';

const getRequestOptions = () => {
  return {
    retries: 1,
    interceptors: {
      request: async ({ options }: any) => {        
        const accessToken = AuthService.getAccessToken();
        if (accessToken) {
          options.headers.Authorization = `Bearer ${accessToken}`;
        }
        return options;
      },
      response: async (opt: any) => {
        const { response } = opt;
        if (response.status === 401 && response.data.code === 'token_not_valid') {
          const accessToken = AuthService.getAccessToken();
          const result = await fetch('http://localhost:8000/api/token/refresh/', {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${accessToken}`,
            },
            body: JSON.stringify({refresh: AuthService.getRefreshToken()})
          });
          const data = await result.json();
          AuthService.setAccessToken(data.access);
        }
        return response;
      },
    },
  };
};

export { getRequestOptions };
