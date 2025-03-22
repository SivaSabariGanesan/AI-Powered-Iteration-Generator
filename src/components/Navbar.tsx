import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, LogOut, Home, BookMarked, LogIn, UserPlus } from 'lucide-react';

interface NavbarProps {
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
}

const Navbar: React.FC<NavbarProps> = ({ isAuthenticated, setIsAuthenticated }) => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    navigate('/login');
  };

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-2xl font-bold">TravelPlanner</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              to="/"
              className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              <Home size={18} />
              <span>Home</span>
            </Link>
            
            {isAuthenticated && (
              <Link
                to="/saved"
                className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                <BookMarked size={18} />
                <span>Saved Trips</span>
              </Link>
            )}

            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  <LogIn size={18} />
                  <span>Login</span>
                </Link>
                <Link
                  to="/register"
                  className="flex items-center space-x-1 px-4 py-2 rounded-md text-sm font-medium bg-white text-blue-600 hover:bg-gray-100 transition-colors"
                >
                  <UserPlus size={18} />
                  <span>Register</span>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              to="/"
              className="flex items-center space-x-2 block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-700"
              onClick={() => setIsMenuOpen(false)}
            >
              <Home size={18} />
              <span>Home</span>
            </Link>

            {isAuthenticated && (
              <Link
                to="/saved"
                className="flex items-center space-x-2 block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-700"
                onClick={() => setIsMenuOpen(false)}
              >
                <BookMarked size={18} />
                <span>Saved Trips</span>
              </Link>
            )}

            {isAuthenticated ? (
              <button
                onClick={() => {
                  handleLogout();
                  setIsMenuOpen(false);
                }}
                className="flex items-center space-x-2 w-full text-left px-3 py-2 rounded-md text-base font-medium hover:bg-blue-700"
              >
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  className="flex items-center space-x-2 block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-700"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <LogIn size={18} />
                  <span>Login</span>
                </Link>
                <Link
                  to="/register"
                  className="flex items-center space-x-2 block px-3 py-2 rounded-md text-base font-medium bg-white text-blue-600 hover:bg-gray-100 mt-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <UserPlus size={18} />
                  <span>Register</span>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;