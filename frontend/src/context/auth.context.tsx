import React from 'react';

export interface User {
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

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => React.useContext(AuthContext);
