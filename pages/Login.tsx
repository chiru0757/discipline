
import React, { useState } from 'react';
import { Role, User } from '../types';
import { ShieldCheck, UserCircle, Users } from 'lucide-react';

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<Role>('TEACHER');
  const [error, setError] = useState('');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // In a real app, this would use Supabase Auth
    // For this prototype, we simulate a successful login
    if (email && password.length >= 6) {
      const mockUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        email,
        role,
        name: email.split('@')[0].toUpperCase(),
      };
      onLogin(mockUser);
    } else {
      setError('Please enter a valid email and password (min 6 chars)');
    }
  };

  const rolesConfig = [
    { id: 'ADMIN' as Role, label: 'Administrator', icon: <ShieldCheck size={20} /> },
    { id: 'TEACHER' as Role, label: 'Faculty Staff', icon: <UserCircle size={20} /> },
    { id: 'STUDENT' as Role, label: 'Student View', icon: <Users size={20} /> },
  ];

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="p-8">
          <div className="flex justify-center mb-6">
            <div className="bg-indigo-100 p-4 rounded-full text-indigo-600">
              <ShieldCheck size={48} />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-center text-slate-800 mb-2">RNSFGC</h2>
          <p className="text-center text-slate-500 mb-8">Discipline Management System</p>

          <div className="grid grid-cols-3 gap-2 mb-8">
            {rolesConfig.map((r) => (
              <button
                key={r.id}
                onClick={() => setRole(r.id)}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all ${
                  role === r.id 
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-600' 
                    : 'border-slate-100 hover:border-slate-200 text-slate-500'
                }`}
              >
                {r.icon}
                <span className="text-xs font-semibold mt-1">{r.id}</span>
              </button>
            ))}
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                placeholder="Enter your email"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                placeholder="••••••••"
              />
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg shadow-lg shadow-indigo-200 transition-all transform hover:-translate-y-0.5"
            >
              Sign In to {role} Portal
            </button>
          </form>
        </div>
        <div className="bg-slate-50 p-4 text-center border-t border-slate-100">
          <p className="text-slate-500 text-sm">
            Powered by RNSFGC Systems
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
