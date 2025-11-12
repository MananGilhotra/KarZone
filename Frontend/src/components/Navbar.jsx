import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import logocar from '../assets/logocar.png';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if user is logged in by checking for token
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('isLoggedIn');
    setIsLoggedIn(false);
    navigate('/');
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="w-full px-8 py-6 bg-black">
      <div className="max-w-7xl mx-auto bg-gray-100 rounded-full px-8 py-4 flex items-center justify-between shadow-lg">
        {/* Logo and Brand */}
        <Link to="/" className="flex items-center gap-3">
          <img src={logocar} alt="KARZONE Logo" className="h-10 w-auto" />
          <span className="text-2xl font-bold text-gray-900 tracking-tight">KARZONE</span>
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center gap-1">
          <Link
            to="/"
            className={`px-4 py-2 text-base font-medium transition-colors ${
              isActive('/') 
                ? 'text-orange-500' 
                : 'text-gray-700 hover:text-gray-900'
            }`}
          >
            Home
            {isActive('/') && (
              <div className="w-full h-0.5 bg-orange-500 mt-1"></div>
            )}
          </Link>
          
          <div className="w-px h-5 bg-gray-300 mx-2"></div>
          
          <Link
            to="/cars"
            className={`px-4 py-2 text-base font-medium transition-colors ${
              isActive('/cars') 
                ? 'text-orange-500' 
                : 'text-gray-700 hover:text-gray-900'
            }`}
          >
            Cars
            {isActive('/cars') && (
              <div className="w-full h-0.5 bg-orange-500 mt-1"></div>
            )}
          </Link>
          
          <div className="w-px h-5 bg-gray-300 mx-2"></div>
          
          <Link
            to="/contact"
            className={`px-4 py-2 text-base font-medium transition-colors ${
              isActive('/contact') 
                ? 'text-orange-500' 
                : 'text-gray-700 hover:text-gray-900'
            }`}
          >
            Contact
            {isActive('/contact') && (
              <div className="w-full h-0.5 bg-orange-500 mt-1"></div>
            )}
          </Link>
        </div>

        {/* Login/Logout */}
        <div className="flex items-center">
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M3 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1zm7.707 3.293a1 1 0 010 1.414L9.414 9H17a1 1 0 110 2H9.414l1.293 1.293a1 1 0 01-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-lg font-medium">Logout</span>
            </button>
          ) : (
            <Link
              to="/login"
              className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-lg font-medium">Login</span>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

