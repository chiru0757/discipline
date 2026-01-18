
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import YearSelection from './pages/YearSelection';
import StudentList from './pages/StudentList';
import Records from './pages/Records';
import { User, Role } from './types';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);

  // Persistence check (Mocking local session)
  useEffect(() => {
    const savedUser = localStorage.getItem('rnsfgc_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogin = (userData: User) => {
    setUser(userData);
    localStorage.setItem('rnsfgc_user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('rnsfgc_user');
  };

  return (
    <Router>
      <div className="min-h-screen bg-slate-50">
        <Routes>
          <Route 
            path="/login" 
            element={user ? <Navigate to="/dashboard" /> : <Login onLogin={handleLogin} />} 
          />
          
          <Route 
            path="/dashboard" 
            element={user ? <Dashboard user={user} onLogout={handleLogout} /> : <Navigate to="/login" />} 
          />

          <Route 
            path="/course/:course" 
            element={user ? <YearSelection user={user} /> : <Navigate to="/login" />} 
          />

          <Route 
            path="/course/:course/:year" 
            element={user ? <StudentList user={user} /> : <Navigate to="/login" />} 
          />

          <Route 
            path="/records" 
            element={user ? <Records user={user} /> : <Navigate to="/login" />} 
          />

          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
