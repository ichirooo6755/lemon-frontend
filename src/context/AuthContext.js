import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

/**
 * Authentication Context
 * Manages user authentication state across the application
 */
const AuthContext = createContext(null);

/**
 * AuthProvider Component
 * Wraps the application to provide authentication context
 */
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Check for existing authentication on mount
    useEffect(() => {
        const token = localStorage.getItem('token');
        const savedUser = localStorage.getItem('user');
        
        if (token && savedUser) {
            setUser(JSON.parse(savedUser));
        }
        setLoading(false);
    }, []);

    /**
     * Login user
     * @param {string} email - User email
     * @param {string} password - User password
     * @returns {Object} Success status and error message if failed
     */
    const login = async (email, password) => {
        try {
            const { access_token, user: userData } = await api.auth.login(email, password);
            localStorage.setItem('token', access_token);
            localStorage.setItem('user', JSON.stringify(userData));
            setUser(userData);
            return { success: true };
        } catch (error) {
            return { 
                success: false, 
                error: error.response?.data?.detail || 'Login failed' 
            };
        }
    };

    /**
     * Register new user
     * @param {string} email - User email
     * @param {string} password - User password
     * @param {string} username - Username
     * @returns {Object} Success status and error message if failed
     */
    const register = async (email, password, username) => {
        try {
            const { access_token, user: userData } = await api.auth.register(email, password, username);
            localStorage.setItem('token', access_token);
            localStorage.setItem('user', JSON.stringify(userData));
            setUser(userData);
            return { success: true };
        } catch (error) {
            return { 
                success: false, 
                error: error.response?.data?.detail || 'Registration failed' 
            };
        }
    };

    /**
     * Logout user
     * Clears authentication data and resets user state
     */
    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

/**
 * Custom hook to use authentication context
 * @returns {Object} Authentication context value
 */
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};
