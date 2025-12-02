import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import logocar from '../assets/logocar.png';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuRef = useRef(null);
  const buttonRef = useRef(null);


  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleStorageChange = () => {
      setIsLoggedIn(!!localStorage.getItem('token'));
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem('token'));
    setIsOpen(false);
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('isLoggedIn');
    setIsLoggedIn(false);
    navigate('/');
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isOpen &&
        menuRef.current &&
        buttonRef.current &&
        !menuRef.current.contains(event.target) &&
        !buttonRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape' && isOpen) setIsOpen(false);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setIsOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className={`w-full px-4 sm:px-6 py-4 sticky top-0 z-40 transition-all duration-300 ${scrolled ? 'backdrop-blur-xl bg-black/50' : 'backdrop-blur-md bg-black/40'}`}>
      <div className="max-w-7xl mx-auto glass-navbar rounded-full px-5 sm:px-8 py-3 sm:py-4 flex items-center justify-between shadow-lg border border-white/10">
        {/* Logo and Brand */}
        <Link to="/" className="flex items-center gap-3">
          <img src={logocar} alt="KARZONE Logo" className="h-10 w-auto" />
          <span className="text-2xl font-bold text-white tracking-tight">KARZONE</span>
        </Link>

        {/* Navigation Links - desktop */}
        <div className="hidden md:flex items-center gap-1">
          <Link
            to="/"
            className={`px-4 py-2 text-base font-medium transition-colors ${
              isActive('/') 
                ? 'text-orange-500' 
                : 'text-white/80 hover:text-white'
            }`}
          >
            Home
            {isActive('/') && (
              <div className="w-full h-0.5 bg-orange-500 mt-1"></div>
            )}
          </Link>
          
          <div className="w-px h-5 bg-white/20 mx-2"></div>
          
          <Link
            to="/cars"
            className={`px-4 py-2 text-base font-medium transition-colors ${
              isActive('/cars') 
                ? 'text-orange-500' 
                : 'text-white/80 hover:text-white'
            }`}
          >
            Cars
            {isActive('/cars') && (
              <div className="w-full h-0.5 bg-orange-500 mt-1"></div>
            )}
          </Link>
          
          <div className="w-px h-5 bg-white/20 mx-2"></div>
          
          <Link
            to="/contact"
            className={`px-4 py-2 text-base font-medium transition-colors ${
              isActive('/contact') 
                ? 'text-orange-500' 
                : 'text-white/80 hover:text-white'
            }`}
          >
            Contact
            {isActive('/contact') && (
              <div className="w-full h-0.5 bg-orange-500 mt-1"></div>
            )}
          </Link>

          {isLoggedIn && (
            <>
              <div className="w-px h-5 bg-white/20 mx-2"></div>
              <Link
                to="/bookings"
                className={`px-4 py-2 text-base font-medium transition-colors ${
                  isActive('/bookings') 
                    ? 'text-orange-500' 
                    : 'text-white/80 hover:text-white'
                }`}
              >
                My Bookings
                {isActive('/bookings') && (
                  <div className="w-full h-0.5 bg-orange-500 mt-1"></div>
                )}
              </Link>
            </>
          )}
        </div>

        {/* Login/Logout - desktop */}
        <div className="hidden md:flex items-center">
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-white/80 hover:text-white transition-colors"
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
              className="flex items-center gap-2 text-white/80 hover:text-white transition-colors"
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

        {/* Mobile menu toggle */}
        <button
          ref={buttonRef}
          type="button"
          className="md:hidden inline-flex items-center justify-center p-2 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500"
          aria-expanded={isOpen}
          onClick={() => setIsOpen((prev) => !prev)}
        >
          {isOpen ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4A1 1 0 013 5zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm1 4a1 1 0 000 2h12a1 1 0 100-2H4z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile dropdown menu */}
      {isOpen && (
        <div
          ref={menuRef}
          className="md:hidden max-w-7xl mx-auto mt-2 rounded-2xl glass-navbar border border-white/10 px-4 py-4 space-y-2 shadow-xl"
        >
          <Link
            to="/"
            onClick={() => setIsOpen(false)}
            className={`block w-full px-3 py-2 rounded-lg text-base font-medium ${
              isActive('/') ? 'bg-gray-800 text-orange-500' : 'text-gray-200 hover:bg-gray-800'
            }`}
          >
            Home
          </Link>
          <Link
            to="/cars"
            onClick={() => setIsOpen(false)}
            className={`block w-full px-3 py-2 rounded-lg text-base font-medium ${
              isActive('/cars') ? 'bg-gray-800 text-orange-500' : 'text-gray-200 hover:bg-gray-800'
            }`}
          >
            Cars
          </Link>
          <Link
            to="/contact"
            onClick={() => setIsOpen(false)}
            className={`block w-full px-3 py-2 rounded-lg text-base font-medium ${
              isActive('/contact')
                ? 'bg-gray-800 text-orange-500'
                : 'text-gray-200 hover:bg-gray-800'
            }`}
          >
            Contact
          </Link>

          {isLoggedIn && (
            <Link
              to="/bookings"
              onClick={() => setIsOpen(false)}
              className={`block w-full px-3 py-2 rounded-lg text-base font-medium ${
                isActive('/bookings')
                  ? 'bg-gray-800 text-orange-500'
                  : 'text-gray-200 hover:bg-gray-800'
              }`}
            >
              My Bookings
            </Link>
          )}

          <div className="border-t border-gray-700 pt-3 mt-2">
            {isLoggedIn ? (
              <button
                onClick={() => {
                  setIsOpen(false);
                  handleLogout();
                }}
                className="w-full text-left px-3 py-2 rounded-lg text-base font-medium text-red-400 hover:bg-gray-800"
              >
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="block w-full px-3 py-2 rounded-lg text-base font-medium text-gray-200 hover:bg-gray-800"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

