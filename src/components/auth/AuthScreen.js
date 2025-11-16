import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';

export default function AuthScreen() {
  const { login, register } = useAuth();
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (mode === 'login') {
        await login(form.email, form.password);
      } else {
        await register(form.username, form.email, form.password);
      }
    } catch (err) {
      const msg = err?.response?.data?.detail || err.message || 'Authentication failed';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow p-8">
        <h1 className="text-2xl font-bold text-center mb-6">
          {mode === 'login' ? 'Sign in' : 'Create account'}
        </h1>
        <ErrorMessage message={error} />
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {mode === 'register' && (
            <div>
              <label className="block text-sm font-medium mb-1">Username</label>
              <input
                name="username"
                value={form.username}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
                required
              />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded flex items-center justify-center"
            disabled={loading}
          >
            {loading ? <LoadingSpinner /> : mode === 'login' ? 'Login' : 'Register'}
          </button>
        </form>
        <p className="text-center text-sm mt-4">
          {mode === 'login' ? (
            <>
              No account?{' '}
              <button
                className="text-blue-600 underline"
                onClick={() => setMode('register')}
              >
                Register
              </button>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <button
                className="text-blue-600 underline"
                onClick={() => setMode('login')}
              >
                Login
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
