
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User, CourseType } from '../types';
import { LogOut, GraduationCap, Briefcase, Calculator, ClipboardList, Search } from 'lucide-react';

interface DashboardProps {
  user: User;
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onLogout }) => {
  const navigate = useNavigate();

  const courses: { id: CourseType; name: string; icon: React.ReactNode; color: string }[] = [
    { id: 'BCA', name: 'Bachelor of Computer Applications', icon: <Calculator size={32} />, color: 'bg-blue-500' },
    { id: 'BCOM', name: 'Bachelor of Commerce', icon: <Briefcase size={32} />, color: 'bg-emerald-500' },
    { id: 'BBA', name: 'Bachelor of Business Administration', icon: <GraduationCap size={32} />, color: 'bg-orange-500' },
  ];

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <header className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Welcome, {user.name}</h1>
          <p className="text-slate-500">{user.role} Control Panel</p>
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => navigate('/records')}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 transition-all"
          >
            <Search size={18} />
            Search Records
          </button>
          <button
            onClick={onLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-all"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </header>

      <div className="mb-8 p-6 bg-white rounded-2xl border border-slate-100 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-800 mb-6 flex items-center gap-2">
          <ClipboardList className="text-indigo-600" />
          Select Discipline Stream
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {courses.map((course) => (
            <button
              key={course.id}
              onClick={() => navigate(`/course/${course.id}`)}
              className="group relative overflow-hidden bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-indigo-300 transition-all text-left"
            >
              <div className={`${course.color} w-16 h-16 rounded-xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform`}>
                {course.icon}
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-2">{course.id}</h3>
              <p className="text-slate-500">{course.name}</p>
              <div className="mt-6 flex items-center text-indigo-600 font-semibold text-sm">
                Open Directory &rarr;
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-indigo-600 rounded-2xl p-8 text-white">
          <h3 className="text-xl font-bold mb-2">Quick Stats</h3>
          <p className="opacity-80 mb-6">Overview of today's discipline activity</p>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/10 p-4 rounded-xl">
              <span className="block text-3xl font-bold">12</span>
              <span className="text-xs uppercase tracking-wider opacity-70 font-semibold">Issues Today</span>
            </div>
            <div className="bg-white/10 p-4 rounded-xl">
              <span className="block text-3xl font-bold">780</span>
              <span className="text-xs uppercase tracking-wider opacity-70 font-semibold">Total Students</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl p-8 border border-slate-200">
          <h3 className="text-xl font-bold text-slate-800 mb-4">Recent Notifications</h3>
          <div className="space-y-4">
            <div className="flex gap-4 p-3 bg-slate-50 rounded-lg">
              <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center flex-shrink-0 font-bold">!</div>
              <div>
                <p className="text-sm font-semibold text-slate-800">System Maintenance</p>
                <p className="text-xs text-slate-500">Scheduled for tonight at 12:00 AM IST</p>
              </div>
            </div>
            <div className="flex gap-4 p-3 bg-slate-50 rounded-lg">
              <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center flex-shrink-0 font-bold">i</div>
              <div>
                <p className="text-sm font-semibold text-slate-800">New Semester Started</p>
                <p className="text-xs text-slate-500">Student list synchronized with UUCMS database.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
