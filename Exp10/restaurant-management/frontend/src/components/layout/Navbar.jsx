import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Utensils, CalendarDays, KeyRound, LogOut, LogIn } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const isActive = (path) => {
    return location.pathname === path ? "text-primary border-b-2 border-primary" : "text-white hover:text-primary transition-colors";
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="glass-panel sticky top-0 z-50 rounded-none border-x-0 border-t-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center space-x-2 text-primary">
            <Utensils className="h-6 w-6" />
            <span className="font-serif font-bold text-xl tracking-wide text-white">AP Restaurant</span>
          </div>
          
          <div className="flex items-center space-x-8 font-medium">
            {!user && (
              <Link to="/login" className="flex items-center space-x-1 py-2 text-slate-300 hover:text-primary transition-colors">
                <LogIn className="h-4 w-4" />
                <span>Login</span>
              </Link>
            )}

            {user?.role === 'customer' && (
              <>
                <Link to="/" className={`flex items-center space-x-1 py-2 ${isActive('/')}`}>
                  <span>Home</span>
                </Link>
                <Link to="/book" className={`flex items-center space-x-1 py-2 ${isActive('/book')}`}>
                  <CalendarDays className="h-4 w-4" />
                  <span>Book Table</span>
                </Link>
                <Link to="/my-reservations" className={`flex items-center space-x-1 py-2 ${isActive('/my-reservations')}`}>
                  <span>My Reservations</span>
                </Link>
              </>
            )}

            {user?.role === 'admin' && (
              <Link to="/admin" className={`flex items-center space-x-1 py-2 ${isActive('/admin')}`}>
                <KeyRound className="h-4 w-4" />
                <span>Admin</span>
              </Link>
            )}

            {user && (
              <button onClick={handleLogout} className="flex items-center space-x-1 py-2 text-slate-300 hover:text-red-400 transition-colors bg-slate-800/50 px-4 rounded-lg border border-slate-700/50 ml-4">
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
