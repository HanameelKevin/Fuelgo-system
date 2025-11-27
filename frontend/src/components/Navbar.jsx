import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsOpen(false);
  };

  return (
    <nav className="bg-primary-blue shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="shrink-0 flex items-center" onClick={() => setIsOpen(false)}>
              <span className="text-2xl font-bold text-white">FUELGO</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/" className="text-white hover:text-light-blue px-3 py-2 rounded-md transition duration-200">
              Home
            </Link>
            
            {user ? (
              <>
                <Link to="/dashboard" className="text-white hover:text-light-blue px-3 py-2 rounded-md transition duration-200">
                  Dashboard
                </Link>
                <div className="relative group">
                  <button className="text-white hover:text-light-blue px-3 py-2 rounded-md transition duration-200">
                    Services ▼
                  </button>
                  <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <Link to="/order-fuel" className="block px-4 py-2 text-gray-800 hover:bg-primary-blue hover:text-white">Fuel Delivery</Link>
                    <Link to="/order-battery" className="block px-4 py-2 text-gray-800 hover:bg-primary-blue hover:text-white">Battery Delivery</Link>
                    <Link to="/order-mechanic" className="block px-4 py-2 text-gray-800 hover:bg-primary-blue hover:text-white">Mechanic Service</Link>
                    <Link to="/order-vehicle" className="block px-4 py-2 text-gray-800 hover:bg-primary-blue hover:text-white">Vehicle Rental</Link>
                  </div>
                </div>
                <Link to="/ratings" className="text-white hover:text-light-blue px-3 py-2 rounded-md transition duration-200">
                  Ratings
                </Link>
                <span className="text-light-blue px-3 py-2">Welcome, {user.name}</span>
                <button
                  onClick={handleLogout}
                  className="bg-primary-red text-white px-4 py-2 rounded-md hover:bg-light-red transition duration-200"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-white hover:text-light-blue px-3 py-2 rounded-md transition duration-200">
                  Login
                </Link>
                <Link to="/register" className="bg-primary-red text-white px-4 py-2 rounded-md hover:bg-light-red transition duration-200">
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white hover:text-gray-300 focus:outline-none"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-primary-blue border-t border-accent-blue">
              <Link to="/" className="text-white block px-3 py-2 rounded-md hover:bg-accent-blue" onClick={() => setIsOpen(false)}>Home</Link>
              
              {user ? (
                <>
                  <Link to="/dashboard" className="text-white block px-3 py-2 rounded-md hover:bg-accent-blue" onClick={() => setIsOpen(false)}>Dashboard</Link>
                  <Link to="/order-fuel" className="text-white block px-3 py-2 rounded-md hover:bg-accent-blue" onClick={() => setIsOpen(false)}>Fuel Delivery</Link>
                  <Link to="/order-battery" className="text-white block px-3 py-2 rounded-md hover:bg-accent-blue" onClick={() => setIsOpen(false)}>Battery Delivery</Link>
                  <Link to="/order-mechanic" className="text-white block px-3 py-2 rounded-md hover:bg-accent-blue" onClick={() => setIsOpen(false)}>Mechanic Service</Link>
                  <Link to="/order-vehicle" className="text-white block px-3 py-2 rounded-md hover:bg-accent-blue" onClick={() => setIsOpen(false)}>Vehicle Rental</Link>
                  <Link to="/ratings" className="text-white block px-3 py-2 rounded-md hover:bg-accent-blue" onClick={() => setIsOpen(false)}>Ratings</Link>
                  <div className="text-light-blue block px-3 py-2">Welcome, {user.name}</div>
                  <button
                    onClick={handleLogout}
                    className="text-white block w-full text-left px-3 py-2 rounded-md bg-primary-red hover:bg-light-red"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-white block px-3 py-2 rounded-md hover:bg-accent-blue" onClick={() => setIsOpen(false)}>Login</Link>
                  <Link to="/register" className="text-white block px-3 py-2 rounded-md bg-primary-red hover:bg-light-red" onClick={() => setIsOpen(false)}>Sign Up</Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;