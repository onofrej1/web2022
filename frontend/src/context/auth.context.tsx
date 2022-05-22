import React, { useEffect } from 'react';
import TokenService from 'services/token.service';

interface AuthContextType {
  user: any;
  setUser: any;
}

const AuthContext = React.createContext<AuthContextType>(null!);

export const AuthProvider = ({ userData, children }: any) => {
  const [user, setUser] = React.useState(userData);

  useEffect(() => {
    TokenService.setUser(user);
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => React.useContext(AuthContext);
