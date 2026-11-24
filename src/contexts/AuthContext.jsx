import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [username, setUsername] = useState(() => localStorage.getItem("username"));

  const login = (access, refresh, name) => {
    localStorage.setItem("token", access);
    if (refresh) localStorage.setItem("refresh", refresh);
    if (name) localStorage.setItem("username", name);
    setToken(access);
    setUsername(name || null);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refresh");
    localStorage.removeItem("username");
    setToken(null);
    setUsername(null);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn: !!token, username, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}