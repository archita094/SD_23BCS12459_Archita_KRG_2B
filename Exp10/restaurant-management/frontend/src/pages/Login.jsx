import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { LogIn } from 'lucide-react';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const { success, role, error: loginError } = await login(username, password);
    setLoading(false);
    if (success) {
      if (role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } else {
      setError(loginError || 'Invalid username or password');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] px-4">
      <div className="glass-panel p-10 rounded-2xl w-full max-w-md animate-fade-in text-center">
        <div className="flex justify-center mb-6">
          <div className="bg-primary/20 p-4 rounded-full border border-primary/30">
            <LogIn className="w-8 h-8 text-primary" />
          </div>
        </div>
        <h2 className="font-serif text-3xl font-bold text-white mb-2">Welcome Back</h2>
        <p className="text-slate-400 mb-8">Sign in to AP Restaurant. Use 'admin' or 'user' credentials.</p>
        
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm p-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5 text-left">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300 ml-1">Username</label>
            <input 
              required 
              type="text" 
              value={username} 
              onChange={e => setUsername(e.target.value)} 
              className="input-field" 
              placeholder="Enter your username" 
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300 ml-1">Password</label>
            <input 
              required 
              type="password" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              className="input-field" 
              placeholder="Enter your password" 
            />
          </div>
          <button type="submit" disabled={loading} className={`btn-primary w-full py-3 mt-4 text-lg ${loading ? 'opacity-75 cursor-not-allowed' : ''}`}>
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <p className="mt-8 text-slate-400 text-sm">
          Don't have an account?{' '}
          <Link to="/register" className="text-primary hover:text-primary-dark font-medium underline underline-offset-4">
            Sign up here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
