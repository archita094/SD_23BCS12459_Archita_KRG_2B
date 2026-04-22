import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus } from 'lucide-react';
import { registerUser } from '../api';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  // Using context to manually set auth state if you wanted, but it's cleaner to redirect to login
  // Or auto-login locally if register response provides token.
  const { login } = useAuth(); // We can just call login or use our api directly.

  const handleRegister = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
        setError('Passwords do not match');
        return;
    }
    setLoading(true);
    setError('');
    
    try {
        await registerUser(username, password);
        // Auto-login
        const { success, role, error: loginError } = await login(username, password);
        setLoading(false);
        if (success) {
            navigate('/');
        } else {
            setError(loginError || 'Registration succeeded, but login failed.');
        }
    } catch (err) {
        setLoading(false);
        setError(err.message || 'Failed to register account');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] px-4 animate-fade-in">
      <div className="glass-panel p-10 rounded-2xl w-full max-w-md text-center">
        <div className="flex justify-center mb-6">
          <div className="bg-primary/20 p-4 rounded-full border border-primary/30">
            <UserPlus className="w-8 h-8 text-primary" />
          </div>
        </div>
        <h2 className="font-serif text-3xl font-bold text-white mb-2">Create Account</h2>
        <p className="text-slate-400 mb-8">Sign up to manage your reservations at AP Restaurant.</p>
        
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm p-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4 text-left">
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-300 ml-1">Username</label>
            <input required type="text" value={username} onChange={e => setUsername(e.target.value)} className="input-field" placeholder="Choose a username" />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-300 ml-1">Password</label>
            <input required type="password" value={password} onChange={e => setPassword(e.target.value)} className="input-field" placeholder="Create a password" />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-300 ml-1">Confirm Password</label>
            <input required type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="input-field" placeholder="Repeat your password" />
          </div>
          
          <button type="submit" disabled={loading} className={`btn-primary w-full py-3 mt-6 text-lg ${loading ? 'opacity-75 cursor-not-allowed' : ''}`}>
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <p className="mt-8 text-slate-400 text-sm">
          Already have an account?{' '}
          <Link to="/login" className="text-primary hover:text-primary-dark font-medium underline underline-offset-4">
            Sign in here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
