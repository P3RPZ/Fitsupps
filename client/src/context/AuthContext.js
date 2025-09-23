import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  const login = (email) => {
    setIsLoggedIn(true);
    setUser({ email });

    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("userEmail", email);
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUser(null);

    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userEmail");
  };

  React.useEffect(() => {
    const storedLoginState = localStorage.getItem("isLoggedIn");
    const storedEmail = localStorage.getItem("userEmail");

    if (storedLoginState === "true" && storedEmail) {
      setIsLoggedIn(true);
      setUser({ email: storedEmail });
    }
  }, []);

  const value = {
    isLoggedIn,
    user,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
