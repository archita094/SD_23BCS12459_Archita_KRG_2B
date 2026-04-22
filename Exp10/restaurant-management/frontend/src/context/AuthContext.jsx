import React, { createContext, useState, useContext, useEffect } from 'react';
import { loginUser } from '../api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check local storage for persistent session
    const storedUser = localStorage.getItem('auth_user');
    const token = localStorage.getItem('jwt_token');
    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
    } else {
        localStorage.removeItem('auth_user');
        localStorage.removeItem('jwt_token');
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    try {
        const response = await loginUser(username, password);
        // response typically has {token, username, role}
        // Roles from Spring come as "ROLE_ADMIN". We might want to normalize it to "admin"
        const role = response.role === 'ROLE_ADMIN' ? 'admin' : 'customer';
        
        const authenticatedUser = { username: response.username, role };
        
        setUser(authenticatedUser);
        localStorage.setItem('auth_user', JSON.stringify(authenticatedUser));
        localStorage.setItem('jwt_token', response.token);
        
        return { success: true, role };
    } catch (error) {
        return { success: false, role: null, error: error.message };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('auth_user');
    localStorage.removeItem('jwt_token');
  };

  if (loading) {
      return <div>Loading session...</div>;
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
