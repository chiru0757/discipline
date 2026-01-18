
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { User, CourseType, YearType, DISCIPLINE_ISSUES, Student } from '../types';
import { getStudents, saveRecord } from '../services/dataService';
import { ChevronLeft, Save, Search, AlertCircle, CheckCircle2 } from 'lucide-react';

interface StudentListProps {
  user: User;
}

const StudentList: React.FC<StudentListProps> = ({ user }) => {
  const { course, year } = useParams<{ course: CourseType; year: YearType }>();
  const navigate = useNavigate();
  
  const [students, setStudents] = useState<Student[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIssues, setSelectedIssues] = useState<{ [uucms: string]: string }>({});
  const [reasons, setReasons] = useState<{ [uucms: string]: string }>({});
  const [loading, setLoading] = useState(true);
  const [notif, setNotif] = useState<{msg: string, type: 'success' | 'error'} | null>(null);

  useEffect(() => {
    if (course && year) {
      setLoading(true);
      // Simulate fetch delay
      setTimeout(() => {
        setStudents(getStudents(course, year));
        setLoading(false);
      }, 500);
    }
  }, [course, year]);

  const handleSave = (uucms: string) => {
    const issue = selectedIssues[uucms];
    const reason = reasons[uucms] || '';

    if (!issue) {
      setNotif({ msg: 'Please select an issue type', type: 'error' });
      return;
    }

    saveRecord({
      uucms_no: uucms,
      issue_type: issue,
      reason: reason,
      reported_by: user.name
    });

    setNotif({ msg: `Record saved for ${uucms}`, type: 'success' });
    
    // Reset inputs for that student
    setSelectedIssues(prev => {
      const n = { ...prev };
      delete n[uucms];
      return n;
    });
    setReasons(prev => {
      const n = { ...prev };
      delete n[uucms];
      return n;
    });

    setTimeout(() => setNotif(null), 3000);
  };

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    s.uucms_no.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <button
            onClick={() => navigate(`/course/${course}`)}
            className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 mb-2 transition-colors"
          >
            <ChevronLeft size={20} />
            Back to Year Selection
          </button>
          <h1 className="text-3xl font-bold text-slate-800">{course} - {year}</h1>
          <p className="text-slate-500">Student Discipline Management Portal</p>
        </div>

        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search by name or UUCMS..."
            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {notif && (
        <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 animate-bounce shadow-md ${
          notif.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'
        }`}>
          {notif.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
          <span className="font-semibold">{notif.msg}</span>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-sm font-bold text-slate-600 uppercase tracking-wider">UUCMS No</th>
                <th className="px-6 py-4 text-sm font-bold text-slate-600 uppercase tracking-wider">Name</th>
                <th className="px-6 py-4 text-sm font-bold text-slate-600 uppercase tracking-wider">Discipline Issues</th>
                <th className="px-6 py-4 text-sm font-bold text-slate-600 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                      <p className="text-slate-500">Loading student directory...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-20 text-center text-slate-400">
                    No students found matching your criteria.
                  </td>
                </tr>
              ) : filteredStudents.map((student) => (
                <tr key={student.uucms_no} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-mono text-indigo-600 font-bold">{student.uucms_no}</td>
                  <td className="px-6 py-4 font-medium text-slate-800">{student.name}</td>
                  <td className="px-6 py-4 min-w-[300px]">
                    <div className="flex flex-col gap-2">
                      <select
                        className="w-full p-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-1 focus:ring-indigo-500 outline-none"
                        value={selectedIssues[student.uucms_no] || ''}
                        onChange={(e) => setSelectedIssues({ ...selectedIssues, [student.uucms_no]: e.target.value })}
                      >
                        <option value="">Select Issue Type</option>
                        {DISCIPLINE_ISSUES.map(issue => (
                          <option key={issue} value={issue}>{issue}</option>
                        ))}
                      </select>
                      
                      {selectedIssues[student.uucms_no] === 'Other' && (
                        <textarea
                          placeholder="Provide specific reasons..."
                          className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-1 focus:ring-indigo-500 outline-none h-20 resize-none"
                          value={reasons[student.uucms_no] || ''}
                          onChange={(e) => setReasons({ ...reasons, [student.uucms_no]: e.target.value })}
                        />
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleSave(student.uucms_no)}
                      disabled={!selectedIssues[student.uucms_no]}
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition-all ${
                        selectedIssues[student.uucms_no]
                          ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-100 active:scale-95'
                          : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                      }`}
                    >
                      <Save size={16} />
                      Save
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StudentList;
