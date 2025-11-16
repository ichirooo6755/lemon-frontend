import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Navigation() {
  const { logout } = useAuth();

  const linkBase = 'px-3 py-2 rounded-md text-sm font-medium transition-colors';

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">🈴</span>
            <h1 className="text-xl font-bold text-blue-700">Kobun Vocabulary</h1>
          </div>
          <nav className="hidden md:flex space-x-1">
            <NavLink
              to="/lists"
              className={({ isActive }) =>
                `${linkBase} ${
                  isActive ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'
                }`
              }
            >
              Lists
            </NavLink>
            <NavLink
              to="/quiz"
              className={({ isActive }) =>
                `${linkBase} ${
                  isActive ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'
                }`
              }
            >
              Quiz
            </NavLink>
            <NavLink
              to="/ocr"
              className={({ isActive }) =>
                `${linkBase} ${
                  isActive ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'
                }`
              }
            >
              OCR
            </NavLink>
            <NavLink
              to="/stats"
              className={({ isActive }) =>
                `${linkBase} ${
                  isActive ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'
                }`
              }
            >
              Stats
            </NavLink>
          </nav>
        </div>
        <button
          onClick={logout}
          className="px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Logout
        </button>
      </div>
      <div className="md:hidden border-t">
        <nav className="flex overflow-x-auto">
          <NavLink
            to="/lists"
            className={({ isActive }) =>
              `flex-1 text-center px-3 py-2 text-sm font-medium ${
                isActive ? 'bg-blue-600 text-white' : 'text-gray-600'
              }`
            }
          >
            Lists
          </NavLink>
          <NavLink
            to="/quiz"
            className={({ isActive }) =>
              `flex-1 text-center px-3 py-2 text-sm font-medium ${
                isActive ? 'bg-blue-600 text-white' : 'text-gray-600'
              }`
            }
          >
            Quiz
          </NavLink>
          <NavLink
            to="/ocr"
            className={({ isActive }) =>
              `flex-1 text-center px-3 py-2 text-sm font-medium ${
                isActive ? 'bg-blue-600 text-white' : 'text-gray-600'
              }`
            }
          >
            OCR
          </NavLink>
          <NavLink
            to="/stats"
            className={({ isActive }) =>
              `flex-1 text-center px-3 py-2 text-sm font-medium ${
                isActive ? 'bg-blue-600 text-white' : 'text-gray-600'
              }`
            }
          >
            Stats
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
