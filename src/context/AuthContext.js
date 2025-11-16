import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiAuth } from '../services/api';

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
            const response = await apiAuth.login(email, password);
            const token = response.access_token || response.token;
            const userData = response.user || response;
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(userData));
            setUser(userData);
            return { success: true };
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    };

    /**
     * Register new user
     * @param {string} email - User email
     * @param {string} password - User password
     * @param {string} username - Username
     * @returns {Object} Success status and error message if failed
     */
    const register = async (username, email, password) => {
        try {
            const response = await apiAuth.register(username, email, password, username);
            const token = response.access_token || response.token;
            const userData = response.user || response;
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(userData));
            setUser(userData);
            return { success: true };
        } catch (error) {
            console.error('Register error:', error);
            throw error;
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
