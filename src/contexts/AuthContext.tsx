import React, { createContext, useState, useEffect, ReactNode } from "react";

interface Auth {
  token: string;
  user: {
    id: number;
    name: string;
    email: string;
  } | null;
}

interface AuthContextType {
  auth: Auth | null;
  setAuth: React.Dispatch<React.SetStateAction<Auth | null>>;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [auth, setAuth] = useState<Auth | null>(() => {
    const savedToken = localStorage.getItem("accessToken");
    const savedRefreshToken = localStorage.getItem("refreshToken");
    const savedUser = localStorage.getItem("user");

    if (savedToken && savedRefreshToken) {
      return {
        token: savedToken,
        user: savedUser ? JSON.parse(savedUser) : null,
      };
    }
    return null;
  });

  useEffect(() => {
    if (auth) {
      localStorage.setItem("accessToken", auth.token);
      if (auth.user) {
        localStorage.setItem("user", JSON.stringify(auth.user));
      } else {
        localStorage.removeItem("user");
      }
    } else {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
    }
  }, [auth]);

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
