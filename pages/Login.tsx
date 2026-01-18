
import React, { useState } from 'react';
import { Role, User } from '../types';
import { ShieldCheck, UserCircle, Users, ArrowLeft, Mail, Lock, User as UserIcon } from 'lucide-react';
import { loginUser, registerUser, resetPassword } from '../services/authService';

interface LoginProps {
  onLogin: (user: User) => void;
}

type ViewMode = 'LOGIN' | 'SIGNUP' | 'FORGOT_PASSWORD';

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [mode, setMode] = useState<ViewMode>('LOGIN');
  const [role, setRole] = useState<Role>('TEACHER');
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const resetForm = () => {
    setName('');
    setEmail('');
    setPassword('');
    setError('');
    setSuccess('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (mode === 'LOGIN') {
      const result = loginUser(email, password);
      if (result.success && result.user) {
        onLogin(result.user);
      } else {
        setError(result.message);
      }
    } else if (mode === 'SIGNUP') {
      if (!name) return setError('Name is required');
      if (password.length < 6) return setError('Password must be at least 6 characters');
      
      const result = registerUser(name, email, password, role);
      if (result.success) {
        setSuccess('Account created successfully! You can now login.');
        setTimeout(() => setMode('LOGIN'), 1500);
      } else {
        setError(result.message);
      }
    } else if (mode === 'FORGOT_PASSWORD') {
      const result = resetPassword(email);
      if (result.success) {
        setSuccess(result.message);
      } else {
        setError(result.message);
      }
    }
  };

  const rolesConfig = [
    { id: 'ADMIN' as Role, label: 'Admin', icon: <ShieldCheck size={18} /> },
    { id: 'TEACHER' as Role, label: 'Teacher', icon: <UserCircle size={18} /> },
    { id: 'STUDENT' as Role, label: 'Student', icon: <Users size={18} /> },
  ];

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden transition-all duration-300">
        <div className="p-8">
          <div className="flex justify-center mb-4">
            <div className="bg-indigo-100 p-3 rounded-2xl text-indigo-600">
              <ShieldCheck size={40} />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-center text-slate-800 mb-1">RNSFGC</h2>
          <p className="text-center text-slate-500 mb-6 text-sm font-medium">Discipline Management System</p>

          {mode !== 'FORGOT_PASSWORD' && (
            <div className="grid grid-cols-3 gap-2 mb-6">
              {rolesConfig.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setRole(r.id)}
                  className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl border-2 transition-all ${
                    role === r.id 
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-600 shadow-sm' 
                      : 'border-slate-100 hover:border-slate-200 text-slate-400'
                  }`}
                >
                  {r.icon}
                  <span className="text-[10px] font-bold mt-1 uppercase tracking-wider">{r.label}</span>
                </button>
              ))}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'SIGNUP' && (
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase ml-1">Full Name</label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                    placeholder="John Doe"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                  placeholder="name@email.com"
                />
              </div>
            </div>

            {mode !== 'FORGOT_PASSWORD' && (
              <div className="space-y-1">
                <div className="flex justify-between items-center ml-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Password</label>
                  {mode === 'LOGIN' && (
                    <button 
                      type="button"
                      onClick={() => { setMode('FORGOT_PASSWORD'); resetForm(); }}
                      className="text-xs font-bold text-indigo-600 hover:text-indigo-700"
                    >
                      Forgot?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            )}

            {error && <div className="p-3 bg-red-50 text-red-600 rounded-xl text-xs font-semibold border border-red-100">{error}</div>}
            {success && <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl text-xs font-semibold border border-emerald-100">{success}</div>}

            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-indigo-100 transition-all transform active:scale-[0.98]"
            >
              {mode === 'LOGIN' ? `Login as ${role}` : mode === 'SIGNUP' ? 'Create Account' : 'Send Reset Link'}
            </button>
          </form>

          <div className="mt-6 text-center">
            {mode === 'LOGIN' ? (
              <p className="text-sm text-slate-500 font-medium">
                Don't have an account?{' '}
                <button onClick={() => { setMode('SIGNUP'); resetForm(); }} className="text-indigo-600 font-bold hover:underline">Sign Up</button>
              </p>
            ) : mode === 'SIGNUP' ? (
              <p className="text-sm text-slate-500 font-medium">
                Already have an account?{' '}
                <button onClick={() => { setMode('LOGIN'); resetForm(); }} className="text-indigo-600 font-bold hover:underline">Login</button>
              </p>
            ) : (
              <button 
                onClick={() => { setMode('LOGIN'); resetForm(); }}
                className="inline-flex items-center gap-2 text-sm text-slate-500 font-bold hover:text-indigo-600"
              >
                <ArrowLeft size={16} /> Back to Login
              </button>
            )}
          </div>
        </div>
        <div className="bg-slate-50 px-8 py-4 text-center border-t border-slate-100">
          <p className="text-slate-400 text-[10px] uppercase tracking-widest font-bold">
            Authorized RNSFGC Personnel Only
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
