import React, { useEffect } from 'react';
import { getOptions } from 'services/http.service';
import TokenService from 'services/token.service';
import useFetch from 'use-http';

export interface User {
  access: string;
  refresh: string;
  username: string;
  email: string;
}

interface AuthContextType {
  user: User;
  setUser: any;
}

const AuthContext = React.createContext<AuthContextType>(null!);

export const AuthProvider = ({ userData, children }: any) => {
  const [user, setUser] = React.useState(userData);

  const providerOptions = getOptions(user, setUser, useFetch('http://localhost:8000/api'));
  const httpProvider = React.cloneElement(children, { options: providerOptions });

  useEffect(() => {
    TokenService.setUser(user);
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {httpProvider}
    </AuthContext.Provider>
  );
};

export const useAuth = () => React.useContext(AuthContext);
