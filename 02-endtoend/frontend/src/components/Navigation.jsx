import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/index.js';

const Navigation = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="bg-blue-600 text-white shadow-md">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <h1
            onClick={() => navigate('/')}
            className="text-2xl font-bold cursor-pointer"
          >
            Interview Platform
          </h1>
          {isAuthenticated && (
            <div className="flex gap-6">
              <button
                onClick={() => navigate('/dashboard')}
                className="hover:text-blue-200 transition"
              >
                Dashboard
              </button>
              <button
                onClick={() => navigate('/problems')}
                className="hover:text-blue-200 transition"
              >
                Problems
              </button>
            </div>
          )}
        </div>

        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <div className="flex items-center gap-2">
                <span className="text-sm">{user?.email}</span>
              </div>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500 rounded-md hover:bg-red-600 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <div className="flex gap-4">
              <button
                onClick={() => navigate('/login')}
                className="px-4 py-2 bg-white text-blue-600 rounded-md hover:bg-blue-50 transition"
              >
                Login
              </button>
              <button
                onClick={() => navigate('/register')}
                className="px-4 py-2 bg-blue-500 border border-white rounded-md hover:bg-blue-700 transition"
              >
                Register
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
