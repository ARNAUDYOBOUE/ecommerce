import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { message } from 'antd';

const API_URL = '/api';

// Configuration Axios
axios.defaults.withCredentials = true;
axios.defaults.headers.common['Content-Type'] = 'application/json';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await axios.get(`${API_URL}/auth/me`, {
        withCredentials: true,
        headers: {
          'Accept': 'application/json'
        }
      });
      if (response.data) {
        setUser(response.data);
      }
    } catch (error) {
      console.error('Erreur de vérification d\'authentification:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password
      }, {
        withCredentials: true,
        headers: {
          'Accept': 'application/json'
        }
      });
      setUser(response.data);
      message.success('Connexion réussie');
      return response.data;
    } catch (error) {
      console.error('Erreur de connexion:', error);
      message.error(error.response?.data?.message || 'Erreur de connexion');
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const response = await axios.post(`${API_URL}/auth/register`, userData, {
        withCredentials: true,
        headers: {
          'Accept': 'application/json'
        }
      });
      setUser(response.data);
      message.success('Inscription réussie');
      return response.data;
    } catch (error) {
      console.error('Erreur d\'inscription:', error);
      message.error(error.response?.data?.message || 'Erreur d\'inscription');
      throw error;
    }
  };

  const logout = async () => {
    try {
      await axios.post(`${API_URL}/auth/logout`, {}, {
        withCredentials: true,
        headers: {
          'Accept': 'application/json'
        }
      });
      setUser(null);
      message.success('Déconnexion réussie');
    } catch (error) {
      console.error('Erreur de déconnexion:', error);
      message.error('Erreur lors de la déconnexion');
    }
  };

  const updateUser = async (userData) => {
    try {
      const response = await axios.put(`${API_URL}/auth/me`, userData, {
        withCredentials: true,
        headers: {
          'Accept': 'application/json'
        }
      });
      setUser(response.data);
      message.success('Profil mis à jour avec succès');
      return response.data;
    } catch (error) {
      console.error('Erreur de mise à jour du profil:', error);
      message.error(error.response?.data?.message || 'Erreur de mise à jour du profil');
      throw error;
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateUser
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};